const sendEmail = require('./sendEmail');

const sendVerificationEmail = async ({
	name,
	email,
	verificationToken,
	origin,
}) => {
	const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;

	const message = `confirm: <a href="${verifyEmail}">verify</a>`;

	return sendEmail({
		to: email,
		subject: 'email confirmation',
		html: `<h4>hi ${name}</h4>
  ${message}
  `,
	});
};

module.exports = sendVerificationEmail;
