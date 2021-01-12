let express = require('express');
let bodyParser = require('body-parser');
let app = new express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));

// app.get("/", (req, res, next) => {
// 	next();
// });

app.post("/api/add", (req, res) => {
	// data is a string
	res.send(req.body.data);
});

app.post("/api/complete", (req, res) => {
	// data is an array of objects with id, value keys
	//  id is the client side id for the task's element
	res.json(req.body.data);
});

app.listen(process.env.PORT, () => {
	console.log("Listening on Port 3000");
});