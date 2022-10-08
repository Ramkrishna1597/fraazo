require("dotenv").config();
const express = require("express");
const stripe = require("stripe")("sk_test_51LqbftSB8LgT1BCuEKtkUaVGgd5vyvv0ggVkWg9wZydiSZf4LbT6eOmeJgSHmDMpJvZ7MJSJ9NMAkQ3WZZzTtEtN00ULuFdJV2")
const {
  register,
  login,
  generateToken,
} = require("./controllers/authController");
const User = require("./models/user.model");
const { body, validationResult } = require("express-validator");
var cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");

// const passport = require("./configs/googleOauth");

app.use(cors());
app.use(express.json());

const fraazoController = require("./controllers/fraazo.controller");

const paymentController = require("./controllers/payment.controller");

const userController = require("./controllers/user.controller");

app.use("/fraazo", fraazoController);
app.use("/user", userController);
app.use("/payment", paymentController);

app.post(
  "/register",
  body("firstName")
    .trim()
    .not()
    .isEmpty()
    .bail()
    .withMessage("First Name cannot be empty")
    // .isLength({ min: 4 })
    // .withMessage("First Name must be at least 4 characters"),
    .isLength({ min: 3 })
    .withMessage("First Name must be at least 4 characters"),
  body("email")
    .isEmail()
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: req.body.email });

      if (user) {
        throw new Error("Email is already taken");
      }
      return true;
    }),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    // .custom((value, { req }) => {
    //   if (value !== req.body.confirmPassword) {
    //     throw new Error("Password and confirm password should match");
    //   }
    //   return true;
  // })
  ,
  body("phone").custom((value) => {
    if (value && value.length != 10) {
      throw new Error("phone number should have 10 digits");
    }
    return true;
  }),
  register
);

app.post(
  "/login",
  body("email")
    .isEmail()
    .custom(async (value) => {
      const user = await User.findOne({ email: value });

      if (!user) {
        throw new Error("Email is not registered");
      }
      return true;
    }),
  body("password").not().isEmpty().withMessage("Password is required"),
  login
);

// API for PAYMENT

app.post("/payment/create", async (req, res) => {
  let total = req.body.amount;
  console.log("Payment Request recieved for this ruppess", total,typeof(total));

  total = Number(total);
const paymentIntent = await stripe.paymentIntents.create({
  amount: 100,
  currency: "inr",
  payment_method_types: ["card"],
});

  console.log(paymentIntent)

  res.status(201).send({clientSecret: paymentIntent.client_secret});
});



app.use("/", (req, res) => {
  res.send(
    `<h1 style="color:black;font-size:36px;margin:20px auto;">Welcome to Fraazo-Clone API</h1><br/> <a href="https://github.com/Ramkrishna1597/fraazo">Go to the Documentation.</a>`
  );
});

module.exports = app;