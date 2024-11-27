import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export function createUser(req, res) {

    const newUserData = req.body;

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
    User.find({email :req.body.email}).then(
        users => {
            if(users.length == 0){
                res.status(404).json({message : "User not found"})
            }else{
                const user = users[0]
                if(bcrypt.compareSync(req.body.password, user.password)){
                    //res.json({message : "Logged in successfully"})
                    // Genarate Jwt token
                    const token = jwt.sign({
                        email :user.email,
                        firstName :user.firstName,
                        lastName : user.lastName,
                        isBlocked : user.isBlocked,
                        type: user.type,
                        profilePicture : user.profilePicture

                    }, "secret-key-5000")
                    res.json({message : "Logged in successfully", token})
                    


                }else{
                    res.status(401).json({message : "Invalid password"})
                }
            }
        }
        
    )
    

}
