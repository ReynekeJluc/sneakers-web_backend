import { body } from 'express-validator';

export const brandCreateValidation = [
	body('brand', 'Некорректный брэнд').isString().isLength({
		min: 2,
	}),
	body('desc', 'Некорректное описание')
		.isLength({
			min: 10,
		})
		.isString(),
];
