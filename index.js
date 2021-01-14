let express = require('express');
let bodyParser = require('body-parser');
let app = new express();
let port = process.env.PORT || 3000;
let bcrypt = require('bcrypt');
let saltRounds = 10;

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
	findUser(req.body.username, (err, user) => {
		if (err) {
			res.end();
		} else if (user) {
			// User found
			// check password with bcrypt
				// if match, return user data from db
				// if not, return err
			bcrypt.compare(req.body.password, user.hash, (err, result) => {
				if (err) {
					// Password did not match, Return Login Error
					console.log("Password did not match, Return Login Error");
					res.end();
				} else {
					// user found, return user tasks
					findUserTasks(user.username, (err, tasks) => {
						if (err) {
							// could not get tasks, return Login Error
							console.log("could not get tasks, return Login Error");
							res.end();
						} else {
							// return tasks
							res.json(tasks);
						}
					});
				}
			});

			console.log(user);
		} else {
			res.end();
		}
	});
		
});

// Handle Sign Up
app.post("/api/signup", (req, res) => {

	// check if username exists in db
	findUser(req.body.username, (err, user) => {
		if (err) {
			res.end();
		} else if (!user) {

			// User Not Found
			// create new user in db with:
			// username, hash
			bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
				if (err) {
					// Could not hash, return Sign Up Error
					console.log("Could not hash, return Sign Up Error");
					res.end();
				} else {

					addUser(req.body.username, hash, (err, result) => {
						if (err) {
							// Could not add user, return Sign Up Error
							console.log("Could not add user, return Sign Up Error");
							res.end();
						} else {
							// added user
							console.log(result);
							res.end();
						}

					});

				}

			});

		} else {
			// User found, return Sign Up error
			console.log("User found, return Sign Up error");
			res.end();
		}

	});

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

