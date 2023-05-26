const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const login = require("./router/registerRouter");
dotenv.config();

const port = process.env.PORT || 8000;
const mongoUrl = process.env.MONGO_URL;

app.use("/auth", require("./router/registerRouter"));

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
	console.log(`${req.method}: ${req.path}`);
	next();
});

app.listen(port, () => {
	console.log(`Server is running on ${port} port and successfully connected to the database`);
});

mongoose
	.connect(mongoUrl, {
		useNewUrlParser: true,
	})
	.then((data) => {
		console.log(`Mongo db connected successfully ${data.connection.host}`);
	})
	.catch((err) => {
		console.log(err);
	});
