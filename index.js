const express = require("express");
const path = require("path");

const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html for root route
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => {
	console.log("Frontend server running on http://localhost:3000");
});