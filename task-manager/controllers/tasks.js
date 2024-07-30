const Task = require("../models/Task");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");

const getAllTasks = asyncWrapper(async (req, res) => {
	const tasks = await Task.find({});
	res.status(200).json({ tasks });
});

const getOneTask = asyncWrapper(async (req, res, next) => {
	const task = await Task.findOne({ _id: req.params.id });

	if (!task) {
		return next(createCustomError("no task with that id", 404));
	}

	res.status(200).json({ task });
});

const createTask = asyncWrapper(async (req, res) => {
	const task = await Task.create(req.body);
	res.status(201).json({ task });
});

const updateTask = asyncWrapper(async (req, res) => {
	const task = await Task.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
		runValidators: true,
	});

	if (!task) {
		return next(createCustomError("no task with that id", 404));
	}

	res.status(200).json({ task });
});

const deleteTask = asyncWrapper(async (req, res) => {
	const task = await Task.findOneAndDelete({ _id: req.params.id });

	if (!task) {
		return next(createCustomError("no task with that id", 404));
	}

	res.status(200).json({ task });
});

module.exports = {
	getAllTasks,
	createTask,
	deleteTask,
	getAllTasks,
	updateTask,
	getOneTask,
};
