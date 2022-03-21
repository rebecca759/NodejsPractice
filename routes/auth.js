const { response } = require('express')
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
router.use(setUser)

const jwt = require('jsonwebtoken')

let user;

router.get('/',(req,res) => {
    res.send('Home Page')
})

const verifyAdmin = (req, res, next) => {
    console.log(req.user)
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        res.status(403).json("you are not allowed to do that")
    }
};

//admin only
router.get('/users', verifyAdmin, async (req,res) => {
    //Get users
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

//admin only
router.post('/users',async (req,res) => {
    let hashedPassword
    try {
        const salt = await bcrypt.genSalt()
        hashedPassword = await bcrypt.hash(req.body.password, salt)
    } catch (error) {
        res.status(500).json({message: err.message})
    }
    const user = new User({
        username: req.body.username,
        password: hashedPassword,
        role: req.body.role
    })
    try{
        const newUser = await user.save()
        res.status(201).json(newUser)
    }catch (err) {
        res.status(500).json({message: err.message})
    }
})

async function findUser(username, callback){
    await User.findOne({username: username}, function(err, userObj){
        if(err){
            return callback(err);
        } else if (userObj){
            return callback(null,userObj);
        } else {
            return callback();
        }
    });
}

router.post('/login', async (req,res) => {
    // console.log('eh')
    // authenticate user
    const user = req.user
    if (user == null) {
        console.log("user not found")
        return res.status(400).json({ message: 'Cannot find user'})
    }
    try {
        if (await bcrypt.compare(req.body.password,user.password)) {
            console.log('Success')
            jwt.sign({username:user.username}, process.env.ACCESS_TOKEN_SECRET)
            const accessToken = jwt.sign({username:user.username},process.env.ACCESS_TOKEN_SECRET)
            return res.status(200).json({ message: 'Success', accessToken: accessToken })
        } else { 
            return res.status(400).json({ message: 'Wrong credentials'})
        }
    } catch (error) {
        res.status(500).send()
    }

})

router.get('/dashboard', authUser, (req,res) => {
    res.send('Dashboard Page')
})

router.get('/admin', (req,res) => {
    res.send('Admin Page')
})

function authUser(req,res,next) {
    if (req.user == null) {
        res.status(403)
        return res.send('You need to sign in')
    }
}

async function setUser(req,res,next) {
    console.log('setting user',req.body)
    const username = req.body.username
    if (username) {
        let user;
        await findUser(req.body.username, function(error, userFound) {
            console.log(userFound)
            user = userFound;
        });
        req.user = user
    }
    next()
}

module.exports = router