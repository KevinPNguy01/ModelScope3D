import BiotechIcon from '@mui/icons-material/Biotech';
import Button from '@mui/material/Button/Button';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="bg w-full h-screen flex flex-col">
            <header className="border-b border-quaternary flex p-3 items-center gap-0.5">
                <BiotechIcon sx={{height: 32, width: 32}} style={{color: "white"}}/>
                <h2 className="text-white text-xl font-semibold">ModelScope</h2>
            </header>
            <main className="flex flex-col items-center justify-center flex-grow">
                <div className="w-fit flex items-center">
                    <BiotechIcon sx={{height: 64, width: 64}} style={{color: "white"}}/>
                    <h2 className="text-white text-5xl font-semibold">ModelScope</h2>
                </div>
                <span className="text-white text-lg">A lightweight 3D model viewer</span>
                <br/>
                <Button 
                    variant="contained" 
                    className="!p-3 !rounded-none"
                    onClick={() => navigate("/web")}
                >
                    Open Web App
                </Button>
            </main>
        </div>
    );
}