const express = require('express');
const User = require('../users/userModel');
const Order = require('../orders/orderModel');
const Reviews = require('../reviews/reviewsModel');
const Products = require('../products/productModel');
const router = express.Router();

//user stats by email

router.get('/user-stats/:email', async (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).send({ message: "Email is requried" });
    }

    try {
        const user = await User.findOne({ email: email })
        // console.log(user);

        if (!user) return res.status(404).send({ message: 'User not found' });

        // sum of all order 

        const totalPaymentsResult = await Order.aggregate([
            { $match: { email: email, status: "completed" } },
            {
                $group: { _id: null, totalAmount: { $sum: "$amount" } }
            }
        ])

        const totalPaymentsAmmount = totalPaymentsResult.length > 0 ? totalPaymentsResult[0].totalAmount : 0

        console.log(totalPaymentsAmmount);


        // get total review 
        const totalReviews = await Reviews.countDocuments({ userId: user._id })

        // total purchased products
        const purchasedProductIds = await Order.distinct("products.productId", { email: email });
        const totalPurchasedProducts = purchasedProductIds.length;


        res.status(200).send({
            totalPayments: totalPaymentsAmmount.toFixed(2),
            totalReviews,
            totalPurchasedProducts
        });

    } catch (error) {
        console.error("Error Fetching User Status", error);
        res.status(500).send({ message: 'Failed to fetch user stats' });
    }

})

// admin status

router.get('/admin-stats', async (req, res) => {
    try {
        // Count total orders
        const totalOrders = await Order.countDocuments();

        // Count total products
        const totalProducts = await Products.countDocuments();

        // Count total reviews
        const totalReviews = await Reviews.countDocuments();

        // Count total users
        const totalUsers = await User.countDocuments();


        // Calculate total earnings by summing the 'amount' of all orders
        const totalEarningsResult = await Order.aggregate([
            {
                $match: { status: "completed" } // Only include completed orders
            },
            {

                $group: {
                    _id: null,
                    totalEarnings: { $sum: "$amount" },
                },

            },
        ]);

        const totalEarnings = totalEarningsResult.length > 0 ? totalEarningsResult[0].totalEarnings : 0;

        // Calculate monthly earnings by summing the 'amount' of all orders grouped by month
        const monthlyEarningsResult = await Order.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    monthlyEarnings: { $sum: "$amount" },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
            }
        ]);

        // Format the monthly earnings data for easier consumption on the frontend
        const monthlyEarnings = monthlyEarningsResult.map((entry) => ({
            month: entry._id.month,
            year: entry._id.year,
            earnings: entry.monthlyEarnings,
        }));

        // Send the aggregated data
        res.status(200).json({
            totalOrders,
            totalProducts,
            totalReviews,
            totalUsers,
            totalEarnings, // Include total earnings
            monthlyEarnings, // Include monthly earnings
        });

    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Failed to fetch admin stats" });
    }
})

module.exports = router;