const mongoose = require('mongoose');
const slugify = require('slugify');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: 'This field is required.'
    },
    category: {
        type: [String], 
        required: 'This field is required.'
    },
    description: {
        type: String, 
        required: 'This field is required.'
    },
    servingSize: {
        type: String
    },
    ingredients: {
        type: Array, 
        required: 'This field is required.'
    },
    instructions: {
        type: Array, 
        required: 'This field is required.'
    },
    image: {
        type: String, 
        required: 'This field is required.'
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
});

recipeSchema.index({name: 'text', ingredients: 'text'});

// validations for slug
recipeSchema.pre('validate', function(next) {
    if (this.name) {
        // convert slug to lower case and remove characters that don't fit in url
        this.slug = slugify(this.name, {lower: true, strict: true})
    }
    next()
})

module.exports = mongoose.model('Recipe', recipeSchema);

