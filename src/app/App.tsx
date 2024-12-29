import { ThemeProvider } from "@emotion/react";
import createTheme from "@mui/material/styles/createTheme";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { WebApp } from "./pages/WebApp";

const theme = createTheme({
	palette: {
		text: {
			primary: '#ffffff',
			secondary: '#b0b0b0',
		},
	},
});

function App() {

	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage/>}/>
					<Route path="/web" element={<WebApp/>}/>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	)
}

export default App
