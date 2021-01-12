let express = require('express');

let app = new express();

app.use(express.static(__dirname + "/public"));

app.listen(3000, () => {
	console.log("Listening on Port 3000");
});