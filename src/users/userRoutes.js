const express = require('express');
const User = require('./userModel');
const generateToken = require('../middleware/generateToken');
// const verifyToken = require('../middleware/verifyToken');
const router = express.Router()
const jwt = require('jsonwebtoken');
const { sendThankYouEmail } = require('../Mail/sentThankYouMail');


// Register Endpoint
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ username, email, password });
        await user.save()

        // Send Thank You Email
        sendThankYouEmail(email, username);

        res.status(201).send({ message: "User Register Successfully" })
        console.log(req.body);
    } catch (error) {
        console.error("Error registering", error);
        res.status(500).send({ message: "Error registering" })
    }
})

//login user endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).send({ message: "User Not Found" })
        }
        const isMatch = await user.comparePassword(password);
        console.log(isMatch);

        if (!isMatch) {
            return res.status(401).send({ message: "Password Not Match" })
        }

        const token = await generateToken(user._id)


        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })

        res.status(200).send({
            message: "logged in successfully", token,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                profileImage: user.profileImage,
                bio: user.bio,
                profession: user.profession,
                location: user.location
            }
        })
    } catch (error) {
        console.error("Error Logged in user", error);
        res.status(500).send({ message: "Error logged in user" })
    }
})

// Google Register Endpoint
router.post('/google-register', async (req, res) => {
    try {
        const { credential } = req.body;
        const decodedUser = jwt.decode(credential);

        if (!decodedUser) {
            return res.status(400).send({ message: "Invalid Google Token" });
        }

        let user = await User.findOne({ email: decodedUser.email });
        if (user) {
            return res.status(400).send({ message: "User already registered. Please login." });
        }

        user = new User({
            username: decodedUser.name,
            email: decodedUser.email,
            profileImage: decodedUser.picture,
            role: 'user'
        });

        await user.save();
        const token = generateToken(user._id);


        // ✅ Send Thank You Email after successful registration
        await sendThankYouEmail(user.email, user.username);

        res.status(201).send({
            message: "Google Registration Successful",
            token,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error("Error with Google Registration", error);
        res.status(500).send({ message: "Google Registration Failed" });
    }
});


// Google Login Endpoint
router.post('/google-login', async (req, res) => {
    try {
        const { credential } = req.body;
        const decodedUser = jwt.decode(credential);

        if (!decodedUser) {
            return res.status(400).send({ message: "Invalid Google Token" });
        }

        const user = await User.findOne({ email: decodedUser.email });
        if (!user) {
            return res.status(404).send({ message: "User not found. Please register first." });
        }

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        res.status(200).send({
            message: "Google Login Successful",
            token,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                profileImage: user.profileImage,
                bio: user.bio,
                profession: user.profession,
                location: user.location
            }
        });
    } catch (error) {
        console.error("Error with Google Login", error);
        res.status(500).send({ message: "Google Login Failed" });
    }
});


//logout endpoint
router.post('/logout', (req, res) => {
    res.clearCookie('token')
    res.status(200).send({ message: "Logged Out successfully" })
})

//delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).send({ message: "User Not Found" })
        }
        res.status(200).send({ message: "User Delete Successfully" })

    } catch (error) {
        console.error("Error Deleting", error);
        res.status(500).send({ message: "Error Deleting" })
    }
})


// get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'id email role').sort({ createdAt: -1 })
        res.status(200).send(users)
    } catch (error) {
        console.error("Error Fetching Users", error);
        res.status(500).send({ message: "Error Fetching Users" })
    }
})

// update user role

router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { role } = req.body
        const user = await User.findByIdAndUpdate(id, { role }, { new: true })
        if (!user) {
            return res.status(404).send({ message: 'User Not Found' })
        }
        res.status(200).send({ message: "User Role Update Successfully", user })

    } catch (error) {
        console.error("Error updating Users role", error);
        res.status(500).send({ message: "Error updating Users role" })
    }
})

//edit or update user profile
router.patch('/edit-profile', async (req, res) => {
    try {
        const { userId, username, profileImage, bio, profession, location } = req.body
        if (!userId) {
            return res.status(404).send({ message: 'User Id is Requried' })

        }
        const user = await User.findById(userId)
        console.log(user);

        if (!user) {
            return res.status(404).send({ message: 'User is Not Found' })
        }

        // update profile
        if (username !== undefined) user.username = username
        if (profileImage !== undefined) user.profileImage = profileImage
        if (bio !== undefined) user.bio = bio
        if (profession !== undefined) user.profession = profession
        if (location !== undefined) user.location = location





        await user.save();
        res.status(200).send({
            message: "Profile updated successfilly",
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                profileImage: user.profileImage,
                bio: user.bio,
                profession: user.profession,
                location: user.location

            }
        })

    } catch (error) {
        console.error("Error updating Users Profile", error);
        res.status(500).send({ message: "Error updating Users Profile" })
    }
})

module.exports = router