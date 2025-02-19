const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
	{
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: [true, "please provide rating"],
		},

		title: {
			type: String,
			trim: true,
			required: [true, "please provide title"],
			maxlength: 100,
		},

		comment: {
			type: String,
			required: [true, "please provide comment"],
		},

		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
		},

		product: {
			type: mongoose.Schema.ObjectId,
			ref: "Product",
			required: true,
		},
	},
	{ timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (productID) {
	const result = await this.aggregate([
		{ $match: { product: productID } },
		{
			$group: {
				_id: null,
				averageRating: { $avg: "$rating" },
				numOfReviews: { $sum: 1 },
			},
		},
	]);
	console.log(result);
	try {
		await this.model("Product").findOneAndUpdate(
			{ _id: productID },
			{ averageRating: Math.ceil(result[0]?.averageRating || 0) },
			{ numOfReviews: result[0]?.numOfReviews || 0 }
		);
	} catch (error) {
		console.log(error);
	}
};

ReviewSchema.post("save", { document: true, query: false }, async function () {
	await this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post(
	"deleteOne",
	{ document: true, query: false },
	async function () {
		await this.constructor.calculateAverageRating(this.product);
	}
);

module.exports = mongoose.model("Review", ReviewSchema);
