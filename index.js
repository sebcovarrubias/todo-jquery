let express = require('express');
let bodyParser = require('body-parser');
let app = new express();
let port = process.env.PORT || 3000;
let bcrypt = require('bcrypt');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));

let User = require("./db.js").UserModel;
let Task = require("./db.js").TaskModel;

let findUser = require("./db.js").findUser;
let addUser = require("./db.js").addUser;
let findUserTasks = require("./db.js").findUserTasks;

// Handle Login
app.post("/api/login", (req, res) => {
	
	// check if username exists in db
	findUser(req.body.username, (err, data) => {
		if (err) {
			// User Not Found, Return Login error
			res.end();
		} else {
			// User found
			// check password with bcrypt
				// if match, return user data from db
				// if not, return err
		}
	});
		

	console.log(req.body.username);
	console.log(req.body.password);
});

// Handle Sign Up
app.post("/api/signup", (req, res) => {

	// check if username exists in db
	findUser(req.body.username, (err, data) => {
		if (err) {
			// User Not Found
			// create new user in db with:
			// username, salt, hash, tasks
		} else {
			// User found, return Sign Up error
			res.end();
		}

	});

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

