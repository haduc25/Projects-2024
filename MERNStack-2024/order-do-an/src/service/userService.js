const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// module.exports = {
//     async createUser(userData) {},
// };

module.exports = {
    // CREATE USER
    async createUser(userData) {
        try {
            let { fullName, emailValue, password, role } = userData;
            const isUserExist = await User.findOne({ email: emailValue });

            if (isUserExist) {
                throw new Error('Người dùng email ' + emailValue + ' này đã tồn tại');
            }

            password = await bcrypt.hash(password, 8);

            const user = await User.create({ fullName, email: emailValue, password: password, role });

            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // GET USER
    async getUserByEmail(email) {
        try {
            const user = await User.findOne({ email: email });

            if (!user) {
                throw new Error('Người dùng không tồn tại');
            }
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // FIND USER BY ID
    async findUserById(userId) {
        try {
            const user = await User.findById(userId).populate('addresses');

            if (!user) {
                throw new Error('Người dùng không tồn tại');
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },
};

// module.exports = { createUser };
