import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { WebApp } from "./pages/WebApp";

function App() {

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage/>}/>
				<Route path="/web" element={<WebApp/>}/>
			</Routes>
		</BrowserRouter>
	)
}

export default App
