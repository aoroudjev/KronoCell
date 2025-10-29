// import React from 'react';
import BrightnessController from "./Controls/Brightness.tsx";
import "./ControlPanel.css"
import {Accordion, AccordionTab} from "primereact/accordion";
import {useState} from "react";
import {Button} from "primereact/button";

const ControlPanel = () => {
    const [collapsed, setCollapsed] = useState(false);


    return (
        <>
            <Button className="collapse-handle p-button p-button-text p-button-plain"
                    onClick={() => setCollapsed(c => !c)}
                    aria-label="Toggle side panel"
                    icon={collapsed ? "pi pi-angle-right" : "pi pi-angle-left"}
            >
            </Button>
            <aside className={`collapsable-side-panel ${collapsed ? "is-collapsed" : ""}`}>
                <div className="panel-content">
                    <Accordion activeIndex={0}>
                        <AccordionTab header="Brightness">
                            <BrightnessController/>
                        </AccordionTab>
                    </Accordion>
                </div>


            </aside>

        </>
    );
}

export default ControlPanel;