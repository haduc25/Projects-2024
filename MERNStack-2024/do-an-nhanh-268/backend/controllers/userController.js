import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: `Tài khoản ${email} này không tồn tại` });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Mật khẩu không đúng' });
        }

        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        res.json({ success: false, message: `Lỗi: ${error.message}` });
    }
};

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY);
};

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

        if (password.length < 8) {
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
        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        res.json({ success: false, message: `Lỗi: ${error.message}` });
    }
};

export { loginUser, registerUser };
