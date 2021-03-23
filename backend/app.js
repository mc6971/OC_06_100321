const express = require('express');
const bodyParser = require('body-parser'); /*Analyser les corps de requête entrants dans un middleware avant vos gestionnaires*/
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const path = require('path'); // routes images 
const helmet = require("helmet"); /*aide à protéger votre application de certaines des vulnérabilités bien connues du Web en configurant de manière appropriée des en-têtes HTTP.*/

const sauceRoutes = require('./routes/sauce.js');
const userRoutes = require('./routes/user');

const app = express();

app.use(helmet());


mongoose.connect('mongodb+srv://ocadmin:Oc69Admin@p6.rz6cr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
{ useNewUrlParser: true,
useUnifiedTopology: true })
.then(() => console.log('Connexion MongoDB réussie'))
.catch(() => console.log('Connexion échouée'));

// pour eviter les erreurs de CORS et que tout le monde puisse faire des requetes depuis son navigateur 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');// tout le monde peut acceder à notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');// on donne l'autorisation pour utiliser certaines entete
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json()); 

// Indique à express que le dossier images est un dossier static
app.use("/images", express.static(path.join(__dirname, "images")));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use(helmet());


module.exports = app; 
