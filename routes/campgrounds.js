const express = require('express'); 
const router = express.Router(); 
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const Campground = require('../models/campground');

const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
 

router.get('/', catchAsync(campgrounds.index));


router.get('/api', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.json(campgrounds);
})


router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.get('/:id', catchAsync(campgrounds.showCampground)); 

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground'); 
    res.redirect('/campgrounds');
}))

module.exports = router; 