import Users from "../../models/users.js";
import bycript from "bcryptjs";
import jwt from "jsonwebtoken";
import Students from "../../models/students.js";

export const userLogin = async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    const user = await Users.findOne({ userId: userId });
    if (!user) throw new Error("Invalid username Or password");
    if (user.password !== password)
      throw new Error("Invalid username Or password");
    let userData;
    if (user.userType === 0) {
      userData = await Students.findOne({ studentId: userId });
      if (!userData) throw new Error("Invalid user id");
    }

    // const equal = bycript.compareSync(password, user.password);
    // if (!equal) throw new Error("invalid username or password");

    const token = jwt.sign(
      {
        userId: user._id.toString(),
      },
      "diuqiweudtq7wte76qwyeqgtwe",
      { expiresIn: "2D" }
    );
    res.status(200).send({ token: token, userData: user });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const userUpdate = async (req, res, next) => {};
