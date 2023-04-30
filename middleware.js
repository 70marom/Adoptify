const ExpressError = require('./utils/ExpressError');
const { animalSchema, reviewSchema } = require('./schemas');
const Animal = require('./models/animals');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.animalValidation = (req, res, next) => {
    const { error } = animalSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else next();
}

module.exports.reviewValidation = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const animal = await Animal.findById(id);
    if(!animal.owner.equals(req.user._id))
    {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/animals/${id}`);
    }
    next();
}

module.exports.isReviewOwner = async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    if(!review.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/reviews`);
    }
    next();
}