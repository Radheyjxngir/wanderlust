if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}


const express = require("express");




const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");
const { MONGO_URL } = require("./config/db.js");

// Routes import करो
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Session Options
const { MongoStore } = require('connect-mongo');

const store = new MongoStore({
    mongoUrl: MONGO_URL, // थारो MongoDB Atlas को URL
    crypto: {
        secret: process.env.SECRET, // .env में SECRET होना ज़रूरी है
    },
    touchAfter: 24 * 3600, // 24 घंटों के लिए
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash Messages Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// Demo User Route (Testing खातिर)
app.get("/demouser", async (req, res, next) => {
  try {
    let existingUser = await User.findOne({ username: "delta-student" });

    if (existingUser) {
      return res.json({
        message: "Demo user already exists",
        user: existingUser,
      });
    }

    let fakeUser = new User({
      email: "student@gmail.com",
      username: "delta-student",
    });

    let registeredUser = await User.register(fakeUser, "helloworld");
    res.json({
      message: "Demo user created",
      user: registeredUser,
    });
  } catch (err) {
    next(err);
  }
});

// Routes Use करो
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404 Error Handling
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Generic Error Handling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Port variable बणाओ
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`server is listening to port ${port}`);
});