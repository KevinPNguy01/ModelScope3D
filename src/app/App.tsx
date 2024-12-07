import { Canvas } from "../features/renderer/components/Canvas"
import { ControlPanel } from "../features/transform/components/ControlPanel"

function App() {

  return (
    <div className="flex">
        <Canvas/>
        <ControlPanel/>
    </div>
  )
}

export default App
