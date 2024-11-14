import BrandSchema from '../models/Brand.js';
import SneakersSchema from '../models/Sneakers.js';

// Создание нового бренда
export const create = async (req, res) => {
	try {
		// Проверка существования бренда с таким названием
		const BrandEx = await BrandSchema.findOne({ brand: req.body.brand });
		if (BrandEx) {
			return res.status(400).json({
				message: 'Бренд уже существует',
			});
		}

		// Создание и сохранение нового бренда в базе данных
		const doc = new BrandSchema({
			brand: req.body.brand,
			desc: req.body.desc,
		});
		const post = await doc.save();
		res.status(201).json(post);
	} catch (error) {
		console.log(error);
		res.status(400).send(error.message);
	}
};

// Удаление бренда
export const remove = async (req, res) => {
	try {
		const brandId = req.params.id;

		// Проверка на наличие связанных кроссовок
		const associatedSneakers = await SneakersSchema.find({ brand: brandId });
		if (associatedSneakers.length > 0) {
			return res.status(400).json({
				message:
					'Невозможно удалить бренд, так как существуют связанные кроссовки.',
			});
		}

		// Удаление бренда из базы данных
		const deletedBrand = await BrandSchema.findOneAndDelete({ _id: brandId });
		if (!deletedBrand) {
			return res.status(404).json({
				message: 'Не удалось найти запись',
			});
		}
		res.json({ success: true });
	} catch (error) {
		console.log(error.message);
		res.status(400).json({
			error: 'Не удалось удалить запись',
		});
	}
};

// Получение списка всех брендов с поддержкой пагинации
export const getPagesBrand = async (req, res) => {
	try {
		// Получение всех записей брендов
		const records = await BrandSchema.find().populate('brand').exec();
		res.json(records);
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error: 'Не удалось получить бренды',
		});
	}
};

// Получение информации о конкретном бренде
export const getOneBrand = async (req, res) => {
	try {
		const brandId = req.params.id;

		// Поиск бренда по ID
		const record = await BrandSchema.findById(brandId);
		if (!record) {
			return res.status(404).json({
				error: 'Бренд не найден',
			});
		}
		res.json(record);
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error: 'Не удалось получить бренд',
		});
	}
};

// Обновление информации о бренде
export const update = async (req, res) => {
	try {
		const brandId = req.params.id;
		const brand = req.body.brand;

		// Проверка на наличие другого бренда с таким же названием
		const existingBrand = await BrandSchema.findOne({
			brand,
			_id: { $ne: brandId },
		});
		if (existingBrand) {
			return res.status(422).json({
				message: 'Бренд с таким названием уже существует',
			});
		}

		// Обновление данных бренда
		const updateBrand = await BrandSchema.updateOne(
			{ _id: brandId },
			{
				brand: req.body.brand,
				desc: req.body.desc,
			}
		);
		if (!updateBrand) {
			return res.status(404).json({
				message: 'Не удалось найти запись',
			});
		}
		res.json({ success: true });
	} catch (error) {
		console.log(error.message);
		res.status(400).json({
			error: 'Не удалось обновить бренд',
		});
	}
};
