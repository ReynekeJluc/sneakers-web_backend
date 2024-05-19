import { body } from 'express-validator';

export const brandCreateValidation = [
	body('brand', 'Некорректный брэнд').isString().isLength({
		min: 2,
	}),
];
