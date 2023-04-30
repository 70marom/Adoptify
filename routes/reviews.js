const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { reviewValidation, isLoggedIn, isReviewOwner } = require('../middleware');
const reviews = require('../controllers/reviews')

router.route('/')
    .get(wrapAsync(reviews.index))
    .post(reviewValidation, isLoggedIn, wrapAsync(reviews.newReview))

router.delete('/:id', isLoggedIn, isReviewOwner, wrapAsync(reviews.deleteReview))

module.exports = router;