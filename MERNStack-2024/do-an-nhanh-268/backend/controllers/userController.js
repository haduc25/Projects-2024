import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';

// login user
const loginUser = async (req, res) => {};

// register user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // user already registered
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: `Người dùng với email ${email} đã tồn tại` });
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: `Vui lòng nhập một địa chỉ email hợp lệ ${email}` });
        }

        if (password.length > 8) {
            return res.json({ success: false, message: `Vui lòng nhập mật khẩu mạnh hơn (dài hơn 8 ký tự)` });
        }

        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
        });

        const user = await newUser.save();
    } catch (error) {}
};

export { loginUser, registerUser };
