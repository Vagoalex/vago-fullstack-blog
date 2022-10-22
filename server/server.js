import express from "express";
import mongoose from "mongoose";
import * as UserController from "./src/controllers/UserController.js";
import { registerValidation } from "./src/validations/auth.js";

import checkAuth from "./src/utils/checkAuth.js";

mongoose.connect("mongodb+srv://admin:admin@cluster0.pt7gzme.mongodb.net/blog?retryWrites=true&w=majority").then(() => console.log(
	"DB is OK")).
catch((e) => console.log(`Error! ${e}`));

const app = express();
app.use(express.json());

const PORT = 4444;

app.post("/auth/login", UserController.login);
app.post("/auth/register", registerValidation, UserController.register)
app.get("/auth/me", checkAuth, UserController.getMe);

app.listen(PORT, (err) => {
	if(err) {
		return console.log(err);
	}

	return console.log(`Server working on ${PORT} port`);
});
