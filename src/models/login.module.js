const Account = require("../models/Account.models");
const axios = require('axios');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config({ path: '.env' });

const login = async (req, res) => {
    const { Email, Password } = req.body; // Sử dụng email thay vì username
    try {
        const account = await Account.findOne({ Email: Email }); // Tìm người dùng bằng email
        if (!account) {
            return res.status(400).json({ error: "Email is incorrect" }); // Thông báo nếu email không đúng
        }
        const validPassword = await bcrypt.compare(Password, account.Password); // So sánh mật khẩu
        if (!validPassword) {
            return res.status(400).json({ error: "Password is incorrect" }); // Thông báo nếu mật khẩu không đúng
        }
        if (account && validPassword) {
            const accessToken = jwt.sign({
                id: account._id,
                name: account.AccountName,
                Email: account.Email,
            },
                process.env.JWT_ACCESS_KEY, // Sử dụng biến môi trường cho khóa JWT
                { expiresIn: "1h" }, // Thời gian hết hạn token
            );
            const maxAge = 3600000; // Thời gian sống là 1 giờ (1 * 60 * 60 * 1000)
            res.cookie('accessToken', accessToken, { maxAge: maxAge, httpOnly: true }); // Gửi token dưới dạng cookie
            const { Password, ...info } = account._doc; // Loại bỏ thông tin mật khẩu khỏi đối tượng trả về
            res.status(200).json({ ...info, accessToken }); // Trả về thông tin người dùng và accessToken
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" }); // Thông báo lỗi server
    }
};

module.exports = {
    login
}