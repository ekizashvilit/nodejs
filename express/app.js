const express = require("express");
const app = express();

app.get("/", (req, res) => {
	const method = req.method;
	const url = req.url;
	const time = new Date().getFullYear();

	res.send("home");
});

app.get("/about", (req, res) => {
	res.send("about");
});

app.listen(3001, () => {
	console.log("hi");
});
