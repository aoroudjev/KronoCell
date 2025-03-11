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
                // Fetch the image as binary
                const imageBytes = await invoke<Uint8Array>("load_image_file", {
                    filePath: selectedFilePath,
                });

                // Convert to a Blob URL
                const blob = new Blob([new Uint8Array(imageBytes)], { type: "image/png" });
                const url = URL.createObjectURL(blob);
                setImageSrc(url);
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
                    <img className="preview-image" src={imageSrc} alt="Loaded" object-fit={"cover"}/>
                ) : (
                    <p>Please select a file...</p>
                )}
            </div>
        </div>
    );
};

export default App;
