import Button from "@mui/material/Button/Button";
import Card from "@mui/material/Card/Card";
import FormControl from "@mui/material/FormControl/FormControl";
import InputLabel from "@mui/material/InputLabel/InputLabel";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select/Select";
import { useContext, useState } from "react";
import { FileContext } from "../../../app/contexts/FileContext";
import modelFiles from "../../../assets/models.json";
import { loadModelFileFromPublic } from "../../../utils/models/models";
import { getMtlFromObj } from "../../../utils/models/obj_loader";

export function LoadPresetMenu({onClick}: {onClick: () => void}) {
    const [selectedModel, setSelectedModel] = useState("");

    const {setObjFile, setMtlFile, setStlFile} = useContext(FileContext);

    const handleChange = async (e: SelectChangeEvent) => {
        setSelectedModel(e.target.value);
        
    };

    const handleConfirm = async () => {
        onClick();
        const file = await loadModelFileFromPublic(selectedModel);
        if (!file) return;
        if (file.type === "model/obj") {
            setObjFile(file);
            const mtlFile = await getMtlFromObj(file);
            setMtlFile(mtlFile);
        } else if (file.type === "model/stl") {
            setStlFile(file);
        }
        setSelectedModel("");
    }

    return (
        <Card className="w-1/3 h-fit !bg-secondary py-4 px-6 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            <h1 className="text-neutral-300 font-semibold text-lg">Load Preset</h1>
            <FormControl>
                <InputLabel id="model-select-label" className="!text-neutral-500">Select Model</InputLabel>
                <Select
                    labelId="model-select-label"
                    value={selectedModel}
                    onChange={handleChange}
                >
                    {modelFiles.map((model, index) => (
                    <MenuItem key={index} value={model}>
                        {model}
                    </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <div className="flex w-full justify-end gap-2 pt-2">
                <Button
                    size="small"
                    variant="contained"
                    sx={{
                        textTransform: "none"
                    }}
                    onClick={handleConfirm}
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