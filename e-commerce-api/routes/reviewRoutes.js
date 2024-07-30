const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const {
	createReview,
	deleteReview,
	getAllReviews,
	getOneReview,
	updateReview,
} = require("../controllers/reviewController");

router.route("/").get(getAllReviews).post(authenticateUser, createReview);
router
	.route("/:id")
	.get(getOneReview)
	.patch(authenticateUser, updateReview)
	.delete(authenticateUser, deleteReview);

module.exports = router;
