const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const env = require("dotenv").config();
const cryptojs = require('crypto-js');

exports.signup = (req, res, next) => {
   
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {

      const email = cryptojs.AES.encrypt(
        req.body.email,
        cryptojs.enc.Hex.parse(process.env.CRYPTO_HEX_KEY),
        {
          mode : cryptojs.mode.ECB
        }
      ).toString()
      const user = new User({
        email: email,
        password: hash,
      });
      user
        .save()
        .then(() => {
          res.status(201).json({ message: "Création utilisateur OK" });
        })
        .catch((error) => res.status(500).json({ error, message : 'deja cree' }));
    })
    .catch((error) => {
          console.log(error)
          res.status(500).json({ error })});
};

exports.login = (req, res, next) => {
  
  const email = cryptojs.AES.encrypt(
    req.body.email,
    cryptojs.enc.Hex.parse(process.env.CRYPTO_HEX_KEY),
    {
      mode : cryptojs.mode.ECB
    }
  ).toString()

  User.findOne({ email: email})
    .then((user) => {
      // console.log(user)
      if (!user) {
        return res.status(404).json({ error: "login incorrect" });
      }
      bcrypt.compare(req.body.password, user.password)
      .then(valid => {
          if(!valid){
              return res.status(404).json({ error : "login incorrect"})
          }
          res.status(200).json({ userId : user._id, token : jwt.sign(
            { userId: user._id },
              process.env.TOKEN_KEY,
              { expiresIn: '600s' }
          )})
      })
      .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
