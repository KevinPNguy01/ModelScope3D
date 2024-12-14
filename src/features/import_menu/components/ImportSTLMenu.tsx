import Button from "@mui/material/Button/Button";
import Card from "@mui/material/Card/Card";
import { useContext, useState } from "react";
import { FileContext } from "../../../app/contexts/FileContext";
import { FileUpload } from "../../../components/FileUpload";

export function ImportSTLMenu({onClick}: {onClick: () => void}) {
    const [stlFile, setStlFile] = useState<File | null>(null);

    const {setStlFile: setGlobalStlFile} = useContext(FileContext);

    return (
        <Card className="w-1/3 h-fit !bg-secondary py-4 px-6 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            <h1 className="text-neutral-300 font-semibold text-lg">Import STL Model</h1>
            <FileUpload accept=".stl" label={"STL File:"} fileState={[stlFile, setStlFile]}/>
            <div className="flex w-full justify-end gap-2 pt-2">
                <Button
                    size="small"
                    variant="contained"
                    sx={{
                        textTransform: "none"
                    }}
                    onClick={() => {
                        setGlobalStlFile(stlFile);
                        setStlFile(null);
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