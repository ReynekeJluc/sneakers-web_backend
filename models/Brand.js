import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
	brand: {
		type: String,
		required: true,
		unique: true,
	},
	desc: {
		type: String,
		required: true,
	},
});

export default mongoose.model('Brand', BrandSchema);
