const express = require("express");
const fs = require("fs");
const path = require("path");
const ServerTime = require("./myModules/utils");
const userMessage = require("./lang/en/en"); // Ensure this is JSON or .js

const app = express();

// A. Serve your existing UI (Static files like index.html)
app.use(express.static(__dirname));

// B. Lab Route: Get Date
app.get("/COMP4537/labs/3/getDate", (req, res) => {
	const name = req.query.name || "Guest";
	const datetime = new ServerTime();

	const finalMessage = userMessage.template
		.replace("%1", name)
		.replace("%2", datetime.getCurrentTime());

	res.send(`<div style='color:blue'>${finalMessage}</div>`);
});

// C. Lab Route: Write File
app.get("/COMP4537/labs/3/writeFile", (req, res) => {
	const text = (req.query.text || "") + "\n";
	// For Vercel, use /tmp. For local/Render, you can use __dirname
	const filePath = path.join(process.env.VERCEL ? "/tmp" : __dirname, "file.txt");

	fs.appendFile(filePath, text, (err) => {
		if (err) return res.status(500).send("Error writing to file");
		res.send(`Successfully appended: ${text}`);
	});
});

// D. Lab Route: Read File
// Example: /COMP4537/labs/3/readFile/file.txt
app.get("/COMP4537/labs/3/readFile/:filename", (req, res) => {
	const filename = req.params.filename;
	const filePath = path.join(process.env.VERCEL ? "/tmp" : __dirname, filename);

	fs.readFile(filePath, "utf8", (err, data) => {
		if (err) return res.status(404).send(`${filename} 404 Not Found!`);
		res.send(`<pre>${data}</pre>`);
	});
});

// Use the dynamic port for Vercel/Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
