if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const ejs = require('ejs');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const cookieParser = require('cookie-parser'); //save and access cookies
const session = require('express-session'); // For session management
const MongoStore = require('connect-mongo');
const flash = require('connect-flash'); // For flash messages
const passport = require('passport'); // For authentication
const LocalStrategy = require('passport-local').Strategy; // Local strategy for authentication
const User = require('./models/user'); // Assuming you have a User model defined in models/user.js

const listingsrouter = require('./routes/listing');
const reviewsrouter = require('./routes/reviews');
const userrouter = require('./routes/user');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method')); // For PUT and DELETE requests
app.use(express.json()); // For parsing application/json
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // For parsing cookies
app.engine('ejs', ejsMate); // Use ejsMate for layout support

// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const dbURL = process.env.ATLASDB_URL;
const secret = process.env.SECRET;

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

async function main(){
    await mongoose.connect(dbURL);
}


const store = MongoStore.create({ 
    mongoUrl: dbURL, 
    crypto: {
    secret:secret
    } ,
    touchAfter: 24*3600,
});

store.on("error",() => {
    console.log("ERROR in mongo session store",err);
})

const sessionOptions = {
    store: store,
    secret: secret, 
    resave: false,
    saveUninitialized: true,
    cookie: { 
        expires: Date.now() + 24 * 60 * 60 * 1000, // Cookie expires in 1 day
        httpOnly: true, // Helps prevent XSS attacks
        MaxAge: 24 * 60 * 60 * 1000 // Cookie max age in milliseconds
     }
  };

app.use(session(sessionOptions)); // Use session middleware
app.use(flash()); // Use flash middleware

app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Use passport session
passport.use(new LocalStrategy(User.authenticate())); // Use local strategy for authentication

passport.serializeUser(User.serializeUser()); // Serialize user
passport.deserializeUser(User.deserializeUser()); // Deserialize user

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user; // Make current user available in views
    next();
});



app.get('/', (req, res) => {
    res.render('home.ejs');
  });
  

app.use('/listings', listingsrouter);
app.use('/listings/:id/reviews', reviewsrouter);
app.use('/', userrouter);

// app.get('/demouser', async (req, res) => {
//     let demoUser = {
//         email: 'demoUser@gmail.com',
//         username : 'demoUser'
//     };
//     let registeduser = await User.register(demoUser,"helloWorld");
//     console.log(registeduser);
//     res.send(registeduser);
// });

app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong' } = err;
    // res.status(statusCode).send(message); 
    res.status(statusCode).render('error', { err });   
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
