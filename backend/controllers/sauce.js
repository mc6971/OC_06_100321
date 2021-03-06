const Sauce = require('../models/Sauce')
const fs = require('fs') // sert à la gestion des fichiers

// création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  const sauce = new Sauce({
    ...sauceObject,
    // http://localhost:3000/image/nomdufichier
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
  console.log(sauce);
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }))
}

// modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? // si image
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`
        // s'il n'y en a pas
      }
    : { ...req.body }
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  ) // premier argument est celui qu'on veut modifier, le deuxieme c'est la nouvelle version de l'objet
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }))
}

// suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // on cherche url image
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1] // on recupere le nom precis du fichier ( 2eme element, apres /image/)
      fs.unlink(`images/${filename}`, () => {
        // unlink pour effacer un fichier

        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }))
      })
    })
    .catch(error => res.status(500).json({ error }))
}

// Récupère une seule sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
}

//récupère toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
}

// like et dislike
exports.likeOrDislike = (req, res, next) => {
  //si l'utilisateur aime la sauce
  if (req.body.like === 1) {
    //Ajoue 1 et "push" vers tableau usersLiked
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: req.body.like++ }, //incrémente un champ d'une valeur
        $push: { usersLiked: req.body.userId } //ajout d'une valeur dans un tableau
      }
    )
      .then(() => res.status(200).json({ message: 'Merci !' }))
      .catch(error => res.status(400).json({ error }))    
  } 
  // si utilisateur n'aime pas la sauce
  else if (req.body.like === -1) {
    // Retire 1 et "push" vers tableau usersDisliked
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: req.body.like++ * -1 },
        $push: { usersDisliked: req.body.userId }
      }
    )
      .then(() => res.status(200).json({ message: 'Désolé' }))
      .catch(error => res.status(400).json({ error }))
  }
  else { 
    // Si like === 0 l'utilisateur supprime son vote
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        // Si le tableau "userLiked" contient l'ID de l'utilisateur
        if (sauce.usersLiked.includes(req.body.userId)) { 
          // On enlève un like du tableau "userLiked" 
          Sauce.updateOne(
            { _id: req.params.id },
            { 
              $pull: { usersLiked: req.body.userId },
              $inc: { likes: -1 }
            }
          )
            .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
            .catch(error => res.status(400).json({ error }))
        } 
        else if (sauce.usersDisliked.includes(req.body.userId)) {
            // Si le tableau "userDisliked" contient l'ID de l'utilisateur
            // On enlève un dislike du tableau "userDisliked" 
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 }
            }
          )
            .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
            .catch(error => res.status(400).json({ error }))
        }
      })
      .catch(error => res.status(400).json({ error }));
  }
};
