const Animal = require('../models/animals');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');
const categories = ['Dog', 'Cat', 'Fish', 'Rodent', 'Bird', 'Other'];

module.exports.index = async (req, res) => {
    const animals = await Animal.find({});
    res.render('animals/index', { animals });
};

module.exports.newForm = (req, res) => {
    res.render('animals/new', { categories });
};

module.exports.createAnimal = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.animal.location,
        limit: 1
    }).send();
    const newAnimal = new Animal(req.body.animal);
    newAnimal.geometry = geoData.body.features[0].geometry;
    newAnimal.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newAnimal.owner = req.user._id;
    await newAnimal.save();
    req.flash('success', 'Your animal is ready for adoption!');
    res.redirect(`/animals/${newAnimal._id}`);
};

module.exports.showAnimal = async (req, res) => {
    const animal = await Animal.findById(req.params.id).populate('owner');
    if(!animal) {
        req.flash('error', 'Could not find the animal you are looking for!');
        return res.redirect('/animals');
    }
    res.render('animals/show', { animal });
};

module.exports.editForm = async (req, res) => {
    const animal = await Animal.findById(req.params.id);
    if(!animal) {
        req.flash('error', 'Could not find the animal you are looking for!');
        return res.redirect('/animals');
    }
    res.render('animals/edit', { animal, categories });
};

module.exports.editAnimal = async (req, res) => {
    const { id } = req.params;
    const geoData = await geocoder.forwardGeocode({
        query: req.body.animal.location,
        limit: 1
    }).send();
    const animal = await Animal.findByIdAndUpdate(id, req.body.animal, { runValidators: true });
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    animal.images.push(...images);
    animal.geometry = geoData.body.features[0].geometry;
    await animal.save();
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages)
            await cloudinary.uploader.destroy(filename);
        await animal.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } }})
    }
    req.flash('success', 'Successfully edited your animal!');
    res.redirect(`/animals/${id}`);
};

module.exports.deleteAnimal = async (req, res) => {
    const { id } = req.params;
    await Animal.findByIdAndDelete(id);
    req.flash('success', 'Deleted your animal! We hope it found a lovely home!');
    res.redirect(`/animals`);
};