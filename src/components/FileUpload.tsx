import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useEffect, useRef } from "react";

export function FileUpload({multiple, accept, label, fileState}: {multiple: boolean, accept: string, label: string, fileState: [File[], (_: File[]) => void]}) {
    const [file, setFile] = fileState;
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!file) inputRef.current!.value = "";
    }, [file]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(Array.from(e.target.files));
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
                    {file.map(f => f.name).join(", ") || "Choose File"}
                </span>
                {file ? (
                    <CloseIcon
                        fontSize='small'
                        style={{ color: '#aaa' }}
                        className="cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            setFile([]);
                            if (inputRef.current) inputRef.current.value = "";
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
                    multiple={multiple}
                    ref={inputRef}
                    onChange={handleFileChange} 
                    type="file"
                    accept={accept}
                />
            </label>
        </div>
    );
}