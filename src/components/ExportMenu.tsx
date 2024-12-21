import Menu from '@mui/material/Menu/Menu';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import { useContext, useState } from 'react';
import { ExportContext } from '../app/contexts/ExportContext';
import { MenuButton } from './MenuButton';

export function ExportMenu() {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const {exportScreenshot, exportSTL} = useContext(ExportContext);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExportPNG = () => {
        handleClose();
        exportScreenshot.current = true;
    };

    const handleExportSTL = () => {
        handleClose();
        exportSTL.current = true;
    };
    
    return (
        <div>
            <MenuButton 
                className={`${anchorEl ? "bg-tertiary": ""}`}
                onClick={handleClick}
            >
                Export
            </MenuButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem 
                    onClick={handleExportPNG}
                >
                    Export as PNG
                </MenuItem>
                <MenuItem 
                    onClick={handleExportSTL}
                >
                    Export as STL
                </MenuItem>
            </Menu>
        </div>
    );
}