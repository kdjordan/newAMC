const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
const app = express();
const router = require('./router');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

let sessionOptions = session({
    secret: "M1ghty Or3gon",
    store: new MongoStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true}
});

app.use(sessionOptions);
app.use(flash());

app.use(function(req, res, next) {

    //make all error and success mssgs available to all templates
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');

    //make user if available on request object 
    if(req.session.user) {
        req.visitorID = req.session.user._id;
    } else {
        req.visitorID = 0;
    }
    next()
});

app.use(express.static('public'));
app.set('views', 'views');
app.set('view engine', 'ejs');


app.use('/', router);


module.exports = app;


