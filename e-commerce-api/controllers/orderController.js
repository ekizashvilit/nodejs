const Order = require("../models/Order");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const fakeStripeAPI = async ({ amount, currency }) => {
	const client_secret = "someRandomValue";

	return { client_secret, amount };
};

const createOrder = async (req, res) => {
	const { items: cartItems, tax, shippingFee } = req.body;

	if (!cartItems || cartItems.length < 1) {
		throw new CustomError.BadRequestError("no cart items provided");
	}

	if (!tax || !shippingFee) {
		throw new CustomError.BadRequestError("provide tax and shipping fee");
	}

	let orderItems = [];
	let subtotal = 0;

	for (const item of cartItems) {
		const dbProduct = await Product.findOne({ _id: item.product });
		if (!dbProduct) {
			throw new CustomError.NotFoundError(`no prod with id: ${item.product}`);
		}

		const { name, price, image, _id } = dbProduct;
		const singleOrderItem = {
			amount: item.amount,
			name,
			price,
			image,
			product: _id,
		};

		orderItems = [...orderItems, singleOrderItem];

		subtotal += item.amount * price;
	}

	const total = tax + shippingFee + subtotal;
	const paymentIntent = await fakeStripeAPI({
		amount: total,
		currency: "usd",
	});

	const order = await Order.create({
		tax,
		total,
		subtotal,
		orderItems,
		shippingFee,
		user: req.user.userID,
		clientSecret: paymentIntent.client_secret,
	});

	res.status(StatusCodes.OK).json({ order, clientSecret: order.clientSecret });
};

const getAllOrders = async (req, res) => {
	const orders = await Order.find({});

	res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getOneOrder = async (req, res) => {
	const { id: orderID } = req.params;

	const order = await Order.findOne({ _id: orderID });
	if (!order) {
		throw new CustomError.NotFoundError(`no prod with id: ${orderID}`);
	}

	checkPermissions(req.user, order.user);

	res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrder = async (req, res) => {
	const orders = await Order.find({ user: req.user.userID });

	res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const updateOrder = async (req, res) => {
	const { id: orderID } = req.params;
	const { paymentIntentID } = req.body;

	const order = await Order.findOne({ _id: orderID });
	if (!order) {
		throw new CustomError.NotFoundError(`no prod with id: ${orderID}`);
	}

	checkPermissions(req.user, order.user);

	order.paymentIntentID = paymentIntentID;
	order.status = "paid";

	await order.save();

	res.status(StatusCodes.OK).json({ order });
};

module.exports = {
	createOrder,
	getAllOrders,
	getCurrentUserOrder,
	getOneOrder,
	updateOrder,
};
