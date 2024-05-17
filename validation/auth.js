import { body } from 'express-validator';

export const registerValidation = [
	body('email', 'Неверный формат почты').isEmail(),
	body('password', 'Пароль должен быть не менее 5 символов').isLength({
		min: 5,
	}),
	body('fullName', 'Имя должно быть не менее 3 символов').isLength({ min: 3 }),
];
