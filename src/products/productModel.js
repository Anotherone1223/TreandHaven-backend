const mongoose = require('mongoose')


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    oldPrice: {
        type: Number,
        required: true,
    },
    image: [{
        type: String, // Assuming p_img1 is a string (URL or filename)
    }],
    category: {
        type: String,

    },
    subCategory: {
        type: String,
        required: true,
    },
    sizes: [{
        type: String,
        enum: ['S', 'M', 'L','XL','XXL'], // Assuming only these sizes are available
    }],
    rating: {
        type: Number,
        default: 0
    },
    date: {
        type: Number, // Unix timestamp (milliseconds)
    },
    bestseller: {
        type: Boolean,
    },
    author: { type: mongoose.Types.ObjectId, ref: "User", required: true }
})

const Products = mongoose.model("Product", ProductSchema)

module.exports = Products