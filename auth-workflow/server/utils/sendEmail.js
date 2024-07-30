const nodemailer = require('nodemailer');
const nodemailerConfig = require('./nodeMailerConfig');

const sendEmail = async ({ to, subject, html }) => {
	let testAcc = await nodemailer.createTestAccount();

	const transporter = nodemailer.createTransport(nodemailerConfig);

	return transporter.sendMail({
		from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
		to, // list of receivers
		subject, // Subject line
		html, // html body
	});
};

module.exports = sendEmail;
