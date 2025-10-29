// import React from 'react';
import BrightnessController from "./Controls/Brightness.tsx";
import "./ControlPanel.css"

const ControlPanel = () => {


    return (
        <div className="control-panel">
            <BrightnessController/>
        </div>
    );
}

export default ControlPanel;