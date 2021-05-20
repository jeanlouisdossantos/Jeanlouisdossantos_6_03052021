const jwt = require('jsonwebtoken')

module.exports = (req,res,next) => {

    try{

const token = req.headers.authorization.split(' ')[1];
const decodeToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
const userId = decodeToken.userId;
if(req.body.userID && req.body.userID !== userId ){
    throw 'userid non valable'
}else next()

    }

catch (error) { res.status(401).json({ error : {error} | "echec authentification"})


}
}