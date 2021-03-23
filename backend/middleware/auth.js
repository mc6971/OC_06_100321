const jwt = require('jsonwebtoken'); /*Méthode permettant l'authentification sans stockage des informations sur les utilisateurs sur le système lui-même */

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
          throw 'User ID non valable';
        } else {
          next();
        }
      } catch (error) { // probleme d'autentification
          res.status(401).json({ error: error || 'Requete non authentifiée !'
        });
      }
};