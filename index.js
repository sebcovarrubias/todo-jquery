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
			res.sendStatus(500);
		} else if (user) {
			// User found
			// check password with bcrypt
				// if match, return user data from db
				// if not, return err
			bcrypt.compare(req.body.password, user.hash, (err, result) => {
				if (err) {
					// Password did not match, Return Login Error
					res.sendStatus(403);
				} else {
					// user found, return user tasks
					findUserTasks(user.username, (err, tasks) => {
						if (err) {
							// could not get tasks, return Login Error
							res.sendStatus(500);
						} else {
							// return tasks and username
							res.json({
								username: user.username,
								tasks: tasks
							});
						}
					});
				}
			});

		} else {
			// User Not Found
			res.sendStatus(404);
		}
	});
		
});

// Handle Sign Up
app.post("/api/signup", (req, res) => {

	// check if username exists in db
	findUser(req.body.username, (err, user) => {
		if (err) {
			res.sendStatus(500);
		} else if (!user) {

			// User Not Found
			// create new user in db with:
			// username, hash
			bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
				if (err) {
					// Could not hash, return Sign Up Error
					res.sendStatus(500);
				} else {

					addUser(req.body.username, hash, (err, result) => {
						if (err) {
							// Could not add user, return Sign Up Error
							res.sendStatus(500);
						} else {
							// added user, return username for adding tasks
							res.send(result.username);
						}

					});

				}

			});

		} else {
			// User already found, return Sign Up error
			res.sendStatus(403);
		}

	});

});

let addTask = require("./db.js").addTask;

// Handle Adding Tasks
app.post("/api/add", (req, res) => {
	// add task to db
	addTask(req.body.username, req.body.task, (err, data) => {
		if (err) {
			res.sendStatus(500);
		} else {
			res.json({
				taskId: data._id,
				task: data.task
			});
		}
	});
});

let removeTask = require("./db.js").removeTask;

// Handle Completed Tasks
app.post("/api/complete", (req, res) => {
	// data is an array of objects with dom-id and 
	// server task-id
	let complete = [];

	var promise = new Promise( (resolve, reject) => {

		req.body.data.forEach(data => {
			// remove tasks from db
			removeTask(data.taskId, (err, result) => {
				if (err) {
					// skip
				} else {

					complete.push({
						taskId: data.domId,
						task: result.task
					});

				}
			});

		});

		resolve();
	});


	promise.then(()=> {

		res.json(complete);

	});

});

module.exports = app;

app.listen(port, () => {
	console.log(`Listening on Port ${port}`);
});

