import jwt from "jsonwebtoken";

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role.toLowerCase(),
            isApproved: user?.isApproved,
            status: user?.status,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

export default generateToken;