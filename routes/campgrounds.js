const express = require('express'); 
const router = express.Router(); 
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const Campground = require('../models/campground');

const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const {storage} = require('../cloudinary');
const multer  = require('multer');
const upload = multer({ storage });
 




// router.get('/api', async (req, res) => {
//     const campgrounds = await Campground.find({});
//     res.json(campgrounds);
// })

router.route('/')
    .get(catchAsync(campgrounds.index))    
    // .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files);
        res.send('it worked!');
    })

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));



module.exports = router; 