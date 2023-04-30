const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, animalValidation, isOwner } = require('../middleware');
const animals = require('../controllers/animals');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(wrapAsync(animals.index))
    .post(isLoggedIn, upload.array('image'), animalValidation, wrapAsync(animals.createAnimal))

router.get('/new', isLoggedIn, animals.newForm)

router.route('/:id')
    .get(wrapAsync(animals.showAnimal))
    .put(isLoggedIn, isOwner, upload.array('image'), animalValidation, wrapAsync(animals.editAnimal))
    .delete(isLoggedIn, isOwner, wrapAsync(animals.deleteAnimal))

router.route('/:id/edit').get(isLoggedIn, isOwner, wrapAsync(animals.editForm))

module.exports = router;