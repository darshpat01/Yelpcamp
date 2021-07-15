const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash'); 
const session = require('express-session'); 
const methodOverride = require('method-override');
const ExpressError = require("./utils/ExpressError");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
require('dotenv/config');
const cors = require('cors');




// const catchAsync = require('./utils/catchAsync');


// const { campgroundSchema, reviewSchema } = require('./schemas.js');
// const Joi = require('joi'); 
// const Campground = require('./models/campground');

// const Review = require('./models/review');

const userRoutes = require('./routes/users'); 
const campgroundRoutes = require('./routes/campgrounds'); 
const reviewRoutes = require('./routes/reviews'); 



mongoose.connect(process.env.db_connection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.use(express.json());
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));



app.use(express.static(path.join(__dirname, 'public')));



const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false, 
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash());


app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 





app.use((req, res, next) =>{
    
    res.locals.currentUser = req.user; 
    res.locals.success = req.flash('success'); 
    res.locals.error = req.flash('error'); 
    next(); 
})


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes); 
app.use('/campgrounds/:id/reviews', reviewRoutes); 


app.get('/', (req, res) => {
    res.render('home');
})


app.all("*", (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})


//error catcher
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    if (!err.message) err.message = 'Oh no Somthing went wrong!';
    res.status(statusCode).render('error', { err });

})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})
