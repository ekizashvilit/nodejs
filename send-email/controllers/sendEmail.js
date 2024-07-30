const nodemailer = require("nodemailer");

const sendEmail = async (req, res) => {
	let testAccount = await nodemailer.createTestAccount();

	const transporter = nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		auth: {
			user: "zion.mayer39@ethereal.email",
			pass: "TphvhXEDW7gptvNDY3",
		},
	});

	let info = await transporter.sendMail({
		from: '"Teona Ekizashvili" <tekizashvili@gmail.com>',
		to: "akiinawwa@gmail.com",
		subject: "hello",
		text: "hello there",
	});

	res.json(info);
};

module.exports = sendEmail;
