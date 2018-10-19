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
const util = require('util');

const Customer = require('../db/models/Customer');
const Transaction = require('../db/models/Transaction');




/* XXX CONFIG XXX */
require('dotenv').config();
const STRIPE_PUBLIC = process.env.STRIPESANDBOX_STRIPE_PUBLIC;
const STRIPE_SECRET = process.env.STRIPESANDBOX_STRIPE_SECRET;

const stripe = require('stripe')(STRIPE_SECRET);




/* XXX ROUTES XXX */
let router = express.Router();
// get homepage
router.get('/', (req, res) => {
	log('GET request received for /...');
  res.render('index', {
		pubKey: STRIPE_PUBLIC,
		pageScript: `<script src="/js/charge.js"></script>`
	});
});

// get customers
router.get('/customers', (req, res) => {
	log('GET request received for /customers...');
	Customer.getCustomers((err, customers) => {
		if(err) {
			req.flash('error_msg', `Error fetching customers: ${err}`)
			res.redirect('/');
		} else {
			res.render('customers', {
				customers: customers
			});
		}
	});
});

// get transactions
router.get('/transactions', (req, res) => {
	log('GET request received for /transactions...');
	Transaction.getTransactions((err, transactions) => {
		if(err) {
			req.flash('error_msg', `Error fetching transactions: ${err}`)
			res.redirect('/');
		} else {
			res.render('transactions', {
				transactions: transactions
			});
		}
	});
});


// post charge
router.post('/charge', (req, res) => {
	log('POST request received for /charge...');
	stripe.customers.create({
		email: req.body.email,
		source: req.body.stripeToken
	})
		.then((customer) => {
			return stripe.charges.create({
				amount: 5000,
				currency: 'usd',
				description: 'Intro to React Course',
				receipt_email: req.body.email,
				customer: customer.id
			});
		})
		.then((charge) => {
			if(charge) {
				Customer.addCustomer({
					id: charge.source.customer,
					firstName: req.body.first_name,
					lastName: req.body.last_name,
					email: req.body.email
				},
				(err) => {
					if(err) {
						req.flash('error_msg', `Error: ${err}`);
						res.redirect('/');
					} else {
						Transaction.addTransaction({
							id: charge.id,
							customerId: charge.customer, // TODO: replace stripe foreign keys with internal foreign keys
							product: charge.description,
							currency: charge.currency,
							amount: charge.amount,
							status: charge.status
						},
						(err) => {
							if(err) {
								req.flash('error_msg', `Error: ${err}`);
								res.redirect('/');
							} else {
								res.render('success', {
									tid: charge.id,
									product: charge.description
								});
							}
						});
					}
				});
			} else {
				req.flash('error_msg', `Error creating charge...`);
				res.redirect('/');
			}
		}).catch(err => log(err));
});



/* XXX FUNCTIONS XXX */
function log(s) {
	if(typeof s === 'object') {
		console.log(util.inspect(s, false, null, true /* enable colors */));
	} else {
		console.log(s);
	}
}




/* XXX EXPORTS XXX */
module.exports = router;
