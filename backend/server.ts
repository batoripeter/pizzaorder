import express from "express"
import type { Request, Response } from "express"
import cors from "cors"
import fs from "fs/promises"
import { string, z } from "zod"
import { Client } from "pg"
import dotenv from 'dotenv'


const server = express()

server.use(cors())
server.use(express.json())

const fileUpload = require("express-fileupload");
const path = require("path");
const app = express();

app.use(cors())
app.use(fileUpload());
app.use(express.text())
app.use(express.json())

const client = new Client("postgres://batorifoto:8X7vjzSmuByH@morning-salad-30466197.us-west-2.aws.neon.tech/literate-lioness-36_db_7594456?options=project%3Dmorning-salad-30466197&sslmode=require")

app.use("/public", express.static(`${__dirname}/../frontend/public`));

//add new pizza to database
app.get("/", async (req:Request,res:Response) => {
	const result = await client.query('select * from pizza_test')
	res.json(result.rows)
	console.log(result.rows)
  })

app.post("/", async (req:Request,res:Response) => {
	let newpizzaname:string = req.body.pizzaname
	let newtoppings:string  = req.body.toppings
	let newprice:number = req.body.price
	let newpicture:string  = req.body.pictureName

	await client.query('INSERT INTO pizza_test (pizza_name,toppings,price,picture) VALUES ($1, $2, $3, $4) RETURNING *',
	[newpizzaname,newtoppings,newprice,newpicture]).catch(err => console.log(err))
	return res.status(200).send("done");
  })


//update pizza in database
  app.post("/update", async (req:Request,res:Response) => {
	let newpizzaname:string = req.body.pizzaname
	let newtoppings:string  = req.body.toppings
	let newprice:number = req.body.price
	let newpicture:string  = req.body.pictureName

	await client.query('UPDATE pizza_test SET toppings = $2, price = $3, picture = $4 WHERE pizza_name = $1 RETURNING *',
	[newpizzaname,newtoppings,newprice,newpicture]).catch(err => console.log(err))
	return res.status(200).send("done");
  })



//delete pizza from database	

app.post("/delete", async (req:Request,res:Response) => {
	let newpizzaname:string = req.body.data.pizzaname
console.log(newpizzaname)
	await client.query('DELETE FROM pizza_test WHERE (pizza_name=$1) RETURNING *',
	[newpizzaname]).catch(err => console.log(err))
	return res.status(200).send("done");
  })


//app.listen(9000, (_) => console.log("127.0.0.1:9000"));
client.connect().then(()=> app.listen(9000))