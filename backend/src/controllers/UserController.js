import httpStatus from 'http-status';
import { User } from '../models/usersModel.js';
import bcrypt, { hash } from 'bcryptjs';
import crypto from 'crypto';

// Login a user
export const login = async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Please enter all fields" });
    }

    try{
        const user = await User.findOne({ username });
        if(!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User does not exist" });
        }

        let isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });
        }

        if(isPasswordCorrect) {
            let token = crypto.randomBytes(20).toString('hex');

            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ message: "Login successful", token });
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });
        }
    }catch (e) {
        res.json({ message: e.message

        });
    }
}
// Register a new user
export const register = async (req, res) => {
    const { name, username, password } = req.body;

    console.log('Register request body:', req.body); // Add this line for debugging

    if (!name || !username || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Please provide all required fields" });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: "User already exists" });
        }

        console.log('Password before hashing:', password); // Add this line for debugging

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            name: name,
            username: username,
            password: hashedPassword
        });

        await user.save();
        res.status(httpStatus.CREATED).json({ message: "User created successfully" });
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
};