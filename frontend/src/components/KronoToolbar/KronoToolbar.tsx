import React, {useRef} from "react";
import {Button} from "primereact/button";
import {Menu} from "primereact/menu";
import type {MenuItem} from "primereact/menuitem";


const KronoToolbar: React.FC = () => {
    const fileMenuRef = useRef<Menu>(null);
    const editMenuRef = useRef<Menu>(null);

    const menus = [fileMenuRef, editMenuRef];

    const fileItems: MenuItem[] = [
        {label: "New", icon: "pi pi-plus", command: () => console.log("New")},
        {label: "Open…", icon: "pi pi-folder-open", command: () => console.log("Open")},
        {label: "Save", icon: "pi pi-save", command: () => console.log("Save")},
        {separator: true},
        {label: "Exit", icon: "pi pi-sign-out", command: () => console.log("Exit")}
    ];

    const editItems: MenuItem[] = [
        {label: "Undo", icon: "pi pi-undo", command: () => console.log("Undo")},
        {label: "Redo", icon: "pi pi-redo", command: () => console.log("Redo")},
        {separator: true},
        {label: "Cut", icon: "pi pi-cut", command: () => console.log("Cut")},
        {label: "Copy", icon: "pi pi-copy", command: () => console.log("Copy")},
        {label: "Paste", icon: "pi pi-clipboard", command: () => console.log("Paste")}
    ];

    const hideOthers = (targetRef: React.MutableRefObject<any>, e: React.MouseEvent) => {
        for (const m of menus) {
            if (m !== targetRef) {
                // pass event when available; fall back gracefully
                if (m.current?.hide) m.current.hide(e);
                else if (m.current?.toggle) m.current.toggle(e);
            }
        }
    };

    return (
        <div
            style={{
                height: 56,
                background: "#5f5f5f",           // solid background (gray-800)
                color: "white",
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                gap: 8,
                borderRadius: 0,                 // square edges
                boxShadow: "0 2px 8px rgba(0,0,0,0.35)"
            }}
        >
            {/* File */}
            <Button
                label="File"
                icon="pi pi-bars"
                onClick={(e) => {
                    hideOthers(fileMenuRef, e);
                    fileMenuRef.current?.toggle?.(e);
                }}
                text
                style={{color: "white"}}
            />
            <Menu model={fileItems} popup ref={fileMenuRef}/>

            {/* Edit */}
            <Button
                label="Edit"
                onClick={(e) => {
                    hideOthers(editMenuRef, e);
                    editMenuRef.current?.toggle?.(e);
                }}
                text
                style={{color: "white"}}
            />
            <Menu model={editItems} popup ref={editMenuRef}/>

            {/* Title / spacer */}
            <div style={{marginLeft: 12, fontWeight: 600}}>KronoCell</div>

            {/* push right-side actions to the edge */}
            <div style={{marginLeft: "auto", display: "flex", gap: 8}}>
                {/* optional right-side buttons/icons go here */}
            </div>
        </div>
    );
};

export default KronoToolbar;