import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose, { mongo } from "mongoose";
import { registerValidation } from "./src/validations/auth.js";
import { validationResult } from "express-validator";

import UserModel from "./src/models/User.js";

mongoose.connect("mongodb+srv://admin:admin@cluster0.pt7gzme.mongodb.net/blog?retryWrites=true&w=majority").then(() => console.log(
	"DB is OK")).
catch((e) => console.log(`Error! ${e}`));

const app = express();
app.use(express.json());

const PORT = 4444;

app.post("/auth/register", registerValidation, async (req, res) => {
	try {
		const errors = validationResult(req);

		if(!errors.isEmpty()) {
			console.log(errors);
			const errorsArray = [];
			errors.array().forEach(e => {
				const error = {};
				error[e.param] = e.msg;
				errorsArray.push(error);
			});
			return res.status(400).json(errorsArray);
		}

		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash
		});

		const user = await doc.save();

		const token = jwt.sign(
			{
				_id: user._id
			},
			"secret123",
			{
				expiresIn: "30d"
			}
		);

		const { passwordHash, ...userData } = user._doc;

		res.json({
			...userData,
			token
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Не удалось зарегистрироваться"
		});
	}


});

app.listen(PORT, (err) => {
	if(err) {
		return console.log(err);
	}

	return console.log(`Server working on ${PORT} port`);
});
