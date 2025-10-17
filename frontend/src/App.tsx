import React from "react";
import KronoToolbar from "./components/KronoToolbar/KronoToolbar";

const App: React.FC = () => {
    return (
        <div>
            <KronoToolbar />
            <h1 style={{ padding: 16 }}>This is my Application</h1>
        </div>
    );
};

export default App;