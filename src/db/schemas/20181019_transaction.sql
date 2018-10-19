---------------------------------------------------------------------------------------------------
 -- Title: transaction
 -- Author: David Whynot
 -- Email: davidmwhynot@gmail.com
 -- Project: stripe_sandbox

 -- Created: 2018_10_19
 -- Updated: 2018_10_19

 -- VERSION --
 -- v1.0.0 --
---------------------------------------------------------------------------------------------------


-- transaction TABLE STRUCUTRE

create table if not exists transaction (
	transaction_id varchar(255) not null primary key,
	transaction_customer_id_f varchar(255) not null,
	transaction_product varchar(255) not null,
	transaction_currency varchar(255),
	transaction_amount int(64) not null,
	transaction_status varchar(255),
	transaction_created_at datetime default current_timestamp
);


-- transaction TEST DATA

insert into transaction (
	transaction_id,
	transaction_first_name,
	transaction_last_name,
	transaction_email
) values (
	'foo',
	'John',
	'Doe',
	'example@gmail.com'
);
