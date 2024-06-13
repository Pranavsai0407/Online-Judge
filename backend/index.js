const express = require("express");
const dotenv = require("dotenv");
const { validateRegistration } = require("./middlewares/validationMiddleware");
const app = express();
const { DBConnection } = require("./databases/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const problemRouter = require('./routes/problemRoute');
const assignroleRouter = require('./routes/roleassignRoute');
const testcaseRouter = require('./routes/testcaseRoute');
const userRouter = require('./routes/userRoute');
const submissionRouter = require('./routes/submissionRoute');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // Update with your frontend URL
  credentials: true, // Allow credentials (cookies, headers)
}));

dotenv.config();
DBConnection();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/register", validateRegistration, async (req, res) => {
  try {
    //get all data from frontend
    const { fullname, username, email, country, password } = req.body;
    const existingUser = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("User Already exists with this email");
    }
    if (existingUsername) {
      return res
        .status(400)
        .send("Username Already exists, try with any other Username");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    res.status(200).json({ message: "Registration successful" });
    const user = await User.create({
      fullname,
      username,
      email,
      country,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user.token = token;
    user.password = undefined;
    res
      .status(200)
      .json({ message: "You have successfully registered!", user });
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      return res.status(400).send("Please enter all the details");
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send("User not found");
    }

    const enteredPassword = await bcrypt.compare(password, user.password);

    if (!enteredPassword) {
      return res.status(400).send("Password Incorrect!");
    }

    const token = jwt.sign({ id: user._id, admin: user.admin}, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user.token = token;
    user.password = undefined;

    //store token in cookies with options
    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true, //only manipulated by server not by client/frontend
    };

    //send the token
    res.status(200).cookie("token", token, options).json({
      message: "You have successfully logged in!",
      success: true,
      token,
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true });
  res.status(200).json({ message: "You have successfully logged out!" });
});


app.use('/api/v1/assignrole',assignroleRouter);
app.use('/api/v1/problems', problemRouter);
app.use('/api/v1/testcases', testcaseRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/submissions',submissionRouter);


app.listen(process.env.PORT, () => {
    console.log(`Server is listening on Port ${process.env.PORT}!`);
  })
  .on("error", (err) => {
    console.error("Server startup error:", err);
});
