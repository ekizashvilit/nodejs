const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
	const jobs = await Job.find({ createdBy: req.user.userID }).sort("createdAt");
	res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getOneJob = async (req, res) => {
	const {
		user: { userID },
		params: { id: jobID },
	} = req;

	const job = await Job.findOne({
		_id: jobID,
		createdBy: userID,
	});

	if (!job) {
		throw new NotFoundError("no job with id");
	}

	res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
	req.body.createdBy = req.user.userID;
	const job = await Job.create(req.body);

	res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
	const {
		body: { company, position },
		user: { userID },
		params: { id: jobID },
	} = req;

	if (company === "" || position === "") {
		throw new BadRequestError("company or position should not be empty");
	}

	const job = await Job.findByIdAndUpdate(
		{ _id: jobID, createdBy: userID },
		req.body,
		{ new: true, runValidators: true }
	);

	if (!job) {
		throw new NotFoundError("no job with id");
	}

	res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
	const {
		user: { userID },
		params: { id: jobID },
	} = req;

	const job = await Job.findByIdAndDelete({
		_id: jobID,
		createdBy: userID,
	});

	if (!job) {
		throw new NotFoundError("no job with id");
	}

	res.status(StatusCodes.OK).send("job deleted");
};

module.exports = { createJob, deleteJob, getAllJobs, getOneJob, updateJob };
