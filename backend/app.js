require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const User = require("./model/user");
const Produits = require('./model/produit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require("./middleware/auth");

const app = express();

app.use(express.json());

// Logic goes here



// Register
app.post("/register", async (req, res) => {
    // our register logic goes here...
    try {
        // Get user input
        const { first_name, last_name, email, password } = req.body;

        // Validate user input
        if (!(email && password && first_name && last_name)) {
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
            first_name,
            last_name,
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


app.get('/produits', async  (req, res) => {
    const produits = await Produits.find() // Tous les produits 
    await res.json(produits)
})


app.get(`/products`, async (req, res) => {    //products/?categorie=boisson, froid...   Les categories
    const cate = req.query.categorie
    const produits = await Produits.find({
        categorie : cate
    }) //
    await res.json(produits)
})

app.get('/produits/:id', async (req, res) => { // Produits par ID
    const id = req.params.id
    const produits = await Produits.findOne({_id : id}) 
    await res.json(produits)
})

app.post('/produits', auth, async (req, res) => { //Ajouter un produit
    const titre = req.body.titre;
    const description = req.body.description;
    const prix = req.body.prix;
    const image = req.body.image;
    const categorie = req.body.categorie;

    const nouveau_produit = new app.post('/produits', async (req, res) => { //Ajouter un produit
    const titre = req.body.titre;
    const description = req.body.description;
    const prix = req.body.prix;
    const image = req.body.image;
    const categorie = req.body.categorie;

    const nouveau_produit = new Produits({ 
        titre: titre,
        description: description,
        prix: prix,
        image: image,
        categorie: categorie
    })

    await nouveau_produit.save() 
    res.json(nouveau_produit)
    return

})({ 
        titre: titre,
        description: description,
        prix: prix,
        image: image,
        categorie: categorie
    })

    await nouveau_produit.save() 
    res.json(nouveau_produit)
    return

})

module.exports = app;