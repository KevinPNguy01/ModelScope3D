import Button from "@mui/material/Button/Button";
import Card from "@mui/material/Card/Card";
import { useContext, useState } from "react";
import { FileContext } from "../../../app/contexts/FileContext";
import { FileUpload } from "../../../components/FileUpload";

export function ImportOBJMenu({onClick}: {onClick: () => void}) {
    const [objFile, setObjFile] = useState<File[]>([]);
    const [mtlFile, setMtlFile] = useState<File[]>([]);
    const [textureFiles, setTextureFiles] = useState<File[]>([]);

    const {
        setObjFile: setGlobalObjFile, 
        setMtlFile: setGlobalMtlFile, 
        setStlFile: setGlobalStlFile,
        setTextureFiles: setGlobalTextureFiles
    } = useContext(FileContext);

    return (
        <Card className="w-1/3 h-fit !bg-secondary py-4 px-6 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            <h1 className="text-neutral-300 font-semibold text-lg">Import OBJ Model</h1>
            <FileUpload multiple={false} accept=".obj" label={"OBJ File:"} fileState={[objFile, setObjFile]}/>
            <FileUpload multiple={false} accept=".mtl" label={"MTL File:"} fileState={[mtlFile, setMtlFile]}/>
            <FileUpload multiple={true} accept="image/*" label={"Texture Files:"} fileState={[textureFiles, setTextureFiles]}/>
            <div className="flex w-full justify-end gap-2 pt-2">
                <Button
                    size="small"
                    variant="contained"
                    sx={{
                        textTransform: "none"
                    }}
                    onClick={() => {
                        setGlobalObjFile(objFile[0]);
                        setGlobalMtlFile(mtlFile[0]);
                        setGlobalTextureFiles(textureFiles);
                        setGlobalStlFile(null);
                        setObjFile([]);
                        setMtlFile([]);
                        setTextureFiles([]);
                        onClick();
                    }}
                >
                    Confirm
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    sx={{
                        textTransform: "none"
                    }}
                    style={{
                        backgroundColor: "#444"
                    }}
                    onClick={onClick}
                >
                    Cancel
                </Button>
            </div>
        </Card>
    );
}