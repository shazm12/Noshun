const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const authorization = require('../middleware/authorization');
const dotenv = require("dotenv");
dotenv.config();

const jwtSecret = process.env.jwtSecret;

// ROUTE-1: @route GET api/auth
// @desc   test api
// @access Public
router.get('/', (req, res) => {
  try {
    res.send('Hello');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// ROUTE-2: @route POST api/auth/createUser
// @desc create user and NO LOGIN required
// @access Public
router.post(
  '/createUser',
  [
    body('name', 'Name must be atleast 3 characters').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 3 characters').isLength({
      min: 3,
    }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      const { name, email, password } = req.body;
      let user = await User.findOne({ email });

      if (user) {
        return res.status(404).json({ success, msg: 'User exists already' });
      }

      // hashing the password
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);

      // storing the req.body parameters and the secured hash password in the user object.
      user = new User({
        name: name,
        email: email,
        password: secPass,
      });

      //Data and token to be retreived.
      const data = {
        id: user.id,
      };

      //token generation
      const authtoken = jwt.sign(data, jwtSecret);

      await user.save();
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// ROUTE-3: @route POST api/auth/login
// @desc Log in
// @access Public
router.post(
  '/login',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password can not be blank').exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });

      // if no user found
      if (!user) {
        return res
          .status(400)
          .json({ success, msg: 'Please enter the correct credentials' });
      }

      // after the user's email getting matched, compare the req.body.password with the user.password
      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        return res
          .status(400)
          .json({ success, msg: 'Please enter the correct credentials' });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, jwtSecret);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// ROUTE-4: @route POST api/auth/getuser
// @desc get user details after log in
// @access PRIVATE
router.post('/getuser', authorization, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');

    // console.log(user);
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
