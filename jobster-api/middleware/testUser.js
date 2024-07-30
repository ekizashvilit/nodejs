const { BadRequestError } = require("../errors");

const testUser = (req, res, next) => {
	if (req.user.testUser) {
		throw new BadRequestError("test user, read only");
	}

	next();
};

module.exports = testUser;
