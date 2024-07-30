const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
	req.body.user = req.user.userID;

	const product = await Product.create(req.body);

	res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
	const products = await Product.find({});

	res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getOneProduct = async (req, res) => {
	const { id: productID } = req.params;

	const product = await Product.findOne({ _id: productID }).populate("reviews");
	if (!product) {
		throw new CustomError.NotFoundError(`no product with id: ${productID}`);
	}

	res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
	const { id: productID } = req.params;

	const product = await Product.findOneAndUpdate({ _id: productID }, req.body, {
		new: true,
		runValidators: true,
	});
	if (!product) {
		throw new CustomError.NotFoundError(`no product with id: ${productID}`);
	}

	res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
	const { id: productID } = req.params;

	const product = await Product.findOne({ _id: productID });
	if (!product) {
		throw new CustomError.NotFoundError(`no product with id: ${productID}`);
	}

	await product.deleteOne();

	res.status(StatusCodes.OK).json({ msg: "product deleted" });
};

const uploadImage = async (req, res) => {
	if (!req.files) {
		throw new CustomError.BadRequestError("no file upload");
	}

	const productImage = req.files.image;
	if (!productImage.mimetype.startsWith("image")) {
		throw new CustomError.BadRequestError("please upload image");
	}

	const maxSize = 1024 * 2024;
	if (productImage.size > maxSize) {
		throw new CustomError.BadRequestError(
			"please upload image smaller than 1mb"
		);
	}

	const imagePath = path.join(
		__dirname,
		"../public/uploads/" + `${productImage.name}`
	);
	await productImage.mv(imagePath);

	res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
	createProduct,
	deleteProduct,
	getAllProducts,
	getOneProduct,
	updateProduct,
	uploadImage,
};
