/*

	title: index.js
	desc: Handler for requests to the / route
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: stripe_sandbox
	Created: 10/19/18
	Updated: 10/19/18

*/


/* XXX IMPORTS XXX */
const express = require('express');




/* XXX ROUTES XXX */
let router = express.Router();
// get homepage
router.get('/', (req, res) => {
	log('GET request received for /...');
  res.render('index');
});




/* XXX FUNCTIONS XXX */
function log(s) {
	console.log(s);
}




/* XXX EXPORTS XXX */
module.exports = router;
