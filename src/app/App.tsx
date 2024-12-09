import { useState } from "react";
import { ImportButton } from "../features/import_menu/components/ImportButton";
import { Canvas } from "../features/renderer/components/Canvas";
import { ControlPanel } from "../features/transform/components/ControlPanel";
import { FileContext } from "./contexts/FileContext";

function App() {
  const [objFile, setObjFile] = useState<File | null>(null);
  const [mtlFile, setMtlFile] = useState<File | null>(null);
  const [stlFile, setStlFile] = useState<File | null>(null);

  return (
    <FileContext.Provider value={{objFile, setObjFile, mtlFile, setMtlFile, stlFile, setStlFile}}>
      <div className="flex flex-col">
      <div className="flex bg-secondary">
        <ImportButton/>
      </div>
      <div className="flex">
        <Canvas/>
        <ControlPanel/>
      </div>
    </div>
    </FileContext.Provider>
  )
}

export default App
