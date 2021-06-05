const { json } = require("body-parser");
const Sauce = require("../models/sauce");
const fs = require("fs");
const jwt = require("jsonwebtoken");

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "bad request" });
  }
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res
          .status(404)
          .json({ message: "la sauce demandé n'existe pas" });
      }
      return res.status(200).json(sauce);
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.createOneSauce = (req, res, next) => {
  if (!req.body.sauce || !req.file) {
    return res.status(400).json({ message: "bad request" });
  }

  const sauceObject = JSON.parse(req.body.sauce);



  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "creation ok" }))
    .catch((error) => res.status(500).json({ error }));
};

exports.updateOneSauce = (req, res, next) => {
  
  // correction suite evaluation. Le code était if(!req.body.sauce) aurais du etre juste req.body)
  if (!req.body) {
    return res.status(400).json({ message: "bad request 222" });
  }
  const sauceobject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
      } : { ...req.body };
  
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceobject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "ok" }))
    .catch((error) => {
      console.log("erreur 1")
      res.status(500).json({ error })});
};

exports.updatelikes = (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ message: "bad request" });
  }

  let like = req.body.like;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      switch (like) {
        case 1:
          if (!sauce.usersLiked.includes(req.body.userId)) {
            sauce.usersLiked.push(req.body.userId);
            sauce.likes = sauce.usersLiked.length;
          }
          break;

        case 0:
          if (!sauce.usersLiked.includes(req.body.userId)) {
            sauce.usersLiked.splice(
              sauce.usersLiked.indexOf(req.body.userId),
              1
            );
            sauce.likes = sauce.usersLiked.length;
          }
          if (!sauce.usersDisliked.includes(req.body.userId)) {
            sauce.usersDisliked.splice(
              sauce.usersDisliked.indexOf(req.body.userId),
              1
            );
            sauce.dislikes = sauce.usersDisliked.length;
          }
          break;

        case -1:
          if (!sauce.usersDisliked.includes(req.body.userId)) {
            sauce.usersDisliked.push(req.body.userId);
            sauce.dislikes = sauce.usersDisliked.length;
          }
          break;
        default:
          return res.status(400).json({ error : "bad request" });
      }
      Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(() => {
          return res.status(200).json({ message: "ok" });
        })
        .catch((error) => {
          return res.status(500).json({ error });
        });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.deleteOneSauce = (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "bad request" });
  }


  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce.userId === res.locals.userID) {
        return res.status(403).json({message : "ce n'est pas votre sauce"})
      }

      const filename = sauce.imageUrl.split("/img/")[1];
      fs.unlink(`img/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "suppression ok" }))
          .catch((error) => {
            res.status(500).json({ error });
          });
      });
    })
    .catch(() => res.status(500).json({ message: "cet objet n existe pas" }));
};
