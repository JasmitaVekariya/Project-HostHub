const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Index - Show all listings or filter by category
module.exports.index = async (req, res) => {
    const { category } = req.query;

    let listings;
    if (category) {
        listings = await Listing.find({ category: category.toLowerCase() });
    } else {
        listings = await Listing.find({});
    }

    res.render('listings/index', { listings });
};

// Show form to create a new listing
module.exports.renderNewForm = (req, res) => {
    res.render('listings/new');
};

// Create a new listing
module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    let url = req.file.path;
    let filename = req.file.filename;

    const { title, description, image, price, location, country, category } = req.body.listing;

    const newListing = new Listing({
        title,
        description,
        image: { url, filename },
        price,
        location,
        country,
        category, // add this
        owner: req.user._id,
        geometry: {
            type: "Point",
            coordinates: response.body.features[0].geometry.coordinates
        }
    });

    console.log(newListing); // This should now include geometry
    await newListing.save();

    req.flash('success', 'Listing created successfully!');
    res.redirect('/listings');
};

// Show a specific listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('owner');

    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }

    res.render('listings/show', { listing });
};

// Show edit form
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");

    res.render('listings/edit', { listing , originalImageUrl});
};

// Update existing listing
module.exports.updateListing = async (req, res) => {
    
    const { id } = req.params;
    const { title, description, image, price, location, country, category } = req.body.listing;

    const updatedListing = await Listing.findByIdAndUpdate(
        id,
        {
            title,
            description,
            price,
            location,
            country,
            category 
        },
        { new: true }
    );

    if(typeof req.file !== "undefined")
    {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url,filename};
        await updatedListing.save();
    }

    if (!updatedListing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }

    req.flash('success', 'Listing updated successfully!');
    res.redirect(`/listings/${id}`);
};

// Delete listing
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }

    req.flash('success', 'Listing deleted successfully!');
    res.redirect('/listings');
};