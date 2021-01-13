let express = require('express');
let bodyParser = require('body-parser');
let app = new express();
let port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));

// Handle Login
app.post("/api/login", (req, res) => {
	``
	// check if username exists in db
		// if not, return err

	// check password with bcrypt
		// if match, return user data from db
		// if not, return err

	console.log(req.body.username);
	console.log(req.body.password);
});

// Handle Sign Up
app.post("/api/signup", (req, res) => {

	// check if username exists in db
		// if so, return err

	// create new user in db with:
	// username, salt, hash, tasks

	console.log(req.body.username);
	console.log(req.body.password);
});

// Handle Adding Tasks
app.post("/api/add", (req, res) => {
	// data is a string
	res.send(req.body.data);

	// add task to db
});

// Handle Completed Tasks
app.post("/api/complete", (req, res) => {
	// data is an array of objects with id, value keys
	//  id is the client side id for the task's element
	res.json(req.body.data);

	// remove tasks from db
});

app.listen(port, () => {
	console.log(`Listening on Port ${port}`);
});

