const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();
const jwtSecret = process.env.jwtSecret;

const fetchUser = (req, res, next) => {
  // get the id from jwt token and add it to req object
  const token = req.header('auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'Not Authorised' });
  }

  try {
    // verify the token and fetch the payload which is the data object which has user's id.
    const data = jwt.verify(token, jwtSecret);
    req.user = data.user;

    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ msg: 'Not Authorised' });
  }
};
module.exports = fetchUser;
