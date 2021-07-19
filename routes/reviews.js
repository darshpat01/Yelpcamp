const express = require('express'); 
const router = express.Router({mergeParams: true}); 
const app = express(); 
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require("../utils/ExpressError");
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware'); 
const reviews = require('../controllers/reviews')




router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));



router.delete('/:reviewId',isLoggedIn, isReviewAuthor,  catchAsync(reviews.deleteReview));

module.exports = router; 