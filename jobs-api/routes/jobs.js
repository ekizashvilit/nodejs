const express = require("express");
const router = express.Router();

const {
	createJob,
	deleteJob,
	getAllJobs,
	getOneJob,
	updateJob,
} = require("../controllers/jobs");

router.route("/").get(getAllJobs).post(createJob);
router.route("/:id").get(getOneJob).patch(updateJob).delete(deleteJob);

module.exports = router;
