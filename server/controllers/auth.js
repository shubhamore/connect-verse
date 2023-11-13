import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Register
export const register = async (req, res) => {
    try {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) return res.status(409).json("Email already exists");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            profilePicture: req.body.profilePicture,
            // location: req.body.location,
            password: hashedPassword,
        });

        const user = await newUser.save();
        res.status(201).json(user);
    } catch (err) {
        console.log("auth.js register error",err)
        res.status(500).json(err);
    }
}

// Login
export const login = async (req, res) => {
    try{
        const {email,password}=req.body
        const user= await User.findOne({email:email})
        if(!user) return res.status(404).json("user not found")

        const validPassword= await bcrypt.compare(password,user.password)
        if(!validPassword) return res.status(400).json("wrong password")
        
        const accessToken= jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"5d"})
        delete user.password
        res.status(200).json({user,accessToken})
    } catch(err){
        console.log("auth.js login error",err)
        res.status(500).json(err);
    }
}

// Verify
export const verifyToken = async (req, res) => {
    try {
        let token = req.header("Authorization");

        if (!token) return res.status(401).json("You are not authenticated");

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
            if (err) {
                console.log("auth.js verifyToken error", err);
                return res.status(401).json("Invalid token");
            }
            
            req.user = verified;
            res.status(200).json(true);
        });
    } catch (err) {
        console.log("auth.js verify error", err);
        res.status(500).json(err);
    }
}
