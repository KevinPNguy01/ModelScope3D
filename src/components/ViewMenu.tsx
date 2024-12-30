import Menu from '@mui/material/Menu/Menu';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectShowAxes, selectShowGrids, selectShowSidePanel } from '../stores/selectors/settings';
import { toggleShowAxes, toggleShowGrids, toggleShowSidePanel } from '../stores/slices/settings';
import { MenuButton } from './MenuButton';

export function ViewMenu() {
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
    const showSidePanel = useSelector(selectShowSidePanel);

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
                    className="gap-3"
                    onClick={() => {
                        dispatch(toggleShowGrids());
                        handleClose();
                    }}
                >
                    <span className={`whitespace-pre ${showGrids ? "" : "opacity-0"}`}>
                        ✓
                    </span>
                    Show Grids
                </MenuItem>
                <MenuItem 
                    className="gap-3"
                    onClick={() => {
                        dispatch(toggleShowAxes());
                        handleClose();
                    }}
                >
                    <span className={`whitespace-pre ${showAxes ? "" : "opacity-0"}`}>
                        ✓
                    </span>
                    Show Axes
                </MenuItem>
                <MenuItem 
                    className="gap-3"
                    onClick={() => {
                        dispatch(toggleShowSidePanel());
                        handleClose();
                    }}
                >
                    <span className={`whitespace-pre ${showSidePanel ? "" : "opacity-0"}`}>
                        ✓
                    </span>
                    Show Side Panel
                </MenuItem>
            </Menu>
        </div>
    );
}