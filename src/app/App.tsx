import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WebApp } from "./pages/WebApp";

function App() {

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/web" element={<WebApp/>}/>
			</Routes>
		</BrowserRouter>
	)
}

export default App
