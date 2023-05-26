const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const login = async (req, res) => {
	try {
		const { email, phone, password } = req.body;

		const userByEmail = await userModels.findOne({ email });
		const userByPhone = await userModels.findOne({ phone });

		if (email) {
			if (!userByEmail) {
				return res.status(400).json({ message: "This email does not exist!" });
			}

			const isMatch = await bcrypt.compare(password, userByEmail.password);

			checkPassword(isMatch, res, userByEmail);
		} else {
			if (!userByPhone) {
				return res.status(400).json({ message: "This phone does not exist!" });
			}

			const isMatch = await bcrypt.compare(password, userByPhone.password);

			checkPassword(isMatch, res, userByPhone);
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};

const checkPassword = (isMatch, res, user) => {
	if (!isMatch) {
		return res.status(400).json({ message: "Password is incorrect!" });
	}

	return res.status(200).json({
		message: "Login success!",
		token: "HASKJDHKJAHDJASHDKJAHSKJDHASKJDHASKJDHKJDHJKAS",
		user,
	});
};

const register = async (req, res) => {
	try {
		const { email, phone, name, password, confirm_password } = req.body;

		if (!email || !phone || !name || !password || !confirm_password) {
			return res.status(400).json({ message: "Please fill all fields!" });
		}

		if (!validateEmail(email)) {
			return res.status(400).json({ message: "Invalid email!" });
		}

		if (password.length < 6) {
			return res.status(400).json({ message: "Password must be at least 6 characters." });
		}

		if (password !== confirm_password) {
			return res.status(400).json({ message: "Password is incorrect!" });
		}

		const user = await userModels.findOne({ email });
		if (user) {
			return res.status(400).json({ message: "This email alreadt exist!" });
		}

		const passwordHash = await bcrypt.hash(password, 12);

		const newUser = new userModels({
			email,
			phone,
			name,
			password: passwordHash,
		});

		await newUser.save();

		res.status(200).json({ message: "Register succuss" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};

module.exports = router;
