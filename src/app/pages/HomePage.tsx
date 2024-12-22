import BiotechIcon from '@mui/icons-material/Biotech';
import Button from '@mui/material/Button/Button';
import { useNavigate } from 'react-router-dom';
import { FeatureCard } from '../../components/FeatureCard';

export function HomePage() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="bg w-full h-screen flex flex-col">
                <header className="border-b border-quaternary">
                    <div className="cursor-pointer flex p-3 items-center  gap-0.5" onClick={() => navigate("/")}>
                        <BiotechIcon sx={{height: 32, width: 32}} style={{color: "white"}}/>
                        <h2 className="text-white text-xl font-semibold">ModelScope</h2>
                    </div>
                </header>
                <main className="flex flex-col items-center justify-center flex-grow">
                    <div className="w-fit flex items-center">
                        <BiotechIcon sx={{height: 64, width: 64}} style={{color: "white"}}/>
                        <h2 className="text-white text-5xl font-semibold">ModelScope</h2>
                    </div>
                    <span className="text-white text-lg">A lightweight 3D model editor</span>
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
            <div className="bg-secondary flex flex-col items-center py-8">
                <hr className="w-[80%] max-w-[76em] border-neutral-500"/>
                <FeatureCard 
                    title="High Quality Renders" 
                    description={
                        `ModelScope provides everything you need to bring your models to life with stunning visuals.

                        Customize different light sources, material options, and camera effects to make your models truly shine!`
                    }
                    src="./img/fox.png"
                    swap={false}
                />
                <hr className="w-[80%] max-w-[76em] border-neutral-500"/>
                <FeatureCard 
                    title="Seamless Texture Support" 
                    description={
                        `Render models with detail using built-in support for textured assets.
                        
                        ModelScope reads texture data directly from uploaded files, ensuring accurate representation during rendering.
                        
                        You can also swap specific textures with different files, or use a customizable material.`
                    }
                    src="./img/robot.png"
                    swap={true}
                />
                <hr className="w-[80%] max-w-[76em] border-neutral-500"/>
                <FeatureCard 
                    title="Configurable Lighting" 
                    description={
                        `Illuminate your models with customizable lighting tools that adapt to your creative vision.
                        
                        Add and adjust light sources to create dynamic scenes, from soft ambient lighting to dramatic spotlights.
                        
                        Configure light color, intensity, position, and direction to create the perfect illumination for your scene.`
                    }
                    src="./img/cat.png"
                    swap={false}
                />
                <hr className="w-[80%] max-w-[76em] border-neutral-500"/>
                <FeatureCard 
                    title="Transformations" 
                    description={
                        `ModelScope includes versatile transformation tools to refine your models with precison.
                        
                        Use the scale, rotate, and translate tools to fine-tune your models effortlessly.
                        
                        Save the changes to your model by exporting to one of the supported file formats.`
                    }
                    src="./img/wrench.png"
                    swap={true}
                />
            </div>
        </div>
    );
}