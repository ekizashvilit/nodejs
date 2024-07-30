const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
	createTokenUser,
	attachCookiesToResponse,
	checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
	console.log(req.user);

	const users = await User.find({ role: "user" }).select("-password");

	res.status(StatusCodes.OK).json({ users });
};

const getOneUser = async (req, res) => {
	const user = await User.findOne({ _id: req.params.id }).select("-password");

	if (!user) {
		throw new CustomError.NotFoundError(`no user with ${req.params.id}`);
	}

	checkPermissions(req.user, user._id);

	res.status(StatusCodes.OK).json({ user });
};

const showUser = async (req, res) => {
	res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
	const { email, name } = req.body;
	if (!email || !name) {
		throw new CustomError.BadRequestError("please provide all values");
	}

	const user = await User.findOne({ _id: req.user.userID });
	user.email = email;
	user.name = name;
	await user.save();

	const tokenUser = createTokenUser(user);
	attachCookiesToResponse({ res, user: tokenUser });
	res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	if (!oldPassword || !newPassword) {
		throw new CustomError.BadRequestError("please provide email and password");
	}

	const user = await User.findOne({ _id: req.user.userID });

	const isPasswordCorrect = await user.comparePassword(oldPassword);
	if (!isPasswordCorrect) {
		throw new CustomError.UnauthenticatedError("invalid credentials");
	}

	user.password = newPassword;
	await user.save();

	res.status(StatusCodes.OK).json({ msg: "password updated" });
};

module.exports = {
	getAllUsers,
	getOneUser,
	showUser,
	updateUser,
	updateUserPassword,
};

// const updateUser = async (req, res) => {
// 	const { email, name } = req.body;
// 	if (!email || !name) {
// 		throw new CustomError.BadRequestError("please provide all values");
// 	}

// 	const user = await User.findOneAndUpdate(
// 		{ _id: req.user.userID },
// 		{ email, name },
// 		{ new: true, runValidators: true }
// 	);
// 	const tokenUser = createTokenUser(user);
// 	attachCookiesToResponse({ res, user: tokenUser });
// 	res.status(StatusCodes.OK).json({ user: tokenUser });
// };
