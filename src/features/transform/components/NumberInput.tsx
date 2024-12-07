import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';
import Tooltip from '@mui/material/Tooltip/Tooltip';
import { useEffect, useRef, useState } from "react";

export function TransformNumberInput({value, setValue, title, step, color}: {value: number, setValue: (_: number) => void, title: string, step: number, color: string}) {
    const [isClick, setIsClick] = useState(false);
    const [numberInput, setNumberInput] = useState(false);
    const mousePosRef = useRef(-1);
    const [hovering, setHovering] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
    });

    useEffect(() => {
        // Change the value if the mouse moves 2% of the screen width.
        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - mousePosRef.current;
            if (mousePosRef.current != -1 && Math.abs(dx) / window.innerWidth > 0.02) {
                setIsClick(false);
                setValue(value + step * dx / Math.abs(dx));
                mousePosRef.current = e.clientX;
            }
        };

        const handleMouseUp = () => {
            if (isClick) {
                setNumberInput(true);
            }
            setIsClick(false);
            mousePosRef.current = -1;
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isClick, setValue, step, value]);

    // Highlight the text input on mount.
    useEffect(() => {
        if(inputRef.current) {
            inputRef.current!.select();
        }
    }, [numberInput]);

    const incrementDecrementButton = (Icon: React.ComponentType<SvgIconProps>, multiplier: number) => (
        <Icon 
            fontSize='small'
            style={{ color: 'white' }} 
            className={`cursor-pointer ${hovering ? "" : "opacity-0"}`}
            onClick={() => setValue(value + step * multiplier)}
            onMouseDown={(e) => e.stopPropagation()}
        />
    );
    
    return (
        <Tooltip title={title}>
            <div 
                style={{"--corner-color": color} as React.CSSProperties}
                className={`w-fit bg-tertiary p-1 flex items-center relative ${color === "none" ? "" : "transformNumberInput"}`}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
            >
                {incrementDecrementButton(ChevronLeftIcon, -1)}
                {numberInput ? (
                    <input 
                        ref={inputRef}
                        autoFocus
                        type="number"
                        defaultValue={value}
                        onChange={(e) => {
                            if (!isNaN(e.currentTarget.valueAsNumber)) {
                                setValue(e.currentTarget.valueAsNumber);
                            }
                        }}
                        className={`bg-tertiary w-6 text-center`}
                        onBlur={() => setNumberInput(false)}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                setNumberInput(false);
                            }
                        }}
                    />
                ) : (
                    <span 
                        className={`cursor-ew-resize select-none w-6 text-center`}
                        onMouseDown={(e) => {
                            mousePosRef.current = e.clientX;
                            setIsClick(true);
                        }}
                    >
                        {formatter.format(value)}
                    </span>
                )}
                {incrementDecrementButton(ChevronRightIcon, 1)}
            </div>
        </Tooltip>
    );
}