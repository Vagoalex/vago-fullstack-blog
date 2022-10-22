import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import * as UserController from "./src/controllers/UserController.js";
import * as PostController from "./src/controllers/PostController.js";
import handleValidationErrors from "./src/utils/handleValidationErrors.js";
import { loginValidation, registerValidation } from "./src/validations/auth.js";
import { postCreateValidation } from "./src/validations/post.js";
import checkAuth from "./src/utils/checkAuth.js";

mongoose.connect("mongodb+srv://admin:admin@cluster0.pt7gzme.mongodb.net/blog?retryWrites=true&w=majority").then(() => console.log(
	"DB is OK")).
catch((e) => console.log(`Error! ${e}`));

const app = express();

const storage = multer.diskStorage({
	destination: (_, __, callback) => {
		callback(null, "uploads");
	},
	filename: (_, file, callback) => {
		callback(null, file.originalname);
	}
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));

const PORT = 4444;

app.post("/auth/login", loginValidation, handleValidationErrors, UserController.login);
app.post("/auth/register", registerValidation, handleValidationErrors, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`
	});
});

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, PostController.update);
app.delete("/posts/:id", checkAuth, PostController.remove);

app.listen(PORT, (err) => {
	if(err) {
		return console.log(err);
	}

	return console.log(`Server working on ${PORT} port`);
});
