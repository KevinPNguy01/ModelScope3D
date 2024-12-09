import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { MutableRefObject, useRef, useState } from "react";

export function FileUpload({accept, label, fileRef}: {accept: string, label: string, fileRef: MutableRefObject<File | null>}) {
    const [filename, setFilename] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files.item(0);
            if (file) {
                fileRef.current = file;
                setFilename(file.name);
            }
        }
    };

    return (
        <div className="grid grid-cols-3 items-center">
            <span className="text-neutral-300 text-sm">
                {label}
            </span>
            <label
                className="bg-tertiary border border-neutral-800 px-2 py-0.5 col-span-2 flex justify-between items-center"
            >
                <span
                    className="text-sm text-neutral-400"
                >
                    {filename || "Choose File"}
                </span>
                {filename ? (
                    <CloseIcon
                        fontSize='small'
                        style={{ color: '#aaa' }}
                        className="cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            fileRef.current = null;
                            if (inputRef.current) inputRef.current.value = "";
                            setFilename("");
                        }}
                    />
                ) : (
                    <InsertDriveFileIcon
                        fontSize='small'
                        style={{ color: '#aaa' }}
                        className="cursor-pointer"
                    />
                )}
                <input 
                    ref={inputRef}
                    onChange={handleFileChange} 
                    type="file"
                    accept={accept}
                />
            </label>
        </div>
    );
}