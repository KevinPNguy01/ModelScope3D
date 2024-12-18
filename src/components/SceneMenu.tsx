import MenuIcon from '@mui/icons-material/Menu';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import IconButton from "@mui/material/IconButton/IconButton";
import Menu from '@mui/material/Menu/Menu';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectShowAxes, selectShowGrids } from '../stores/selectors/settings';
import { toggleShowAxes, toggleShowGrids } from '../stores/slices/settings';

export function SceneMenu() {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const showAxes = useSelector(selectShowAxes);
    const showGrids = useSelector(selectShowGrids);

    const dispatch = useDispatch();
    
    return (
        <div className="left-full -translate-x-full top-0 !absolute">
            <IconButton 
                onClick={handleClick}
            >
                <MenuIcon style={{ color: 'white' }} />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem 
                    onClick={handleClose}
                >
                    <Checkbox
                        checked={showGrids}
                        onClick={() => {
                            dispatch(toggleShowGrids());
                        }}
                    />
                    Show Grids
                </MenuItem>
                <MenuItem 
                    onClick={handleClose}
                >
                    <Checkbox
                        checked={showAxes}
                        onClick={() => {
                            dispatch(toggleShowAxes());
                        }}
                    />
                    Show Axes
                </MenuItem>
            </Menu>
        </div>
    );
}