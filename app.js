const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require('./schemas.js');
// const Joi = require('joi'); 
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const Review = require('./models/review');


const campgrounds = require('./routes/campgrounds'); 
const reviews = require('./routes/reviews'); 


// const seeds = require('./seeds/index');
//  password = darshanp123
mongoose.connect('mongodb+srv://darshan:darshan12345@cluster0.6r0ou.mongodb.net/yelp-camp?retryWrites=true&w=majority', {
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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use('/campgrounds', campgrounds); 
app.use('/campgrounds/:id/reviews', reviews); 

app.use(express.static(path.join(__dirname, 'public')));

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
