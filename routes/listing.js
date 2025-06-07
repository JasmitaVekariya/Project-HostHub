const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { IsLoggedIn, isOwner, validateListing } = require('../middleware');
const listingController = require('../controllers/listing'); // contains all Listing logic
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })


// // Index
// router.get('/', wrapAsync(listingController.index));

// // New
// router.get('/new', IsLoggedIn, listingController.renderNewForm);

// // Create
// router.post('/', IsLoggedIn, validateListing, wrapAsync(listingController.createListing));

// // Edit
// router.get('/:id/edit', IsLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// // Update
// router.put('/:id', IsLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// // Show
// router.get('/:id', wrapAsync(listingController.showListing));

// // Delete
// router.delete('/:id', IsLoggedIn, isOwner, wrapAsync(listingController.deleteListing));



//using router.route
// Index & Create
router.route('/')
  .get(wrapAsync(listingController.index))                          // Show all listings
  .post(IsLoggedIn, upload.single('listing[image]') , validateListing, wrapAsync(listingController.createListing)); // Create listing
  

// New Listing Form
router.get('/new', IsLoggedIn, listingController.renderNewForm);

// Show, Update, Delete
router.route('/:id')
  .get(wrapAsync(listingController.showListing))                    // Show single listing
  .put(IsLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing)) // Update
  .delete(IsLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); // Delete

// Edit Form
router.get('/:id/edit', IsLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router;