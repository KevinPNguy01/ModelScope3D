import BiotechIcon from '@mui/icons-material/Biotech';
import { useRef, useState } from "react";
import { ExportMenu } from '../../components/ExportMenu';
import { ViewMenu } from '../../components/ViewMenu';
import { FileMenu } from '../../features/file_menu/components/FileMenu';
import { Canvas } from "../../features/renderer/components/Canvas";
import { ControlPanel } from "../../features/transform/components/ControlPanel";
import { ExportContext } from '../contexts/ExportContext';
import { FileContext } from "../contexts/FileContext";

export function WebApp() {
    const [objFile, setObjFile] = useState<File | null>(null);
    const [mtlFile, setMtlFile] = useState<File | null>(null);
    const [stlFile, setStlFile] = useState<File | null>(null);
    const [textureFiles, setTextureFiles] = useState<File[]>([]);

    const exportScreenshot = useRef(false);
    const exportSTL = useRef(false);

    return (
        <FileContext.Provider value={{objFile, setObjFile, mtlFile, setMtlFile, stlFile, setStlFile, textureFiles, setTextureFiles}}>
        <ExportContext.Provider value={{exportScreenshot, exportSTL}}>
            <div className="w-full h-screen flex flex-col overflow-hidden">
                <header className="flex bg-secondary items-center flex-shrink">
                    <div className="flex items-center select-none px-2">
                        <BiotechIcon sx={{height: 28, width: 28}} style={{color: "white"}}/>
                        <h2 className="text-white text-lg font-semibold">ModelScope</h2>
                    </div>
                    <FileMenu/>
                    <ExportMenu/>
                    <ViewMenu/>
                </header>
                <main className="flex flex-grow overflow-hidden">
                    <Canvas/>
                    <ControlPanel/>
                </main>
            </div>
        </ExportContext.Provider>
        </FileContext.Provider>
    );
}