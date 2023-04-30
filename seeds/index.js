require('dotenv').config();
const mongoose = require('mongoose');
const Animal = require('../models/animals');
const { cities, names } = require('./seedHelpers');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

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
        const randLocation = randElement(cities).name + ', Israel';
        const geoData = await geocoder.forwardGeocode({
          query: randLocation,
          limit: 1
        }).send();
        await new Animal({
            name: randName,
            age: Math.floor(Math.random() * 15),
            location: randLocation,
            geometry: geoData.body.features[0].geometry,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed ipsum massa. Curabitur tellus neque, maximus vel pharetra in, lacinia et magna. Proin convallis tincidunt nibh, sed feugiat tortor sagittis sed.',
            owner: '64494fa1be1c2ac10e765729',
            images: [
                {
                  url: 'https://res.cloudinary.com/dinay3obb/image/upload/v1682710889/Adoptify/w4kksbv7fqwoheluokn3.jpg',
                  filename: 'Adoptify/w4kksbv7fqwoheluokn3',
                },
                {
                  url: 'https://res.cloudinary.com/dinay3obb/image/upload/v1682710889/Adoptify/zefvepiv7en6ptw6avws.jpg',
                  filename: 'Adoptify/zefvepiv7en6ptw6avws',
                }
              ]
        }).save()
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})
