//Plugin :
const express = require('express'); //import package express
const bodyParser = require('body-parser'); //import package body-parser
const mongoose = require('mongoose'); //import package mongoose
const dotenv = require('dotenv');
const path = require('path'); // routes images 
const helmet = require("helmet");

//Routes :
const sauceRoutes = require('./routes/sauce.js');
const userRoutes = require('./routes/user');

//Application express : 
const app = express();

dotenv.config();
//Connexion BDD :
//mongoose.connect('mongodb+srv://ocadmin:Oc69Admin@p6.rz6cr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
mongoose.connect(process.env.BDD_URI,
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

//traitement des données par bodyParser :
app.use(bodyParser.json()); 

// Indique à express que le dossier images est un dossier static
app.use("/images", express.static(path.join(__dirname, "images")));


app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// Utilisation de helmet pour masquer le framework 
app.use(helmet());


module.exports = app; 
