const fs = require("fs");
const path = require("path");

const modelsDir = path.join(__dirname, "public/models");
const outputFile = path.join(__dirname, "src/assets/models.json");

fs.readdir(modelsDir, (err, files) => {
	if (err) throw err;

	const modelFiles = files.filter((file) => file.endsWith(".obj") || file.endsWith(".stl"));
	fs.writeFileSync(outputFile, JSON.stringify(modelFiles, null, 2));
	console.log("Model list generated:", modelFiles);
});