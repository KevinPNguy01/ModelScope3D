import Backdrop from "@mui/material/Backdrop/Backdrop";
import Button from "@mui/material/Button/Button";
import Menu from "@mui/material/Menu/Menu";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import { useState } from "react";
import { ModelType } from "../types";
import { ImportOBJMenu } from "./ImportOBJMenu";

export function ImportButton() {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [modelMenu, setModelMenu] = useState<ModelType>(ModelType.NONE);
    const open = Boolean(anchorEl);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="relative">
            <Button
                onClick={handleClick}
            >
                Import
            </Button>
            <Menu 
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem
                    onClick={() => {handleClose(); setModelMenu(ModelType.STL)}}
                >
                    Import STL
                </MenuItem>
                <MenuItem
                    onClick={() => {handleClose(); setModelMenu(ModelType.OBJ)}}
                >
                    Import OBJ
                </MenuItem>
            </Menu>
            <Backdrop
                open={modelMenu === ModelType.OBJ}
                onClick={() => setModelMenu(ModelType.NONE)}
                className="z-10"
            >
                <ImportOBJMenu onClick={() => setModelMenu(ModelType.NONE)}/>
            </Backdrop>
        </div>
    );
}