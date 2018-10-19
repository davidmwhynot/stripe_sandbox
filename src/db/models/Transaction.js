/*

	title: Transaction.js
	desc: Database model for a transaction
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
	addTransaction: (newTransaction, callback) => {
		mysql.createConnection(OPTS).query(
			'INSERT INTO transaction (transaction_id, transaction_customer_id_f, transaction_product, transaction_currency, transaction_amount, transaction_status) VALUES (?, ?, ?, ?, ?, ?)', // TODO: in schema, switch transaction_product to transaction_product_id_f and add a new schema for a products table. also add transaction_stripe_id_f for the stripe id and change primary key to auto-increment integer
			[newTransaction.id, newTransaction.customerId, newTransaction.product, newTransaction.currency, newTransaction.amount, newTransaction.status],
			(err, res) => {
				if(err) {
					callback(err);
				} else {
					callback(null);
				}
			}
		);
	},
	getTransactions: (callback) => {
		mysql.createConnection(OPTS).query(
			'SELECT * FROM transaction ORDER BY transaction_created_at DESC',
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
