import bcrypt from 'bcrypt'
import User from '../models/User.js'

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