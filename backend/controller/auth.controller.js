import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

/* USER REGISTER */
const Register = async (req, res) => {
    try {
      /* Take all information from the form */
      const {username,email, password } = req.body;  
      /* Check if user exists */
      // Yaha ham pata kar rahe hai ki jiska registration ho raha voh kahi phele se toh nahi present
      // and email is the unique identity.
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists!" });
      }
      /* Hash the password */
      // yaha ham password ki hash kar rhe hai jisse voh password Encoded ho kar jaye.
      // Generate a salt using bcrypt's genSalt function asynchronously.
      const salt = await bcrypt.genSalt();
      // Use the generated salt to hash the provided password asynchronously using bcrypt's hash function.
      const hashedPassword = await bcrypt.hash(password, salt);
      /* Create a new User */
      // Creating new User in User database.
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      /* Save the new User */
      // used for saving the new database.
      await newUser.save();
      /* Send a successful message */
      // sending responses :
      res
        .status(200)
        .json({ message: "User registered successfully!", user: newUser });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "Registration failed!", error: err.message });
    }
  };
  /* USER LOGIN*/
  const login = async (req, res) => {
    try {
      /* Take the infomation from the form */
      //  email and password are coming from the form and we are destructing it.
      const { email, password } = req.body;
  
      /* Check if user exists */
      // checking with the help of email whether the user with that email is in database or not.
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(409).json({ message: "User doesn't exist!" });
      }
      /* Compare the password with the hashed password */
      // Compare the provided password with the hashed password stored in the user object asynchronously using bcrypt's compare function.
      const isMatch = await bcrypt.compare(password, user.password);
  
      // If the passwords do not match, return a response with status code 400 (Bad Request) and a JSON object containing a message indicating invalid credentials.
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Credentials!" });
      }
  
      // Generate JWT token
      // jwt.sign(payload, secretOrPrivateKey, [options, callback]): This line generates a JSON Web Token (JWT) using the jwt.sign method. It typically includes a payload (in this case, { id: user._id }), which is often the user's unique identifier, a secret key (process.env.JWT_SECRET) used for signing the token, and an optional configuration object specifying token expiration time.
      // In this fixed version, I've added the expiresIn option to set the token expiration time to 1 hour.
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      // Delete user password field
      // delete user.password: This line deletes the password field from the user object. This is commonly done for security reasons to ensure that sensitive information like passwords is not sent to the client.
  
      delete user.password;
  
      // Send response to the client
      // res.status(200).json({ token, user }): This line sends a response to the client with a status code of 200 (OK) and a JSON object containing the token and user data. The token is typically sent back to the client for subsequent authenticated requests, while the user data can be used to update the user's session or display user information on the client side.
      // This is the fixed version with correct token generation and deletion of the password field before sending the response.
  
      res.status(200).json({ token, user });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  };
  export { Register, login };