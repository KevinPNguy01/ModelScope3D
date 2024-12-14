import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useRef } from "react";

export function FileUpload({accept, label, fileState}: {accept: string, label: string, fileState: [File | null, (file: File | null) => void]}) {
    const [file, setFile] = fileState;
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFile = e.target.files.item(0);
            if (newFile) {
                setFile(newFile);
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
                    {file?.name || "Choose File"}
                </span>
                {file ? (
                    <CloseIcon
                        fontSize='small'
                        style={{ color: '#aaa' }}
                        className="cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            setFile(null);
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
                    ref={inputRef}
                    onChange={handleFileChange} 
                    type="file"
                    accept={accept}
                />
            </label>
        </div>
    );
}