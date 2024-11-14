import mongoose from 'mongoose';

const SneakersSchema = new mongoose.Schema(
	{
		title: {
			type: 'string',
			required: true,
		},
		brand: {
			type: mongoose.Schema.Types.ObjectId, //  сохраняем объект типа
			ref: 'Brand',
			required: true,
		},
		desc: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		sources: {
			type: Array,
			default: [],
		},
		imageUrl: {
			type: String,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Sneakers', SneakersSchema);
