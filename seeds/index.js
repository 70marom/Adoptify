require('dotenv').config();
const mongoose = require('mongoose');
const Animal = require('../models/animals');
const { cities, names } = require('./seedHelpers');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const categories = ['Dog', 'Cat', 'Fish', 'Rodent', 'Bird', 'Other'];
const genders = ['Male', 'Female'];

mongoose.connect('mongodb://127.0.0.1:27017/adoptify');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const randElement = arr => arr[Math.floor(Math.random() * arr.length)]

const seedDB = async () => {
    await Animal.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const randName = randElement(names);
        const randCategory = randElement(categories);
        const randGen = randElement(genders);
        const randLocation = randElement(cities).name + ', Israel';
        const geoData = await geocoder.forwardGeocode({
          query: randLocation,
          limit: 1
        }).send();
        await new Animal({
            name: randName,
            category: randCategory,
            age: Math.floor(Math.random() * 15),
            ageType: 'Years',
            gender: randGen,
            location: randLocation,
            geometry: geoData.body.features[0].geometry,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed ipsum massa. Curabitur tellus neque, maximus vel pharetra in, lacinia et magna. Proin convallis tincidunt nibh, sed feugiat tortor sagittis sed.',
            owner: '64494fa1be1c2ac10e765729',
            images: [
                {
                  url: 'https://res.cloudinary.com/dinay3obb/image/upload/v1684846415/Adoptify/catEx_obkbgt.jpg',
                  filename: 'Adoptify/catEx_obkbgt',
                },
                {
                  url: 'https://res.cloudinary.com/dinay3obb/image/upload/v1684846415/Adoptify/dogEx_izazgy.jpg',
                  filename: 'Adoptify/dogEx_izazgy',
                }
              ]
        }).save()
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})
