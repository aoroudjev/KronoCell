import React from "react";
import KronoToolbar from "./components/KronoToolbar/KronoToolbar";
import ImageViewer from "./components/ImageViewer/ImageViewer.tsx";

const App: React.FC = () => {
    return (
        <div>
            <KronoToolbar />
            <h1 style={{ padding: 16 }}>This is my Application</h1>
            <ImageViewer/>
        </div>
    );
};

export default App;