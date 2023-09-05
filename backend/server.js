const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require ("cors")

app.use(cors())
app.use(fileUpload());
app.use(express.text())
app.use(express.json())
app.get("/", async(req, res) =>{
const uploadPath = __dirname + "/../backend/data/" + "profile.json";
let pizzas = []
pizzas = await JSON.parse(fs.readFileSync(uploadPath))
res.send(pizzas)
}
);

app.use("/public", express.static(`${__dirname}/../frontend/public`));


//add new pizza to json
app.get("/profile.jpg", (req, res) =>
	res.sendFile(path.join(`${__dirname}/../backend/data/profile.jpg`)));

	  app.post("/", async (req, res) => {
		const pictureUploadPath = __dirname + "/../backend/data/" + req.body.pictureName;
	
		if (req.files) {
			const uploadedPicture = req.files.picture;
			uploadedPicture.mv(pictureUploadPath, (err) => {
				if (err) {
					console.log(err);
					return res.status(500).send(err);
				}
			});
		}
	
		const fileData = req.body;
		//fileData.picture = "/profile.jpg";
		const uploadPath = __dirname + "/../backend/data/" + "profile.json";
		let pizzas = []
		pizzas = await JSON.parse(fs.readFileSync(uploadPath))
		
		pizzas.push(fileData)
		const fileDataString = JSON.stringify(pizzas, null, 2);
		
	
		fs.writeFileSync(uploadPath, fileDataString, (err) => {
			if (err) {
				console.log(err);
				return res.status(500).send(err);
			}
		});
	
		return res.send(fileDataString);
	});


//delete pizza from json	
app.put("/", async (req, res) => {
	const uploadPath = __dirname + "/../backend/data/" + "profile.json";
	const pizzaData = await JSON.parse(fs.readFileSync(uploadPath, 'utf-8'))
	const pictureUploadPath = __dirname + "/../backend/data/" + "profile.jpg";
	const pizzas = req.body.data.pizzaname

	let filteredPizza = pizzaData.filter(pizza => pizza.pizzaname !== pizzas)
 	 fs.writeFileSync(uploadPath,JSON.stringify(filteredPizza))


	return res.status(200).send("done");
});

app.listen(9000, (_) => console.log("127.0.0.1:9000"));