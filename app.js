/*

	title: app.js
	desc: Entry point for node server application
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: stripe_sandbox
	Created: 10/19/18
	Updated: 10/19/18

*/


/* XXX IMPORTS XXX */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const hbars = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// routers
const index = require(path.join(__dirname, 'src', 'routes', 'index.js'));




/* XXX CONFIG XXX */
require('dotenv').config();
const PORT = process.env.STRIPESANDBOX_PORT || 3000;
const SESSION_SECRET = process.env.STRIPESANDBOX_SESSION_SECRET || 'secret';




/* XXX INIT XXX */
const app = express();




/* XXX MIDDLEWARE XXX */
// view engine
app.set('views', path.join(__dirname, 'src', 'views'));
app.engine('handlebars', hbars({
	defaultLayout: 'layout',
	layoutsDir: path.join(__dirname, 'src', 'views', 'layouts')
}));
app.set('view engine', 'handlebars');

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// cookie parser
app.use(cookieParser());

// json
app.use(express.json());

// session
app.use(session({
	secret: SESSION_SECRET,
	saveUninitialized: true,
	resave: true
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash());

// set static folder
app.use(express.static(path.join(__dirname, 'dist', 'pub')));




/* XXX GLOBAL VARS XXX */
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.acct = req.user || null;
  next();
});




/* XXX ROUTES XXX */
app.use('/', index);




/* XXX SERVER XXX */
app.listen(PORT, () => {
	log(`Starting stripe_sandbox on port: ${PORT}`);
});




/* XXX FUNCTIONS XXX */
function log(s) {
	console.log(s);
}
