import Button from "@mui/material/Button/Button";
import Card from "@mui/material/Card/Card";
import { useContext, useState } from "react";
import { FileContext } from "../../../app/contexts/FileContext";
import { FileUpload } from "../../../components/FileUpload";

export function ImportOBJMenu({onClick}: {onClick: () => void}) {
    const [objFile, setObjFile] = useState<File | null>(null);
    const [mtlFile, setMtlFile] = useState<File | null>(null);

    const {setObjFile: setGlobalObjFile, setMtlFile: setGlobalMtlFile} = useContext(FileContext);

    return (
        <Card className="w-1/3 h-fit !bg-secondary py-4 px-6 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            <h1 className="text-neutral-300 font-semibold text-lg">Import OBJ Model</h1>
            <FileUpload accept=".obj" label={"OBJ File:"} fileState={[objFile, setObjFile]}/>
            <FileUpload accept=".mtl" label={"MTL File:"} fileState={[mtlFile, setMtlFile]}/>
            <div className="flex w-full justify-end gap-2 pt-2">
                <Button
                    size="small"
                    variant="contained"
                    sx={{
                        textTransform: "none"
                    }}
                    onClick={() => {
                        setGlobalObjFile(objFile);
                        setGlobalMtlFile(mtlFile);
                        setObjFile(null);
                        setMtlFile(null);
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