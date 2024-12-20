import Menu from '@mui/material/Menu/Menu';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import { useContext, useState } from 'react';
import { ScreenshotContext } from '../app/contexts/ScreenshotContext';
import { MenuButton } from './MenuButton';

export function ExportMenu() {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const screenshot = useContext(ScreenshotContext);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExportPNG = () => {
        handleClose();
        screenshot.current = true;
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
            </Menu>
        </div>
    );
}