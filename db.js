let mongoose = require("mongoose");

// install npm .env and put this in gitignore later
mongoose.connect("mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb", { useNewUrlParser: true, useUnifiedTopology: true });

let userSchema = new mongoose.Schema({
	username: {type: String, required: true},
	hash: {type: String, required: true},
	salt: {type: String, required: true}
});

let taskSchema = new mongoose.Schema({
	username: {type: String, required: true},
	task: {type: String, required: true}
});

let User = mongoose.model("User", userSchema);
let Task = mongoose.model("Task", taskSchema);

// Check if User exists in the DB
const findUser = (username, done) => {
	User.findOne({username:username}, (err, data) => {
		if (err) {
			// user not found
			done(err);
		} else {
			// user found
			done(null, data);
		}
	});
}

// Add User to DB
const addUser = (username, hash, salt, done) => {
	let newUser = new User({
		username: username,
		hash: hash,
		salt: salt
	});

	newUser.save((err, data) => {
		if (err) {
			done(err);
		} else {
			done(null, data);
		}
	});
}

// Add Task to DB
const addTask = (task, username, done) => {
	let newTask = new Task({
		username: username,
		task: task
	});

	newTask.save((err, data) => {
		if (err) {
			done(err);
		} else {
			done(null, data);
		}
	});
};

// Remove Task from DB 
const removeTask = (taskId, done) => {
	Task.remove({_id:taskId}, (err, data) => {
		if (err) {
			done(err);
		} else {
			// successful delete
			done(null, data);
		}
	});
}

// find all Tasks for User
const findUserTasks = (username, done) => {
	Task.find({username: username}, (err, data) => {
		if (err) {
			done(err);
		} else {
			done(null, data);
		}
	});
}
