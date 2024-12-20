import BiotechIcon from '@mui/icons-material/Biotech';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ImportButton } from "../../features/import_menu/components/ImportButton";
import { Canvas } from "../../features/renderer/components/Canvas";
import { ControlPanel } from "../../features/transform/components/ControlPanel";
import { FileContext } from "../contexts/FileContext";

export function WebApp() {
    const navigate = useNavigate();

    const [objFile, setObjFile] = useState<File | null>(null);
    const [mtlFile, setMtlFile] = useState<File | null>(null);
    const [stlFile, setStlFile] = useState<File | null>(null);

    return (
        <FileContext.Provider value={{objFile, setObjFile, mtlFile, setMtlFile, stlFile, setStlFile}}>
            <div className="w-full h-screen flex flex-col overflow-hidden">
                <header className="flex bg-secondary items-center gap-2">
                    <div className="flex items-center cursor-pointer px-2" onClick={() => navigate("/")}>
                        <BiotechIcon sx={{height: 24, width: 24}} style={{color: "white"}}/>
                        <h2 className="text-white text-md font-semibold">ModelScope</h2>
                    </div>
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