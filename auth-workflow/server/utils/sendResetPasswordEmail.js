const sendEmail = require('./sendEmail');

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
	const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;
	const message = `<p>reset password: <a href="${resetURL}">reset pass</a></p>`;

	return sendEmail({
		to: email,
		subject: 'reset pass',
		html: `<h4>hi, ${name}. ${message}</h4>`,
	});
};

module.exports = sendResetPasswordEmail;
