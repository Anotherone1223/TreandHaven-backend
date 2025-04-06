const express = require('express');
const Order = require('./orderModel');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");
const { sendInvoiceEmail } = require('../Mail/InvoiceMail');


//create checkout session
router.post("/create-checkout-session", async (req, res) => {
    const { products } = req.body;

    try {
        const lineItems = products.map((product) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.name,
                    description: product.description || "",
                    images: [`http://localhost:5173/${product.image}`]
                },
                unit_amount: Math.round(product.price * 100),
            },
            quantity: product.quantity,
        }));
        // console.log(lineItems);



        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:5173/cancel",
        })
        // console.log(session);
        // console.log("✅ Checkout Session Created:", session);

        res.json({ id: session.id })
    } catch (error) {
        console.error("Error creating checkout session", error);
        res.status(500).send({ messgae: "Failed to create checkout session" })

    }
});

//confirm payment
// router.post("/confirm-payment", async (req, res) => {
//     const { session_id } = req.body;


//     // try {

//     //     const session = await stripe.checkout.sessions.retrieve(session_id, {
//     //         expand: ["line_items", "payment_intent"]
//     //     });

//     //     const paymentIntentId = session.payment_intent.id;
//     //     let order = await Order.findOne({ orderId: paymentIntentId });

//     //     if (!order) {
//     //         const lineItems = session.line_items.data.map((item) => ({
//     //             productId: item.price.product,
//     //             quantity: item.quantity
//     //         }));

//     //         const amount = session.amount_total / 100;
//     //         order = new Order({
//     //             orderId: paymentIntentId,
//     //             amount,
//     //             products: lineItems,
//     //             email: session.customer_details.email,
//     //             status: session.payment_intent.status === "succeeded" ? 'pending' : 'failed'
//     //         })
//     //     } else {
//     //         order.status = session.payment_intent.status === "succeeded" ? 'pending' : 'failed';
//     //     }
//     //     await order.save();
//     //     console.log(order);


//     //     // **Send Invoice Email if Payment is Successful**
//     //     if (order.status === "pending") {
//     //         sendInvoiceEmail(order);
//     //     }

//     //     res.json({ order })

//     // } catch (error) {
//     //     console.error("Error confirming payment", error);
//     //     res.status(500).send({ messgae: "Failed to confirm payment" })
//     // }

//     try {
//         const session = await stripe.checkout.sessions.retrieve(session_id, {
//             expand: ["line_items", "payment_intent"],
//         });

//         const paymentIntentId = session.payment_intent.id;
//         let order = await Order.findOne({ orderId: paymentIntentId });

//         if (!order) {
//             const lineItems = session.line_items.data.map((item) => ({
//                 productId: item.price?.product || "N/A",
//                 quantity: item.quantity || 0,
//             }));

//             const amount = (session.amount_total || 0) / 100; // Ensure amount is valid

//             order = new Order({
//                 orderId: paymentIntentId,
//                 amount,
//                 products: lineItems,
//                 email: session.customer_details.email,
//                 status: session.payment_intent.status === "succeeded" ? "pending" : "failed",
//             });

//             await order.save();

//             // **Send Invoice Email Only When Order is Created**
//             if (order.status === "pending") {
//                 // console.log("📧 Sending invoice email to:", order.email);
//                 await sendInvoiceEmail(order); // Using `await` to ensure no duplicate execution
//             }
//         } else if (order.status !== "pending") {
//             // If order already exists but status is not "pending", update status
//             order.status = session.payment_intent.status === "succeeded" ? "pending" : "failed";
//             await order.save();
//         }

//         res.json({ order });

//     } catch (error) {
//         console.error("Error confirming payment:", error);
//         res.status(500).send({ message: "Failed to confirm payment" });
//     }
// });

router.post("/confirm-payment", async (req, res) => {
    const { session_id } = req.body;


    try {
        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ["line_items.data.price.product", "payment_intent"],
        });
        // console.log("Session Data:", JSON.stringify(session, null, 2));

        const paymentIntentId = session.payment_intent.id;
        let order = await Order.findOne({ orderId: paymentIntentId });

        // ✅ Extract Full Product Details
        const lineItems = session.line_items.data.map((item) => {
            const product = item.price?.product;

            return {
                productId: product?.id || "N/A",
                name: item.description || product?.name || "Unknown Product",
                price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
                quantity: item.quantity || 0,
                image: product?.images?.[0] || "", // Get first image
                description: product?.description || "", // Get description
            };
        });

        // console.log("🛒 Extracted Line Items:", lineItems);


        if (!order) {

            const amount = (session.amount_total || 0) / 100; // Ensure valid amount

            order = new Order({
                orderId: paymentIntentId,
                amount,
                products: lineItems,
                email: session.customer_details.email,
                status: session.payment_intent.status === "succeeded" ? "pending" : "failed",
            });


            await order.save();
            console.log(order)
            // console.log("Order Product",products);


            // **Send Invoice Email Only When Order is Created**
            if (order.status === "pending") {
                const customerEmail = session.customer_details?.email || req.body.email;
                await sendInvoiceEmail({
                    email: customerEmail,  // Ensure email is sent
                    products: lineItems,     // ✅ Send the correct products array
                    totalAmount: lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                    orderId: order.orderId ,
                    mongoOrderId: order._id.toString()
                });
            }
        } else if (order.status !== "pending") {
            order.status = session.payment_intent.status === "succeeded" ? "pending" : "failed";
            await order.save();
        }

        res.json({ order });

    } catch (error) {
        console.error("Error confirming payment:", error);
        res.status(500).send({ message: "Failed to confirm payment" });
    }
});

