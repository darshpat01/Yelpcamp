const express = require('express'); 
const path = require('path'); 
const mongoose = require('mongoose'); 
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require("./utils/ExpressError"); 
const {campgroundSchema} = require('./schemas.js'); 
// const Joi = require('joi'); 
const Campground = require('./models/campground'); 
const methodOverride = require('method-override'); 

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
}); 

const db = mongoose.connection; 
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () =>{
    console.log("Database connected"); 
}); 

const app = express(); 

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate)
app.use(express.urlencoded({extended: true})); 
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) =>{

    //server side validation   
    const {error} = campgroundSchema.validate(req.body); 
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,'400'); 
    }else{
        next(); 
    }
}

app.get('/', (req, res) => {
    res.render('home'); 
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({}); 
    res.render('campgrounds/index',{campgrounds}); 
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new'); 
})

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {campground}); 
}))

app.post('/campgrounds', validateCampground, catchAsync(async (req, res,next) =>{
            
            const campground = new Campground(req.body.campground); 
            await campground.save(); 
            res.redirect(`/campgrounds/${campground._id}`);  
}))

app.get('/campgrounds/:id/edit', async(req, res) =>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {campground});
})

app.put('/campgrounds/:id', validateCampground, catchAsync(async(req, res) => {
    const{ id } = req.params; 
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}); 
    res.redirect(`/campgrounds/${campground._id}`); 
}))

app.delete('/campgrounds/:id', catchAsync(async(req, res) => {
    const{ id } = req.params;
    await Campground.findByIdAndDelete(id); 
    res.redirect('/campgrounds'); 
}))

app.all("*",(req, res, next) =>{
    next(new ExpressError('Page not found', 404))
})

 
//error catcher
app.use((err,req,res,next) => {
    const {statusCode = 500, message='Something went wrong'} = err;
    if(!err.message) err.message = 'Oh no Somthing went wrong!'; 
    res.status(statusCode).render('error',{err}); 
    
})

app.listen(3000, () => {
    console.log('Serving on port 3000'); 
})
