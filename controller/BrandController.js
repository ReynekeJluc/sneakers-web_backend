import BrandSchema from '../models/Brand.js';

export const create = async (req, res) => {
	try {
		const brand = await BrandSchema(req.body);
		await brand.save();

		res.status(201).json(brand);
	} catch (error) {
		console.log(error);
		res.status(400).send(error.message);
	}
};

export const remove = async (req, res) => {
	try {
		const brandId = req.params.id;

		const deletedBrand = await BrandSchema.findOneAndDelete({
			_id: brandId,
		});

		if (!deletedBrand) {
			return res.status(404).json({
				message: 'Не удалось найти запись',
			});
		}

		res.json({
			success: true,
		});
	} catch (error) {
		console.log(error.message);
		res.status(400).json({
			error: 'Не удалось удалить запись',
		});
	}
};

export const getPagesBrand = async (req, res) => {
	try {
		const records = await BrandSchema.find().populate('brand').exec();

		res.json(records);
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error: 'Не удалось получить брэнды',
		});
	}
};

export const getOneBrand = async (req, res) => {
	try {
		const brandId = req.params.id;

		const record = await BrandSchema.findById(brandId);

		if (!record) {
			return res.status(404).json({
				error: 'Брэнд не найдены',
			});
		}

		res.json(record);
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error: 'Не удалось получить брэнд',
		});
	}
};
