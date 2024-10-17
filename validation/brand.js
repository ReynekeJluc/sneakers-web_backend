import { body } from 'express-validator';

export const brandCreateValidation = [
	body('brand', 'Некорректный брэнд').isJSON(),
	body('desc', 'Некорректное описание')
		.isLength({
			min: 10,
		})
		.isString(),
];
