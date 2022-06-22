require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const User = require("./model/user");
const Produits = require('./model/produit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require("./middleware/auth");
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logic goes here

app.use(cors())

// Register
app.post("/register", async (req, res) => {
    // our register logic goes here...
    try {
        // Get user input
        const { firstname, lastname, email, password } = req.body;

        // Validate user input
        if (!(email && password && firstname && lastname)) {
            res.status(400).send("Tous les champs sont requis");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send("L'utilisateur existe déja");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            firstname,
            lastname,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
});

// Login
app.post("/login", async (req, res) => {
    // our login logic goes here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("Tous les champs sont requis");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;

            // user
            res.status(200).json(user);
        }
        res.status(400).send("Mot de passe invalide");
    } catch (err) {
        console.log(err);
    }
});

app.get("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

// Tous les produits
app.get('/produits', async  (req, res) => {
    const produits = await Produits.find()  
    await res.json(produits)
})

// Catégorie products/?categorie=boisson, froid...   Les categories
app.get(`/products`, async (req, res) => {   
    const cate = req.query.categorie
    const produits = await Produits.find({
        categorie : cate
    }) //
    await res.json(produits)
})

//Produits par ID
app.get('/produits/:id', async (req, res) => { 
    const id = req.params.id
    const produits = await Produits.findOne({_id : id}) 
    await res.json(produits)
})

// filtre par prix entre min et max
app.get('/byprice', async (req, res) => { 
    const max = req.query.max;
    const min = req.query.min;
    const produits = await Produits.find(
        { "prix": {$gt : min, $lt : max}}
    ) 
    await res.json(produits)
})

//Ajouter un produit -- enlever auth pour les tests
app.post('/produits', auth, async (req, res) => { 
    try {
        
        const { titre, description, prix, image, categorie } = req.body
        
        if (!(titre && description && prix && image && categorie)) {
            res.status(400).send("Tous les champs sont requis")
        }
        const nouveau_produit = new Produits({
            titre: titre,
            description: description,
            prix: prix,
            image: image,
            categorie: categorie
        })
        await nouveau_produit.save()
        res.status(200).json(nouveau_produit);

    } catch (err) {
        console.log(err)
    }
})

// Modifier un produit --enlever auth pour les tests
app.patch('/produits/:id', auth,  async (req, res) => { 
    try {
        const id = req.params.id
        const produits = await Produits.findOne({ _id: id })
        const { titre, description, prix, image, categorie } = req.body

        if (titre) {
            produits.titre = titre
        }
        if (description) {
            produits.description = description
        }
        if (prix) {
            produits.prix = prix
        }
        if (image) {
            produits.image = image
        }
        if (categorie) {
            produits.categorie = categorie
        }

        await produits.save()

        res.status(200).json(produits)
        
    } catch (err) {
        console.log(err)
    }
})


// Effacer un produit
app.delete('/produits/:id', auth, async (req, res) => { 
    try{
        const id = req.params.id
        const suppr = await Produits.deleteOne({ _id: id })

        res.status(200).json(suppr)
    } catch (err){
        console.log(err)
    }
})

module.exports = app;