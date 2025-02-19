import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export function createUser(req, res) {
  const newUserData = req.body;

  // Extract the token from the request header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided. Unauthorized' });
  }
  if (!newUserData.email || !newUserData.password || !newUserData.firstName || !newUserData.lastName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Verify the JWT token
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);  // Use the correct JWT secret

    // Check if the user making the request is an admin
    if (newUserData.type === 'admin') {
      if (decoded.type !== 'admin') {
        return res.status(403).json({
          message: 'Unauthorized! Only admin users can create admin users',
        });
      }
    }

    // Hash the password before saving
    newUserData.password = bcrypt.hashSync(newUserData.password, 10);

    const user = new User(newUserData);

    user
      .save()
      .then(() => {
        res.status(201).json({ message: 'User added successfully' });
      })
      .catch((err) => {
        // Check for duplicate email
        if (err.code === 11000) {
          return res.status(400).json({ message: 'Email already exists!' });
        }
        res.status(400).json({ message: 'Failed to add user', error: err.message });
      });

  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function loginUser(req, res) {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        // Avoid exposing whether the issue is email or password
        return res.status(401).json({ message: "Invalid email or password" });
      }
      if (user.isBlocked) {
        return res.status(403).json({ message: "Your account has been blocked. Contact support." });
      }

      // Check password
      bcrypt.compare(password, user.password, (err, isPasswordValid) => {
        if (err) {
          console.error("Error in password comparison:", err);
          return res.status(500).json({ message: "Internal server error" });
        }

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
            profilePicture: user.profilePicture,
          },
          process.env.SECRET_KEY,
          { expiresIn: "1h" }
        );

        return res.json({
          message: "Logged in successfully",
          token: token,
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            type: user.type,
            profilePicture: user.profilePicture,
          },
        });
      });
    })
    .catch((err) => {
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

export async function getUser(req,res) {
    if(req.user == null){
        res.status(401).json({message: "Unauthorized user! Please login to continue"});
        return;
    }
    res.json(req.user);
    
}
export function authenticateUser(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided. Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Attach user data to `req`
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}



export async function findUsers(req, res) {
    try {
        const { type } = req.query; // Get user type from query parameter

        // If no type is provided, we can assume you're fetching customers.
        if (!type) {
            return res.status(400).json({ message: "Please specify user type (customer/admin)." });
        }

        // Validate the type parameter (customer or admin)
        if (!["customer", "admin"].includes(type)) {
            return res.status(400).json({ message: "Invalid user type. Must be 'customer' or 'admin'." });
        }

        const users = await User.find({ type });

        if (users.length === 0) {
            return res.status(404).json({ message: `No ${type}s found.` });
        }

        res.json(users);
    } catch (err) {
        console.error("Error in finding users:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function googleLogin(req, res) {

  const token =req.body.token;

  try{
    const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`,{
      headers: {
        Authorization: `Bearer ${token}`
      } 
    });
   const email = response.data.email;
   //check if the user already exists

   const usersList =await User.find({email: email});
   
   if (usersList.length > 0){
     const user = usersList[0];
     const token = jwt.sign(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isBlocked: user.isBlocked,
        type: user.type,
        profilePicture: user.profilePicture,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    return res.json({
      message: "Logged in successfully",
      token: token,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        type: user.type,
        profilePicture: user.profilePicture,
      },
    });
   }else{
      //create a new user
      const newUser = {
        email: email,
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        password: "google",
        type: "customer",
        profilePicture: response.data.picture
      }
      const user = new User(newUser);
      user.save()
      .then(() => {
        res.status(201).json({ message: "User added successfully" });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ message: "Failed to add user", error: err.message });
      });
   }


  }catch (e) {
    console.error("Google login error:", e.response?.data || e.message);
    res.status(500).json({ message: "Google login failed", error: e.message });
  }


}

export async function toggleBlockUser(req, res) {
  const { userId } = req.params;

  // Extract token from headers
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided. Unauthorized" });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Only admins can block/unblock users
    if (decoded.type !== "admin") {
      return res.status(403).json({ message: "Unauthorized! Only admins can modify user status." });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent blocking another admin
    if (user.type === "admin") {
      return res.status(403).json({ message: "Cannot block/unblock an admin" });
    }

    // Toggle block status
    user.isBlocked = !user.isBlocked;
    await user.save();

    return res.status(200).json({ 
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
      user 
    });

  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

