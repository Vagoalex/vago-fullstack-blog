import { validationResult } from "express-validator";

export default (req, res, next) => {
	const errors = validationResult(req);

	if(!errors.isEmpty()) {
		const errorsArray = [];
		errors.array().forEach(e => {
			const error = {};
			error[e.param] = e.msg;
			errorsArray.push(error);
		});
		return res.status(400).json(errorsArray);
	}

	next()
}
