/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 */

import './frontend/index.css';

console.log(
  '👋 This message is being logged by the renderer process, included via Vite',
);

document.getElementById('mybutton')?.addEventListener('click', async () => {
  try {
    const started = await window.DOMTokenList.start("face-hiding");

    if (!started) {
      console.log("Face Hiding is already running.");
      return;
    }

    console.log("Face Hiding launch requested");
  } catch (error) {
    console.error("Failed to start Face Hiding", error);
  }
});
