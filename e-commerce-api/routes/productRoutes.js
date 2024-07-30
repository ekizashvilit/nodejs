const express = require("express");
const router = express.Router();
const {
	authenticateUser,
	authorizePermissions,
} = require("../middleware/authentication");

const {
	createProduct,
	deleteProduct,
	getAllProducts,
	getOneProduct,
	updateProduct,
	uploadImage,
} = require("../controllers/productController");
const { getSingleProductReviews } = require("../controllers/reviewController");

router
	.route("/")
	.get(getAllProducts)
	.post([authenticateUser, authorizePermissions("admin")], createProduct);

router
	.route("/uploadImage")
	.post([authenticateUser, authorizePermissions("admin")], uploadImage);

router
	.route("/:id")
	.get(getOneProduct)
	.patch([authenticateUser, authorizePermissions("admin")], updateProduct)
	.delete([authenticateUser, authorizePermissions("admin")], deleteProduct);

router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;
