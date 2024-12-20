import Checkbox from '@mui/material/Checkbox/Checkbox';
import Menu from '@mui/material/Menu/Menu';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectShowAxes, selectShowGrids } from '../stores/selectors/settings';
import { toggleShowAxes, toggleShowGrids } from '../stores/slices/settings';
import { MenuButton } from './MenuButton';

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
        <div>
            <MenuButton 
                className={`${anchorEl ? "bg-tertiary": ""}`}
                onClick={handleClick}
            >
                View
            </MenuButton>
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