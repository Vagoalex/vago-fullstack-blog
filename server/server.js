import express from "express";
import mongoose from "mongoose";
import * as UserController from "./src/controllers/UserController.js";
import * as PostController from "./src/controllers/PostController.js";
import { loginValidation, registerValidation } from "./src/validations/auth.js";

import checkAuth from "./src/utils/checkAuth.js";
import { postCreateValidation } from "./src/validations/post.js";

mongoose.connect("mongodb+srv://admin:admin@cluster0.pt7gzme.mongodb.net/blog?retryWrites=true&w=majority").then(() => console.log(
	"DB is OK")).
catch((e) => console.log(`Error! ${e}`));

const app = express();
app.use(express.json());

const PORT = 4444;

app.post("/auth/login", loginValidation, UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/posts", PostController.getAll);
// app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
// app.delete("/posts/:id", PostController.remove);
// app.patch("/posts/:id", PostController.update);

app.listen(PORT, (err) => {
	if(err) {
		return console.log(err);
	}

	return console.log(`Server working on ${PORT} port`);
});
