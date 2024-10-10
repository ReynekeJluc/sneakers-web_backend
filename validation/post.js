import { body } from 'express-validator';

export const postCreateValidation = [
	body('title', 'Некорректное имя')
		.isLength({
			min: 3,
		})
		.isString(),
	body('brand', 'Некорректный брэнд').isString(), //!
	body('desc', 'Некорректное описание')
		.isLength({
			min: 10,
		})
		.isString(),
	body('price', 'Некорректная цена')
		.isNumeric()
		.custom(value => {
			if (value < 0) return Promise.reject('Price should be positive');
			else return true;
		}),
	body('sources', 'Некорректные источники (нужен массив)').optional().isArray(),
	body('imageUrl', 'Неверная ссылка на картинку').optional(),
];
