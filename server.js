require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require("express-session");
const SECRET_SESSION = process.env.SECRET_SESSION;
const passport = require("./config/ppConfig");
const flash = require("connect-flash");

// require authorization middleware at top of page
const isLoggedIn = require("./middleware/isLoggedIn");

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

//secret: what we are giving back to the user to use our site / session cookie
//resave: save the session even if it's modified, make this false
//saveUninitialized: if its a new session, we'll save it, therefore setting this to true

app.use(session({
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}))

//initialize passport and run session as middleware
app.use(passport.initialize());
app.use(passport.session());
//flash for temporary messages to the user
app.use(flash());

//middleware to have our messages accessible to every view
app.use((req, res, next)=>{
  //before every route we will attach our current user to res.local
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
})

app.get('/', (req, res) => {
  //res.locals.alerts = req.flash();
  res.render('index', {alerts: res.locals.alerts });
  //console.log(res.locals.alerts)
  //req.flash();
});

app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

app.use('/auth', require('./routes/auth'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${port} 🎧`);
});

module.exports = server;
