let express = require('express');
let bodyParser = require('body-parser');
let app = new express();

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended:true}));

app.post("/api/add",(req, res) => {
	res.send(req.body.data);
});

app.listen(3000, () => {
	console.log("Listening on Port 3000");
});