const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

const animalSchema = new Schema({
    category: {
        type: String,
        enum: ['Dog', 'Cat', 'Fish', 'Rodent', 'Bird', 'Other']
    },
    name: String,
    age: Number,
    ageType: {
        type: String,
        enum: ['Months', 'Years']   
    },
    gender: {
        type: String,
        enum: ['Male', 'Female']    
    },
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [imageSchema],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    toJSON : { virtuals: true }
});

animalSchema.virtual('properties.popUp').get(function() {
    return `
    <strong><a href="/animals/${this._id}">${this.name}</a></strong>
    <p>Age: ${this.age}</p>`
});

module.exports = mongoose.model('Animal', animalSchema);