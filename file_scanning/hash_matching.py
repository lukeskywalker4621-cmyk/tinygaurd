import hashlib
import tkinter as tk
from tkinter import filedialog, messagebox


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


root = tk.Tk()
root.withdraw()  # Hide the empty Tk window

path = filedialog.askopenfilename(
                                    title="Select a file", 
                                    filetypes=[("All files", "*.*")]
                                )

if path:
    try:
        print(sha256_file(path))
    except OSError as e:
        messagebox.showerror("Could not read file", str(e))
else:
    print("No file selected.")
