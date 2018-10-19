/*

	title: Customer.js
	desc: Database model for a customer
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: stripe_sandbox
	Created: 10/19/18
	Updated: 10/19/18

*/


/* XXX IMPORTS XXX */
const mysql = require('mysql');




/* XXX CONFIG XXX */
require('dotenv').config();
const OPTS = {
	host: process.env.STRIPESANDBOX_HOST,
	user: process.env.STRIPESANDBOX_DB_USER,
	password: process.env.STRIPESANDBOX_DB_PASSWORD,
	database: process.env.STRIPESANDBOX_DB_DATABASE
};




/* XXX EXPORTS XXX */
module.exports = {
	/* XXX FUNCTIONS XXX */
	addCustomer: (newCustomer, callback) => {
		mysql.createConnection(OPTS).query(
			'INSERT INTO customer (customer_id, customer_first_name, customer_last_name, customer_email) VALUES (?, ?, ?, ?)',
			[newCustomer.id, newCustomer.firstName, newCustomer.lastName, newCustomer.email],
			(err, res) => {
				if(err) {
					callback(err);
				} else {
					callback(null);
				}
			}
		);
	},
	getCustomers: (callback) => {
		mysql.createConnection(OPTS).query(
			'SELECT * FROM customer ORDER BY customer_created_at DESC',
			(err, res) => {
				if(err) {
					callback(err, null);
				} else {
					callback(null, res);
				}
			}
		);
	}
}
