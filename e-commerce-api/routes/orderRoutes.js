const express = require("express");
const router = express.Router();
const {
	authenticateUser,
	authorizePermissions,
} = require("../middleware/authentication");
const {
	createOrder,
	getAllOrders,
	getCurrentUserOrder,
	getOneOrder,
	updateOrder,
} = require("../controllers/orderController");

router
	.route("/")
	.get(authenticateUser, authorizePermissions("admin"), getAllOrders)
	.post(authenticateUser, createOrder);

router.route("/showAllMyOrders").get(authenticateUser, getCurrentUserOrder);

router
	.route("/:id")
	.get(authenticateUser, getOneOrder)
	.patch(authenticateUser, updateOrder);

module.exports = router;
