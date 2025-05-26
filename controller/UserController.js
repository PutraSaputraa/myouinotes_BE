import User from "../model/UserModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ msg: "Please provide all required fields" });
    }

    try {
        // Check if email exists - using findOne instead of findAll
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ msg: "Email already registered" });
        }

        // Hash password
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password: hashPassword
        });

        // Omit password from response
        const { password: _, ...userWithoutPassword } = newUser.get();

        res.status(201).json({ 
            msg: "User registered successfully",
            user: userWithoutPassword
        });
        
    } catch (error) {
        console.error("Register Error:", error);
        
        // More specific error messages
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                msg: "Validation error",
                errors: error.errors.map(e => e.message) 
            });
        }
        
        res.status(500).json({ msg: "Registration failed" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
        return res.status(400).json({ msg: "Email and password are required" });
    }

    try {
        // Check if environment variables are loaded
        if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
            throw new Error("JWT secrets not configured in environment variables");
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const { id: userId, username, email: mail } = user;
        
        // Generate tokens
        const accessToken = jwt.sign(
            { userId, username, mail },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );
        
        const refreshToken = jwt.sign(
            { userId, username, mail },
            process.env.REFRESH_TOKEN_SECRET, // Note: Make sure this matches your .env exactly
            { expiresIn: "1d" }
        );

        await User.update(
            { refresh_token: refreshToken },
            { where: { id: userId } }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
            accessToken,
            user: { userId, username, email: mail },
            msg: "Login successful"
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        
        if (error.message.includes("JWT secrets not configured")) {
            return res.status(500).json({ 
                msg: "Server configuration error",
                details: "JWT secret keys are missing in environment variables"
            });
        }
        
        res.status(500).json({ msg: "Login failed" });
    }
}

export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    const user = await User.findAll({
        where: {
            refresh_token : refreshToken
        }
    });

    if(!user[0]) return res.sendStatus(204);

    const userId = user[0].id;
    
    await User.update({refresh_token: null},{
        where: {
            id : userId
        }
    });

    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}