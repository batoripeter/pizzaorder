"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const server = (0, express_1.default)();
server.use((0, cors_1.default)());
server.use(express_1.default.json());
const fileUpload = require("express-fileupload");
const path = require("path");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(fileUpload());
app.use(express_1.default.text());
app.use(express_1.default.json());
const client = new pg_1.Client("postgres://batorifoto:8X7vjzSmuByH@morning-salad-30466197.us-west-2.aws.neon.tech/literate-lioness-36_db_7594456?options=project%3Dmorning-salad-30466197&sslmode=require");
app.use("/public", express_1.default.static(`${__dirname}/../frontend/public`));
//add new pizza to database
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield client.query('select * from pizza_test');
    res.json(result.rows);
    console.log(result.rows);
}));
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newpizzaname = req.body.pizzaname;
    let newtoppings = req.body.toppings;
    let newprice = req.body.price;
    let newpicture = req.body.pictureName;
    yield client.query('INSERT INTO pizza_test (pizza_name,toppings,price,picture) VALUES ($1, $2, $3, $4) RETURNING *', [newpizzaname, newtoppings, newprice, newpicture]).catch(err => console.log(err));
    return res.status(200).send("done");
}));
//update pizza in database
app.post("/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newpizzaname = req.body.pizzaname;
    let newtoppings = req.body.toppings;
    let newprice = req.body.price;
    let newpicture = req.body.pictureName;
    yield client.query('UPDATE pizza_test SET toppings = $2, price = $3, picture = $4 WHERE pizza_name = $1 RETURNING *', [newpizzaname, newtoppings, newprice, newpicture]).catch(err => console.log(err));
    return res.status(200).send("done");
}));
//delete pizza from database	
app.post("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newpizzaname = req.body.data.pizzaname;
    console.log(newpizzaname);
    yield client.query('DELETE FROM pizza_test WHERE (pizza_name=$1) RETURNING *', [newpizzaname]).catch(err => console.log(err));
    return res.status(200).send("done");
}));
//app.listen(9000, (_) => console.log("127.0.0.1:9000"));
client.connect().then(() => app.listen(9000));
