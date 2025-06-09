const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: String,
        url: {
            type: String,
            default: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg',
            set: (v) => v === '' ? 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg' : v
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews : [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    owner : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry : {
        type : {
            type : String,
            enum : ['Point'],
            require: true
        },
        coordinates: {
            type : [ Number ],
            require: true
        }
    },
    category: {
        type: String,
        enum : ["trending","rooms","mountain","castles","Amazing pools","camping","farm","arctic"]
    }

});

const Listing = mongoose.model('listing', listingSchema);

const Review = require('./review.js');

listingSchema.post('findOneAndDelete', async (listing) => {
    if(listing)
        await Review.deleteMany({_id: {$in: listing.reviews}});
});

module.exports = Listing;