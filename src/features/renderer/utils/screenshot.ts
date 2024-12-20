import { MutableRefObject } from "react";

export function takeScreenshot(canvas: HTMLCanvasElement, screenshot: MutableRefObject<boolean>) {
    screenshot.current = false;
    const dataUrl = canvas.toDataURL('image/png');
        
    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'ModelScope_screenshot.png';  // Set the download filename
    link.click();  // Trigger the download
}