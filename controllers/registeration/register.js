const userModel = require("../../models/user");
const bcrypt = require("bcrypt");


// Register
const register = async (req, res) => {
    const {
        name,
        email,
        password,
    } = req.body;

    // Validate user input
    if (!(email && password && name)) {
        return res.status(400).send({ Message: "Some inputs are missing" });
    }
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await userModel.findOne({ email });
    if (oldUser) {
        return res
            .status(409)
            .json({ Message: "User Already Exist. Please Login" });
    }
    const encryptedPassword = await bcrypt.hash(password, 15);

    let image;
    if (req.file) {
        image = `${process.env.IMG_URL}/images/${req.file.filename}`;
    }

    const newUser = {
        name: name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
        image: image,
    };

    const user = await userModel.create(newUser);
    return user, res.status(201).send({ Message: "User successfully added" });
};

module.exports = {
    register,
};
