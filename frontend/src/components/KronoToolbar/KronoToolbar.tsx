import React from "react";
import type {MenuItem} from "primereact/menuitem";
import {Menubar} from "primereact/menubar";
import "./KronoToolbar.css";


const KronoToolbar: React.FC = () => {
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

    const menuItems: MenuItem[] = [
        {
            label: 'File',
            icon: 'pi pi-home',
            items: fileItems
        },
        {
            label: 'Edit',
            icon: 'pi pi-bars',
            items: editItems
        }
    ]

    return (
        <div>
            <Menubar model={menuItems}/>
        </div>
    );
};

export default KronoToolbar;