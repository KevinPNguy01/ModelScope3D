import { useState } from "react";
import { ImportButton } from "../../features/import_menu/components/ImportButton";
import { Canvas } from "../../features/renderer/components/Canvas";
import { ControlPanel } from "../../features/transform/components/ControlPanel";
import { FileContext } from "../contexts/FileContext";

export function WebApp() {
    const [objFile, setObjFile] = useState<File | null>(null);
    const [mtlFile, setMtlFile] = useState<File | null>(null);
    const [stlFile, setStlFile] = useState<File | null>(null);

    return (
        <FileContext.Provider value={{objFile, setObjFile, mtlFile, setMtlFile, stlFile, setStlFile}}>
            <div className="w-full h-screen flex flex-col overflow-hidden">
                <header className="flex bg-secondary">
                    <ImportButton/>
                </header>
                <main className="flex flex-grow overflow-hidden">
                    <Canvas/>
                    <ControlPanel/>
                </main>
            </div>
        </FileContext.Provider>
    );
}