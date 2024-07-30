const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
	const token = req.signedCookies.token;

	if (!token) {
		throw new CustomError.UnauthenticatedError("auth invalid");
	}

	try {
		const { name, userID, role } = isTokenValid({ token });
		req.user = { name, userID, role };
		next();
	} catch (error) {
		throw new CustomError.UnauthenticatedError("auth invalid");
	}
};

const authorizePermissions = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			throw new CustomError.UnauthorizedError("unauthorized to access");
		}
		next();
	};
};

module.exports = { authenticateUser, authorizePermissions };
