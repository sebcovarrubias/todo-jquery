let express = require('express');

let app = new express();

app.listen(3000, ()=>{
	console.log("Listening on Port 3000");
});