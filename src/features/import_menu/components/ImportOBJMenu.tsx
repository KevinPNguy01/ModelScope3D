import Button from "@mui/material/Button/Button";
import Card from "@mui/material/Card/Card";
import { useContext, useRef } from "react";
import { FileContext } from "../../../app/contexts/FileContext";
import { FileUpload } from "../../../components/FileUpload";

export function ImportOBJMenu({onClick}: {onClick: () => void}) {
    const objFile = useRef<File | null>(null);
    const mtlFile = useRef<File | null>(null);

    const {setObjFile, setMtlFile} = useContext(FileContext);

    return (
        <Card className="w-1/3 h-fit !bg-secondary py-4 px-6 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            <h1 className="text-neutral-300 font-semibold text-lg">Import OBJ Model</h1>
            <FileUpload accept=".obj" label={"OBJ File:"} fileRef={objFile}/>
            <FileUpload accept=".mtl" label={"MTL File:"} fileRef={mtlFile}/>
            <div className="flex w-full justify-end gap-2 pt-2">
                <Button
                    size="small"
                    variant="contained"
                    sx={{
                        textTransform: "none"
                    }}
                    onClick={() => {
                        setObjFile(objFile.current);
                        setMtlFile(mtlFile.current)
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