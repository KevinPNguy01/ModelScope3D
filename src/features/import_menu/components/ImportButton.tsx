import Backdrop from "@mui/material/Backdrop/Backdrop";
import Menu from "@mui/material/Menu/Menu";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import { useState } from "react";
import { MenuButton } from "../../../components/MenuButton";
import { ModelType } from "../types";
import { ImportOBJMenu } from "./ImportOBJMenu";
import { ImportSTLMenu } from "./ImportSTLMenu";

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
        <div className="h-full flex flex-col justify-center">
            <MenuButton
                className={`${anchorEl ? "bg-tertiary": ""}`}
                onClick={handleClick}
            >
                Import
            </MenuButton>
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
            <Backdrop
                open={modelMenu === ModelType.STL}
                onClick={() => setModelMenu(ModelType.NONE)}
                className="z-10"
            >
                <ImportSTLMenu onClick={() => setModelMenu(ModelType.NONE)}/>
            </Backdrop>
        </div>
    );
}