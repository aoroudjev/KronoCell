import React from "react";
import KronoToolbar from "./components/KronoToolbar/KronoToolbar";
import ImageViewer from "./components/ImageViewer/ImageViewer.tsx";
import './App.css'

const App: React.FC = () => {
    return (
        <div className={"App"}>
            <KronoToolbar/>
            <h1 style={{padding: 16}}>Image Editor</h1>
            <ImageViewer/>
        </div>
    );
};

export default App;