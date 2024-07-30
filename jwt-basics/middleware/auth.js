const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authenticationMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader.split(" ")[1];

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new UnauthenticatedError("no token");
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const { id, username } = decoded;

		req.user = { id, username };

		next();
	} catch (error) {
		throw new UnauthenticatedError("not authorized");
	}
};

module.exports = authenticationMiddleware;
