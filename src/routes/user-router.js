import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const userRouter = express();

userRouter.post("/", async (req, res) => {
    try {
        const {name, lastName, dni, email, userName, password} = req.body;

        const user = new User({name, lastName, dni, email, userName, password});
        await user.save();

        res.status(201).send({status: "success", payload: user});
    } catch (error) {
        res.status(500).send({status: "error", message: error.message});
    }
});

userRouter.post("/validate", async (req, res) => {
    try {
        const {userName, password} = req.body;

        const validateUserName = await User.findOne({userName});

        if(validateUserName === null ) return res.status(500).send({status: "error", message: error.message});

        const validatePassword = await bcrypt.compare(password, validateUserName.password);

        res.status(200).send({status: "success", payload: validatePassword});
    } catch (error) {
        res.status(500).send({status: "error", message: error.message});
    }
});

export default userRouter;