// async function sendInvoiceEmail(order) {
//     try {
//         const transporter = nodemailer.createTransport({
//             host: "smtp.gmail.com",
//             // port: process.env.SMTP_PORT,
//             secure: true,
//             auth: {
//                 user: "ecommerce1mernstack@gmail.com",
//                 pass: "zzigmstvysshpjnn",
//             },
//         });


//         // console.log("📦 Order Products Data:", JSON.stringify(order.products, null, 2));
//         // const finalAmount = Number(totalAmount) || 0;

//         let itemsHTML = order.products.map((item, index) => {
//             const price = Number(item.price) || 0;
//             const quantity = Number(item.quantity) || 0;
//             const total = (price * quantity).toFixed(2); // Ensure it's a valid number

//             return `
//             <tr>
//                 <td>${index + 1}</td>
//                 <td>${item.name || "N/A"}</td>
//                 <td>${quantity}</td>
//                 <td>$${price.toFixed(2)}</td>
//                 <td>$${total}</td>
//             </tr>
//         `;
//         }).join('');

//         const emailContent = `
//         <h2>Order Placed Successfully!</h2>
//         <p>Your order details are below:</p>
//         <table border="1" cellpadding="5" cellspacing="0">
//             <tr>
//                 <th>#</th>
//                 <th>Item</th>
//                 <th>Quantity</th>
//                 <th>Price</th>
//                 <th>Total</th>
//             </tr>
//             ${itemsHTML}
//         </table>

//     `;

//         // Send email (use nodemailer or your email library)
//         await transporter.sendMail({
//             from: "ecommerce1mernstack@gmail.com",
//             to: order.email,
//             subject: "Order Confirmation",
//             html: emailContent,
//         });
//         // console.log("📧 Email Invoice Data:", mailOptions.html);

//         console.log("📧 Invoice email sent to:", order.email);
//     } catch (error) {
//         console.error("❌ Failed to send invoice email:", error);
//     }
// }

// get order by email address   


router.get("/:email", async (req, res) => {

    const email = req.params.email;
    if (!email) {
        return res.status(400).send({ message: "Email is required" });
    }

    try {
        const orders = await Order.find({ email: email });

        if (orders.length === 0 || !orders) {
            return res
                .status(400)
                .send({ orders: 0, message: "No orders found for this email" });
        }
        res.status(200).send({ orders });
    } catch (error) {
        console.error("Error fetching orders by email", error);
        res.status(500).send({ message: "Failed to fetch orders by email" });
    }

});


// get order by id
router.get("/order/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        res.status(200).send(order);
    } catch (error) {
        console.error("Error fetching orders by user id", error);
        res.status(500).send({ message: "Failed to fetch orders by user id" });
    }
});

// get all orders
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        if (orders.length === 0) {
            return res.status(404).send({ message: "No orders found", orders: [] });
        }

        res.status(200).send(orders);
    } catch (error) {
        console.error("Error fetching all orders", error);
        res.status(500).send({ message: "Failed to fetch all orders" });
    }
});


// update order status
router.patch('/update-order-status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
        return res.status(400).send({ message: "Status is required" });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            {
                status,
                updatedAt: new Date(),
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedOrder) {
            return res.status(404).send({ message: "Order not found" });
        }

        res.status(200).json({
            message: "Order status updated successfully",
            order: updatedOrder
        })

    } catch (error) {
        console.error("Error updating order status", error);
        res.status(500).send({ message: "Failed to update order status" });
    }
});


// delete order
router.delete('/delete-order/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).send({ message: "Order not found" });
        }
        res.status(200).json({
            message: "Order deleted successfully",
            order: deletedOrder
        })

    } catch (error) {
        console.error("Error deleting order", error);
        res.status(500).send({ message: "Failed to delete order" });
    }
})
module.exports = router;