const express = require('express');
const Products = require('./productModel');
const Reviews = require('../reviews/reviewsModel');
const { verify } = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');
const router = express.Router();

// post a product
router.post("/create-product", async (req, res) => {
    try {
        const newProduct = new Products({ ...req.body })

        const savedProduct = await newProduct.save()
        //calculate review
        const reviews = await Reviews.find({ productId: savedProduct._id })
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0)
            const averageRating = totalRating / reviews.length;
            savedProduct.rating = averageRating
            await savedProduct.save();
        }

        res.status(201).send(savedProduct)
    } catch (error) {
        console.error("Error creating new Product", error)
        res.status(500).send({ message: "Failed To create new Product" })
    }
})

//get all product
// router.get("/", async (req, res) => {
//     try {
//         const { category, subCategory, sizes, minPrice, maxPrice, page = 1, limit = 10 } = req.query
//         let filter = {};
//         if (category && category !== "all") {
//             filter.category = category
//         }

//         if (subCategory && subCategory !== "all") {
//             filter.subCategory = subCategory
//         }
//         if (sizes && sizes !== "all") {
//             filter.sizes = sizes
//         }
//         if (minPrice && maxPrice) {
//             const min = parseFloat(minPrice)
//             const max = parseFloat(maxPrice)
//             if (!isNaN(min) && !isNaN(max)) {
//                 filter.price = { $gte: min, $lte: max }
//             }
//         }

//         const pageNum = parseInt(page) || 1;
//         const limitNum = parseInt(limit) || 10;
//         const skip = (pageNum - 1) * limitNum;

//         const totalProducts = await Products.countDocuments(filter)
//         const totalPages = Math.ceil(totalProducts / parseInt(limit))
//         const products = await Products.find(filter)
//             .skip(skip)
//             .limit(parseInt(limit))
//             .populate("author", "email")
//             .sort({ name: 1 })


//         res.status(200).send({ products, totalPages, totalProducts })
//     } catch (error) {
//         console.error("Error fetching Products", error)
//         res.status(500).send({ message: "Error fetching Products" })
//     }
// })

// Backend API - Fetch All Products
router.get("/", async (req, res) => {
    try {
        const { category, subCategory, sizes, minPrice, maxPrice, page = 1, limit = 10, sortBy = "name", sortOrder = "asc" } = req.query;

        let filter = {};
        if (category && category !== "all") filter.category = category;
        if (subCategory && subCategory !== "all") filter.subCategory = subCategory;
        if (sizes && sizes !== "all") filter.sizes = sizes;
        if (minPrice && maxPrice) {
            const min = parseFloat(minPrice);
            const max = parseFloat(maxPrice);
            if (!isNaN(min) && !isNaN(max)) {
                filter.price = { $gte: min, $lte: max };
            }
        }

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const skip = (pageNum - 1) * limitNum;

        const totalProducts = await Products.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limitNum);

        // ✅ Apply Sorting Based on Query Params
        const sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
        }

        const products = await Products.find(filter)
            .skip(skip)
            .limit(limitNum)
            .sort(sortOptions) // ✅ Ensure Sorting Here
            .populate("author", "email");

        res.status(200).send({ products, totalPages, totalProducts });
    } catch (error) {
        console.error("Error fetching Products", error);
        res.status(500).send({ message: "Error fetching Products" });
    }
});


// get single Product
router.get("/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Products.findById(productId).populate("author", "email username")
        if (!product) {
            return res.status(404).send({ message: "Product not found" })
        }
        const reviews = await Reviews.find({ productId }).populate("userId", "username email")
        res.status(200).send({ product, reviews })
    } catch (error) {
        console.error("Error fetching the Product", error)
        res.status(500).send({ message: "failed to fetch  the product" })
    }
})

//update a product
router.patch("/update-product/:id", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const productId = req.params.id
        const updatedProduct = await Products.findByIdAndUpdate(productId, { ...req.body }, { new: true })
        if (!updatedProduct) {
            return res.status(404).send({ message: "Product not found" })
        }
        res.status(200).send({
            message: "Product updated successfully",
            product: updatedProduct
        })

    } catch (error) {
        console.error("Error updating the Product", error)
        res.status(500).send({ message: "failed to update  the product" })
    }
})

//delete a product
router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id
        const deletedProduct = await Products.findByIdAndDelete(productId)

        if (!deletedProduct) {
            return res.status(404).send({ message: "Product not found" })
        }

        // delete reviews related to the product
        await Reviews.deleteMany({ productId: productId })
        res.status(200).send({
            message: "Porduct deleted successfully"
        })
    } catch (error) {

        console.error("Error deleting the Product", error)
        res.status(500).send({ message: "failed to deleting  the product" })
    }
})

// get related products
router.get("/related/:id", async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).send({ message: "Product ID is requried" })
        }
        const product = await Products.findById(id);
        if (!product) {
            return res.status(404).send({ message: "Product not found" })
        }

        const titleRegex = new RegExp(
            product.name.split(" ").filter((word) => word.length > 1).join("|"), "i"
        )
        const relatedProducts = await Products.find({
            _id: { $ne: id },
            $or: [
                { name: { $regex: titleRegex } },
                { category: product.category },
            ],
        })
        res.status(200).send(relatedProducts)
    } catch (error) {
        console.error("Error fetching the related Product", error)
        res.status(500).send({ message: "failed to fetch related  products" })
    }
})

module.exports = router
