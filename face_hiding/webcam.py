import cv2
import os

def hide_face():
    model_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "face_detection_yunet_2026may.onnx"
    )

    if not os.path.exists(model_path):
        print("Error: YuNet model not found.")
        return

    cam = cv2.VideoCapture(0)

    if not cam.isOpened():
        print("Error: Could not access webcam.")
        return

    ret, frame = cam.read()

    if not ret:
        print("Error: Could not read webcam.")
        cam.release()
        return

    height, width = frame.shape[:2]

    detector = cv2.FaceDetectorYN.create(
        model_path,
        "",
        (width, height),
        0.6,
        0.3,
        5000
    )

    out = cv2.VideoWriter(
        "output.mp4",
        cv2.VideoWriter_fourcc(*"mp4v"),
        20.0,
        (width, height)
    )

    if not out.isOpened():
        print("Error: Could not create output.mp4.")
        cam.release()
        return

    try:
        while True:
            ret, frame = cam.read()

            if not ret:
                break

            height, width = frame.shape[:2]
            detector.setInputSize((width, height))

            try:
                _, faces = detector.detect(frame)
            except cv2.error:
                faces = None

            if faces is None or len(faces) == 0:
                frame = cv2.GaussianBlur(frame, (99, 99), 50)
            else:
                for face in faces:
                    x, y, w, h = face[:4].astype(int)

                    pad_x = int(w * 0.35)
                    pad_y = int(h * 0.35)

                    x1 = max(0, x - pad_x)
                    y1 = max(0, y - pad_y)
                    x2 = min(width, x + w + pad_x)
                    y2 = min(height, y + h + pad_y)

                    if x2 > x1 and y2 > y1:
                        region = frame[y1:y2, x1:x2]
                        frame[y1:y2, x1:x2] = cv2.GaussianBlur(
                            region, (99, 99), 50
                        )

            out.write(frame)
            cv2.imshow("Face Blocker - Press Q to quit", frame)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    finally:
        cam.release()
        out.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    hide_face()