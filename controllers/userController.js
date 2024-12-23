import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

export function createUser(req, res) {

    const newUserData = req.body;

    //creating a block for "Only admin users can create admin users"

     if (newUserData.type == "admin") {

        if(req.user == null || req.user.type != "admin"){
            const message = req.user == null ? "Unauthorized! Login as an admin to create an admin user" : "Unauthorized! Only admin users can create admin users";
            res.json({message: message});
            return;
        }
     }

    // Hashing
    // Hash the password before saving
    newUserData.password = bcrypt.hashSync(newUserData.password, 10);

    const user = new User(newUserData);

    user
        .save()
        .then(() => {
            res.status(201).json({ message: "User added successfully" });
        })
        .catch((err) => {
            // Check if the error is a duplicate key error
            if (err.code === 11000) {
                res.status(400).json({ message: "Email already exists!" });
            } else {
                res.status(400).json({ message: "Failed to add user", error: err.message });
            }
        });
}

export function loginUser (req,res){
    const { email, password } = req.body;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                // Avoid exposing whether the issue is email or password
                return res.status(401).json({ message: "Invalid email or password" });
            }

            // Check password
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            


            // Generate JWT token
            const token = jwt.sign(
                {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isBlocked: user.isBlocked,
                    type: user.type,
                    profilePicture: user.profilePicture
                },
                process.env.SECRET_KEY,
                { expiresIn: '1h' }
            );

            return res.json({
                 message: "Logged in successfully",
                token: token,
                user  : {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    type: user.type,
                    profilePicture: user.profilePicture
                }
                });
        })
        .catch(err => {
            console.error("Error in login:", err);
            res.status(500).json({ message: "Internal server error" });
          });

}
export function isAdmin(req) {
    return req.user?.type === "admin";
  }
  
  
  export function isCustomer(req) {
    return req.user?.type === "customer";
  }
  
   
  