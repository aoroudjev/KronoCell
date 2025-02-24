import React, { useRef, useState, useEffect } from "react";
import FileExplorer from "./components/FileExplorer/FileExplorer.tsx";
import "./App.css";
import { invoke } from '@tauri-apps/api/core';

const MAX_WIDTH_PERCENT = 0.5;
const MIN_WIDTH_PERCENT = 0.1;

const App: React.FC = () => {
    const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [sidebarWidth, setSidebarWidth] = useState(300); // Initial width
    const sidebarRef = useRef<HTMLDivElement>(null);
    const widthRef = useRef(sidebarWidth);
    const resizeRef = useRef<number | null>(null); // Store animation frame ID

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        const startX = event.clientX;
        const startWidth = widthRef.current;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (resizeRef.current) return;
            resizeRef.current = requestAnimationFrame(() => {
                const newWidth = Math.min(
                    window.innerWidth * MAX_WIDTH_PERCENT,
                    Math.max(window.innerWidth * MIN_WIDTH_PERCENT, startWidth + moveEvent.clientX - startX)
                );
                if (sidebarRef.current) {
                    sidebarRef.current.style.width = `${newWidth}px`;
                }
                widthRef.current = newWidth;
                resizeRef.current = null;
            });
        };

        const handleMouseUp = () => {
            setSidebarWidth(widthRef.current);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    useEffect(() => {
        async function loadImage() {
            if (!selectedFilePath) {
                setImageSrc(null);
                return;
            }
            try {
                // Call the Rust command to load the image
                const [base64Str, mimeType] = await invoke<[string, string]>(
                    "load_image_file",
                    { filePath: selectedFilePath }
                );
                // Create a data URL using the returned base64 string and MIME type
                const dataUrl = `data:${mimeType};base64,${base64Str}`;
                setImageSrc(dataUrl);
            } catch (error) {
                console.error("Error loading image:", error);
            }
        }
        loadImage();
    }, [selectedFilePath]);

    return (
        <div className="app-container">
            {/* Sidebar (File Explorer) */}
            <div ref={sidebarRef} className="sidebar" style={{ width: `${sidebarWidth}px` }}>
                <FileExplorer setSelectedFilePath={setSelectedFilePath} />
            </div>

            {/* Resizer (Draggable Divider) */}
            <div className="resizer" onMouseDown={handleMouseDown} />

            {/* Main Content */}
            <div className="main-content">
                <h1>Main Application</h1>
                {imageSrc ? (
                    <img src={imageSrc} style={{ maxWidth: "100%", height: "auto" }} alt="Loaded" />
                ) : (
                    <p>Please select a file...</p>
                )}
            </div>
        </div>
    );
};

export default App;
