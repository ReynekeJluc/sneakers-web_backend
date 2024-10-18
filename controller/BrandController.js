import BrandSchema from '../models/Brand.js';
import SneakersSchema from '../models/Sneakers.js';

export const create = async (req, res) => {
	try {
		const BrandEx = await BrandSchema.findOne({ brand });
		if (BrandEx) {
			return res.status(400).json({
				message:
					'Брэнд уже существует',
			});
		}
		
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

export const remove = async (req, res) => {
	try {
		const brandId = req.params.id;

		const associatedSneakers = await SneakersSchema.find({ brand: brandId });

		if (associatedSneakers.length > 0) {
			return res.status(400).json({
				message:
					'Невозможно удалить бренд, так как существуют связанные кроссовки.',
			});
		}

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

export const update = async (req, res) => {
	try {
		const brandId = req.params.id;
		const brand = req.body.brand;

		const existingBrand = await BrandSchema.findOne({
			brand,
			_id: { $ne: brandId },
		});

		if (existingBrand) {
			return res.status(400).json({
				message: 'Бренд с таким названием уже существует',
			});
		}

		const updateBrand = await BrandSchema.updateOne(
			{
				_id: brandId,
			},
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

		res.json({
			success: true,
		});
	} catch (error) {
		console.log(error.message);
		res.status(400).json({
			error: 'Не удалось обновить брэнд',
		});
	}
};
