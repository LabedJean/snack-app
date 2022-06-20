const mongoose = require('mongoose')


const produit = mongoose.Schema({
    titre: String,
    description: String,
    prix: String,
    image: {
        type: String
    },

    categorie: {
        type: String,
        required: true
    } 
})

module.exports = mongoose.model('produit', produit);