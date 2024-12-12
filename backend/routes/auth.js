const express = require('express');
const crypto = require('crypto');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { collections } = require('../database/database');
function AuthRouter(database) {
    var router = express.Router();

    // Session Middleware Setup
    router.use(
        session({
            secret: '6KStenGQgjCf',
            resave: false,
            saveUninitialized: false
        })
    );

    // Passport Authentication Setup
    router.use(passport.initialize());
    router.use(passport.session());

    // User Data Middleware
    router.use((req, res, next) => {
        if(req.user) {
            res.locals.user = req.user;
            console.log("user in local",res.locals.user)
        }
        next();
    });

    // Local Strategy Setup
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            console.log("Request Body:", { email, password });
    
            // Find user by email in the database
            const user = await collections.users.findOne({ email });
            // console.log("users",users)

            if (!user ) {
                console.log("Login failed: Incorrect email or password");
                return done(null, false, { message: 'Incorrect email or password' });
            }
           
            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
                if (err) {
                    callback(err);
                    return;
                }
                if (user.password !== hashedPassword.toString('hex')) {
                    return done(null, false, { message: 'Incorrect email or password' });
                }
               
            });
    
            console.log("Logged in user:", user);
            return done(null, user);
        } catch (error) {
            console.error("Error during login:", error);
            return done(error);
        }
    }));
    
    passport.serializeUser(function(user, callback) {
        console.log("Serializing user:", user); // Log the user object before serialization
        return callback(null, user);
    });
    
    
    passport.deserializeUser(function(user, callback) {
        return callback(null, user);
    });

    // Routes for Register and Login
    router.get('/register', (req, res) => {
        res.render('auth/register', {errorMessage: null});
    });
    
    router.get('/login', (req, res) => {
        res.render('auth/login', {errorMessage: null});
    });

    router.post('/register', upload.single('profileImage'), async (req, res) => {
        let data = req.body;
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = await new Promise((resolve, _) => {
          crypto.pbkdf2(data.password, salt, 310000, 32,'sha256', (_, hashedPassword) => {
            resolve(hashedPassword);
          });
        });
      
        let profileImage = req.file ? req.file.path : '../uploads/avatar-placeholder.jpg';
      
        let user = await database.collections.users.insertOne({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: hashedPassword.toString('hex'),
          profileImage: profileImage,
          salt: salt
        });
      
        await new Promise((resolve, _) => {
          req.login({
            _id: user.insertedId.toString(),
            email: data.email,
            firstName:data.firstName,
            lastName:data.lastName,
            profileImage: profileImage,
          }, () => {
            resolve();
          });
        });
      
        res.redirect('/');
    });
      
    router.post('/login', (req, res, next) => {
        console.log("Request Body:", req.body);
        passport.authenticate('local', (error, user, info) => {
            if (error) {
                return next(error);
            }
            if (!user) {
                console.log("Login failed:", info.message);
                return res.render('auth/login', { errorMessage: 'Incorrect email or password' });
            }
            console.log("user infoooooo",user)
            req.logIn(user, function(error) {
                if (error) {
                    return next(error);
                }
                console.log("Logged in user:", req.user); 
                
                return res.redirect('/');
            });
        })(req, res, next);
    });

    // Logout Route
    router.get('/logout', (req, res, next) => {
        req.logout(function(error) {
            if (error) {
                next(error);
                return;
            }
            res.redirect('/');
        });
    });

    return router;
}

module.exports = AuthRouter;
