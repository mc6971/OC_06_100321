const mongoose = require ('mongoose'); /*outil de modélisation d'objets MongoDB conçu pour fonctionner dans un environnement asynchrone*/
const uniqueValidator = require('mongoose-unique-validator'); /*plugin qui ajoute une validation de pré-sauvegarde pour les champs uniques dans un schéma Mongoose.*/

const userSchema = mongoose.Schema({
    // userId: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);