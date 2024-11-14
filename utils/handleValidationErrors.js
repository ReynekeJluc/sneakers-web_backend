import { validationResult } from 'express-validator';

export default (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors.array()[0].msg);
		return res.status(422).json(errors.array());
	}

	next();
};
