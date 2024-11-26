import User from "../models/user.js";
import bcrypt from "bcrypt";
export function createUser(req, res) {
    
    const newUserData = req.body;

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
                    res.json({message : "Logged in successfully"})
                }else{
                    res.status(401).json({message : "Invalid password"})
                }
            }
        }
        
    )
    

}