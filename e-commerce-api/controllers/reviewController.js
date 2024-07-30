const Review = require("../models/Review");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const createReview = async (req, res) => {
	const { product: productID } = req.body;

	const isValidProduct = await Product.findOne({ _id: productID });
	if (!isValidProduct) {
		throw new CustomError.NotFoundError(`no prod with id: ${productID}`);
	}

	const alreadySubmitted = await Review.findOne({
		product: productID,
		user: req.user.userID,
	});
	if (alreadySubmitted) {
		throw new CustomError.BadRequestError(`review already submitted`);
	}

	req.body.user = req.user.userID;

	const review = await Review.create(req.body);

	res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
	const reviews = await Review.find({}).populate({
		path: "product",
		select: "name company price",
	});

	res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getOneReview = async (req, res) => {
	const { id: reviewID } = req.params;

	const review = await Review.findOne({ _id: reviewID });
	if (!review) {
		throw new CustomError.NotFoundError(`no review with id: ${reviewID}`);
	}

	res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
	const { id: reviewID } = req.params;
	const { rating, title, comment } = req.body;

	const review = await Review.findOne({ _id: reviewID });
	if (!review) {
		throw new CustomError.NotFoundError(`no review with id: ${reviewID}`);
	}

	checkPermissions(req.user, review.user);

	review.rating = rating;
	review.title = title;
	review.comment = comment;

	await review.save();

	res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
	const { id: reviewID } = req.params;

	const review = await Review.findOne({ _id: reviewID });
	if (!review) {
		throw new CustomError.NotFoundError(`no review with id: ${reviewID}`);
	}

	checkPermissions(req.user, review.user);
	await review.deleteOne();

	res.status(StatusCodes.OK).json({ msg: "review removed" });
};

const getSingleProductReviews = async (req, res) => {
	const { id: productID } = req.params;
	const reviews = await Review.find({ product: productID });

	res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
	createReview,
	deleteReview,
	getAllReviews,
	getOneReview,
	updateReview,
	getSingleProductReviews,
};
