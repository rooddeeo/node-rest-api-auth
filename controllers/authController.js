import { AuthUser } from "../models/user.js";
import { HttpError } from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "./dev.env" });

export const register = async (req, res) => {
	try {
		const hashPassword = await bcrypt.hash(req.body.password, 10);
		const newUser = await AuthUser.create({ ...req.body, password: hashPassword });
		res.status(201).json({
			user: {
				email: newUser.email,
				subscription: newUser.subscription,
			},
		});
	} catch (error) {
		console.log("error:", error);
		const httpError = HttpError(409, error.message);
		res.status(httpError.status).json({ error: "Email is use" });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await AuthUser.findOne({ email });
		if (!user) {
			throw HttpError(401, "Email or password invalid");
		}

		const passwordCompare = await bcrypt.compare(password, user.password);
		if (!passwordCompare) {
			throw HttpError(401, "Email or password invalid");
		}

		const payload = {
			id: user._id,
		};
		const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "23h" });
		await AuthUser.findByIdAndUpdate(user._id, { token });
		res.json({
			token,
			user: {
				email: user.email,
				subscription: user.subscription,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(error.status || 500).json({ error: error.message || "Internal Server Error" });
	}
};

export const getCurrent = async (req, res) => {
	const { email, subscription } = req.user;

	res.json({
		email,
		subscription,
	});
};

export const logout = async (req, res) => {
	const { _id } = req.user;
	await AuthUser.findByIdAndUpdate(_id, { token: null });

	res.status(204).end();
};
