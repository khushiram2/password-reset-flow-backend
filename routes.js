import express from "express"
import bcrypt from "bcrypt"
import { insertNewUser, checkIfEmailAlreadyExists, checkIfPasswordMatch, getUserById, getUserByEmail, enterPasswordVerifyToken, deleteTokenAfterVerification, setnewpassword } from "./databaseQueries.js"
import { generateToken } from "./Autntoken.js"
import jwt from "jsonwebtoken";
import { secretkey } from "./Autntoken.js";
import { sendMail } from "./helperFunctions.js";

const router = express.Router()


router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body.registerData
        const ifExist = await checkIfEmailAlreadyExists(email)
        if (ifExist) {
            res.send("email already exists")
        } else {
            const pass = await bcrypt.hash(password, 10)
            const user = await insertNewUser(name, email, pass)
            res.send(user)
        }

    } catch (err) {
        res.status(501).send("cannot register user")
        console.log(err)
    }

})




router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body.loginData
        const passmatch = await checkIfPasswordMatch(email, password)
        const { id, pass } = passmatch
        if (pass) {
            const token = await generateToken(id)
            res.status(200).send(token)
        } else {
            res.status(404).send("invalid credentials")
        }

    } catch (err) {
        res.status(500).send("couldn't log in ")
    }

})


router.get("/authuser", async (req, res) => {
    try {
        const token = req.headers.authorization
        const verify = jwt.verify(token, secretkey)
        const user = await getUserById(verify._id)
        if (user) {
            res.status(200).send({ user: user, message: "login sucessful" })
        } else {
            res.status(404).send({ message: "user not found" })
        }

    } catch (err) {
        res.status(500).send({ message: "invalid Token", err: err })
    }

})


router.post(`/pasword/resetlink`, async (req, res) => {
    try {
        const { email } = req.body
        const ifExist = await checkIfEmailAlreadyExists(email)
        if (ifExist === true) {
            const user = await getUserByEmail(email)
            const token = await generateToken(user._id)
            await enterPasswordVerifyToken(user._id,token)
            await sendMail(user._id,email,token,res)
            res.status(200).send({ message: "link sent" })
        } else {
            res.status(203).send({ message: "user does not exists" })
        }
    } catch (error) {
        res.status(500).send({ message: "some error occured" })
    }

})


router.get(`/resetpassword/auth/:id/:token`,async (req,res)=>{
    try {
        const {id,token}=req.params
        const user = await getUserById(id)
        if(token===user.passwordVerifyToken){
            res.status(200).send("user valid")
           await deleteTokenAfterVerification(id)
        }else{
            res.status(203).send("user invalid")
        }
    } catch (error) {
        res.status(500).send("some error occured while validating the user")
    }
})

router.put(`/setnewpassword/:id`, async (req,res)=>{
    try {
        const {id}=req.params
       const password =req.body.password.password
        const pass = await bcrypt.hash(password, 10)
        await setnewpassword(id,pass)
        res.status(200).send("password updated sucessfully")
    } catch (error) {
        res.status(500).send("some error occured while changing password")
    }
})


export const userRouter = router

