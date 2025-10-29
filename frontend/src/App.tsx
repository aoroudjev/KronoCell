import React from "react";
import KronoToolbar from "./components/KronoToolbar/KronoToolbar";
import ImageViewer from "./components/ImageViewer/ImageViewer.tsx";
import './App.css'

const App: React.FC = () => {
    return (
        <div className={"App"}>
            <KronoToolbar/>
            <ImageViewer/>
        </div>
    );
};

export default App;