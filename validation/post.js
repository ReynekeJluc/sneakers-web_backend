import { body } from 'express-validator';

export const postCreateValidation = [
	body('title', 'Некорректное имя')
		.isLength({
			min: 3,
		})
		.isString(),
	body('brand', 'Некорректный брэнд').isNumeric(),
	body('desc', 'Некорректное описание')
		.isLength({
			min: 10,
		})
		.isString(),
	body('price', 'Некорректная цена').isNumeric(),
	body('sources', 'Некорректные источники (нужен массив)')
		.optional()
		.isString(),
	body('imageUrl', 'Неверная ссылка на картинку').optional().isURL(),
];
