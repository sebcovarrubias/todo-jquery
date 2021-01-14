let mongoose = require("mongoose");

// install npm .env and put this in gitignore later
let mongoURI = process.env.mongoURI || "mongodb://127.0.0.1:27017/?compressors=zlib&gssapiServiceName=mongodb";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

let userSchema = new mongoose.Schema({
	username: {type: String, required: true},
	hash: {type: String, required: true}
});

let taskSchema = new mongoose.Schema({
	username: {type: String, required: true},
	task: {type: String, required: true}
});

let User = mongoose.model("User", userSchema);
let Task = mongoose.model("Task", taskSchema);

// Check if User exists in the DB
let findUser = (username, done) => {
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
let addUser = (username, hash, done) => {
	let newUser = new User({
		username: username,
		hash: hash
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
let addTask = (username, task, done) => {
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
let removeTask = (taskId, done) => {
	Task.findByIdAndDelete(taskId, (err, data) => {
		if (err) {
			done(err);
		} else {
			// successful delete
			done(null, data);
		}
	});
}

// find all Tasks for User
let findUserTasks = (username, done) => {
	Task.find({username: username}, (err, data) => {
		if (err) {
			done(err);
		} else {
			done(null, data);
		}
	});
}

exports.UserModel = User;
exports.TaskModel = Task;
exports.findUser = findUser;
exports.addUser = addUser;
exports.addTask = addTask;
exports.removeTask = removeTask;
exports.findUserTasks = findUserTasks