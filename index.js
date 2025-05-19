const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')
const app = express()
require('dotenv').config()
// const bcrypt = require('bcrypt') 
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const port = process.env.PORT || 5000



// middleware setup
app.use(express.json({ limit: "25mb" }))
// app.use((express.urlencoded({ limit: "25mb" }))) 
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}))


app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});





// image upload
const uploadImage = require("./src/utils/uploadImage")

// All Routes
const authRoutes = require('./src/users/userRoutes')
const productRoutes = require('./src/products/productsRoute')
const reviewRoutes = require('./src/reviews/reviewsRouter')
const orderRoutes = require('./src/orders/orderRoute')
const statsRoutes = require('./src/stats/statsRoute')



app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/stats', statsRoutes)

app.get('/', (req, res) => {
        res.send('Hello World!')
    })

main().then(() => console.log("Mongodb is connected")).catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.DB_URL);
}

app.post("/uploadImage", (req, res) => {
    uploadImage(req.body.image)
        .then((url) => res.send(url))
        .catch((err) => res.status(500).send(err));
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})







//"start:dev":"nodemon index.js"



// const express = require('express')
// const mongoose = require('mongoose');
// const cors = require('cors')
// const app = express()
// require('dotenv').config()
// // const bcrypt = require('bcrypt') 
// const cookieParser = require('cookie-parser')
// const bodyParser = require('body-parser')

// const port = process.env.PORT || 5000


// const dotenv = require('dotenv');
// const http = require('http');
// const { Server } = require('socket.io');

// dotenv.config();


// // Create HTTP server
// const server = http.createServer(app);

// const io = new Server(server, {
//     cors: {
//         origin: ['http://localhost:5173','http://192.168.0.104:5173'], // frontend URL
//         methods: ['GET', 'POST'],
//         credentials: true,
//     },  
// });



// io.on('connection', (socket) => {
//     console.log('Socket connected:', socket.id);
  
//     socket.on('joinOrderRoom', (orderId) => {
//       socket.join(orderId);
//     });
  
//     socket.on('locationUpdate', ({ orderId, coords }) => {
//       socket.to(orderId).emit('locationUpdate', { coords });
//     });
  
//     socket.on('leaveOrderRoom', (orderId) => {
//       socket.leave(orderId);
//     });
  
//     socket.on('disconnect', () => {
//       console.log('Socket disconnected:', socket.id);
//     });
//   });

  


// // middleware setup
// app.use(express.json({ limit: "25mb" }))
// // app.use((express.urlencoded({ limit: "25mb" }))) 
// app.use(cookieParser())
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(cors({
//     origin: ['http://localhost:5173'],
//     methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization"]
// }))


// app.use((req, res, next) => {
//     res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
//     res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
//     next();
// });





// // image upload
// const uploadImage = require("./src/utils/uploadImage")

// // All Routes
// const authRoutes = require('./src/users/userRoutes')
// const productRoutes = require('./src/products/productsRoute')
// const reviewRoutes = require('./src/reviews/reviewsRouter')
// const orderRoutes = require('./src/orders/orderRoute')
// const statsRoutes = require('./src/stats/statsRoute')



// app.use('/api/auth', authRoutes)
// app.use('/api/products', productRoutes)
// app.use('/api/reviews', reviewRoutes)
// app.use('/api/orders', orderRoutes)
// app.use('/api/stats', statsRoutes)



// main().then(() => console.log("Mongodb is connected")).catch(err => console.log(err));

// async function main() {
//     await mongoose.connect(process.env.DB_URL);

//     app.get('/', (req, res) => {
//         res.send('Hello World!')
//     })

//     // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
// }

// app.post("/uploadImage", (req, res) => {
//     uploadImage(req.body.image)
//         .then((url) => res.send(url))
//         .catch((err) => res.status(500).send(err));
// })


// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })

// // server.listen(port, () => {
// //     console.log(`Server running on port ${port}`);
// //   });






// //"start:dev":"nodemon index.js"