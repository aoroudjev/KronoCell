import React, {useState, useRef} from "react";
import FileExplorer from "./components/FileExplorer/FileExplorer.tsx";
import "./App.css"; // Import CSS

const MAX_WIDTH_PERCENT = 0.2;
const MIN_WIDTH = 200;

const App: React.FC = () => {
    const [sidebarWidth, setSidebarWidth] = useState(MIN_WIDTH);
    const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Handle sidebar resizing
    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        const startX = event.clientX;
        const startWidth = sidebarWidth;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = Math.min(screen.width * MAX_WIDTH_PERCENT, Math.max(MIN_WIDTH, startWidth + moveEvent.clientX - startX));
            setSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
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
