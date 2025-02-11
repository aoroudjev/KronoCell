import React, {useRef, useState} from "react";
import FileExplorer from "./components/FileExplorer/FileExplorer.tsx";
import "./App.css";

const MAX_WIDTH_PERCENT = 0.5;
const MIN_WIDTH_PERCENT = 0.1;

const App: React.FC = () => {
    const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
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
                resizeRef.current = null; // Reset animation frame lock
            });
        };

        const handleMouseUp = () => {
            setSidebarWidth(widthRef.current); // Commit final width to state
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div className="app-container">
            {/* Sidebar (File Explorer) */}
            <div ref={sidebarRef} className="sidebar" style={{width: `${sidebarWidth}px`}}>
                <FileExplorer setSelectedFileContent={setSelectedFileContent}/>
            </div>

            {/* Resizer (Draggable Divider) */}
            <div className="resizer" onMouseDown={handleMouseDown}/>

            {/* Main Content*/}
            <div className="main-content">
                <h1>Main Application</h1>
                {selectedFileContent ? <pre>{selectedFileContent}</pre> : <p>Please select a file...</p>}
            </div>
        </div>
    );
};

export default App;
