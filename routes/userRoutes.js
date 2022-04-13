const express = require('express');
const router = express.Router();
const jwtDecode = require('jwt-decode')
const bcrypt = require("bcrypt");
const randToken = require('rand-token');
const jsonwebtoken = require('jsonwebtoken');
const jwt = require('express-jwt');
require('dotenv').config()

const app = express()

const SECRET = process.env.SECRET;

require("../utils/database").connect();

const User = require("../models/User");
const Token = require("../models/Token");

router.use(express.json());

const generateToken = user => {
 
    const token = jsonwebtoken.sign({
    sub: user._id,
    email: user.email
  }, SECRET, {
    expiresIn: '1h',
    algorithm: 'HS256'
  })
 
 
  return token
}

const getRefreshToken = () => randToken.uid(256)

const hashPassword = password => {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if(err) reject(err)
        bcrypt.hash(password, salt, (err, hash) => {
          if(err) reject(err)
          resolve(hash)
        })
      })
    })
  }

const checkPassword = (password, hash) => bcrypt.compare(password, hash)

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) { 
        return res.status(401).json({
            message: 'User not found!'
        })
      }

    const isPasswordValid = await checkPassword(password, user.password)

    if(!isPasswordValid) {
        return res.status(401).json({
            message: 'Invalid password!'
    })}

    const accessToken = generateToken(user)
    const decodedAccessToken = jwtDecode(accessToken)
    const accessTokenExpiresAt = decodedAccessToken.exp
    const refreshToken = getRefreshToken(user)

    const storedRefreshToken = new Token({ refreshToken, user: user._id })
    await storedRefreshToken.save()

    res.json({
        accessToken,
        expiresAt: accessTokenExpiresAt,
        refreshToken
    })
})

router.post("/register", async (req, res) => {
   
    const { name, lastname, username, email, password } = req.body

    const hashedPassword = await hashPassword(password)

    const userData = {
        name: name,
        lastname: lastname,
        username: username,
        email: email,
        password: hashedPassword,
      }

    //Verifying logic
        /*Verify email (unique)*/
    const existingUser = await User.findOne({ email: email }).lean()
        
    if(existingUser) {
        return res.status(400).json({
          message: 'Email already exists'
        })
      }

    const user = new User(userData)
    const savedUser = await user.save()

    if(savedUser) {
        const accessToken = generateToken(savedUser);
        const decodedToken = jwtDecode(accessToken);
        const expiresAt = decodedToken.exp;

        return res.status(200).json({
        message: 'User created successfully',
        accessToken,
        expiresAt,
        refreshToken: getRefreshToken(savedUser),
        })
    }

app.post('/refreshToken', async (req, res) => {
        const {refreshToken } = req.body
        try {
          const user = await Token.findOne({refreshToken}).select('user')
      
          if(!user) {
            return res.status(401).json({
              message: 'Invalid token'
            })
          }
      
          const existingUser = await User.findOne({_id: user.user})
      
          if(!existingUser) {
            return res.status(401).json({
              message: 'Invalid token'
            })
          }
      
          const token = generateToken(existingUser)
          return res.json({accessToken: token})
        } catch (err) {
          return res.status(500).json({message: 'Could not refresh token'})
        }
      })
      
      const attachUser = (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
          return res
            .status(401)
            .json({ message: 'Authentication invalid' });
        }
        const decodedToken = jwtDecode(token.slice(7));
      
        if (!decodedToken) {
          return res.status(401).json({
            message: 'There was a problem authorizing the request'
          });
        } else {
          req.user = decodedToken;
          next();
        }
      };
      
app.use(attachUser);

});

module.exports = router;