import bcrypt from 'bcrypt'
import User from '../models/User.js'
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import Session from '../models/Session.js';

const ACCESS_TOKEN_TTL = '30m'; //ussualy under 15m
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; //14days

export const signUp = async(req, res) => {
    try {
        const {username, password, email, firstname, lastname} = req.body;

         if (!username || !password || !email || !firstname || !lastname) {
            return res.status(400).json({
                message: "username, password, email, firstname, and lastname are all required!"
            });
        }

        //Check username availability
        const duplicate = await User.findOne({username});

        if(duplicate){
            return res.status(409).json({message: 
                "Username already exists"
            });
        }

        //password encoding

        const hashedPassword = await bcrypt.hash(password, 10); //salt = 10

        //create user new
        await User.create({
            username,
           hashedPassword,
            email,
            displayName: `${firstname} ${lastname}`
        });

        //return
        return res.sendStatus(204);

    } catch (error) {
        console.log("Sign-up failed", error);
        return res.status(500).json({message: 
            "system is error"
        })
    }
};

export const signIn = async(req, res) => {
    try {
        // get inputs
        const {username, password} = req.body;

        if (!username || !password){
            return res.status(400).json({message: "missing username or password"});
        }

        //get HashedPassword in db to compare with input

        const user = await User.findOne({username});

        if(!user){
            return res.status(401).json({message: "username or password is incorrect"});
        }

        //check password

        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
        if(!passwordCorrect){
            return res.status(401).json({message: "username or password is incorrect"});
        }

        // if the same, create AcessToken with 
        
        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL});

        //create refresh token
        const refreshToken = crypto.randomBytes(64).toString("hex");

        //create new session to store refresh token
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),

        });

        //return refresh token to cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none', // backend, frontend deploy diff
            maxAge: REFRESH_TOKEN_TTL,
        });

        //return access token to res
        return res.status(200).json({message: `User ${user.displayName} logged in!`, accessToken});

    } catch (error) {
        console.log("Sign-in failed", error);
        return res.status(500).json({message: 
            "system is error"
        })
    }
}