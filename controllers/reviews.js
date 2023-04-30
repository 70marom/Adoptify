const Review = require('../models/review');

module.exports.index = async (req, res) => {
    const reviews = await Review.find({}).populate('owner');
    res.render('reviews', { reviews });
};

module.exports.newReview = async (req, res) => {
    const review = new Review(req.body.review);
    review.owner = req.user._id;
    await review.save();
    req.flash('success', 'Created a new review!');
    res.redirect('/reviews');
};

module.exports.deleteReview = async (req, res) => {
    await Review.findByIdAndDelete(req.params.id);
    res.redirect('/reviews');
};