const express = require("express");
const { UserModel } = require("../models/user.model")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.get("/", async(req,res)=>{
    try {
        let user = await UserModel.find();
        res.send(user);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

userRouter.post("/register", async (req, res) => {
    const { email, password, name, age } = req.body

    try {
        bcrypt.hash(password, 5, async (err, secure_pwd) => {
            if (err) {
                console.log(err);
            } else {
                const user = new UserModel({ email, password: secure_pwd, name, age });
                await user.save()

                let userData = await UserModel.find();
                res.send(userData);
            }
        })

    } catch (error) {
        console.log(error);
        res.send("Error in registering");
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.find({ email })
        let hashed_pwd = user[0].password
        // const user = await UserModel.find({ email: email, pwd: pwd })
        if (user.length > 0) {
            bcrypt.compare(password, hashed_pwd, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userID:user[0]._id }, process.env.key, {expiresIn:'2h'})
                    res.send({ "msg": "Login Successful", "token": token });
                } else {
                    res.send("Wrong credentials");
                }
            })
        } else {
            res.send("Wrong credentials");
        }
    } catch (error) {
        console.log(error)
        res.send("Error in login in")
    }
})

module.exports = { userRouter }