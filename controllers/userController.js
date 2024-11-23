import User from "../models/user.js";
import bcrypt from "bcrypt";

export function createUser(req, res) {
  
  const newUserData =req.body

  newUserData.password =bcrypt.hashSync(newUserData.password,10)
 

  console.log(newUserData)

    const user = new User(newUserData);

    user
    .save()
    .then(() => {
      res.status(201).json({ message: "User added successfully" });
    })
    .catch((err) => {
      res.status(400).json({ message: "Failed to add user" });
    });
    
}
export function loginUser (req,res){
    User.find({email :req.body.email}).then(
        user => {
            if(user.length == 0){
                res.status(404).json({message : "User not found"})
            }else{
                if(bcrypt.compareSync(req.body.password, user[0].password)){
                    res.json({message : "Logged in successfully"})
                }else{
                    res.status(401).json({message : "Invalid password"})
                }
            }
        }
        
    )
    

}