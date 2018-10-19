---------------------------------------------------------------------------------------------------
 -- Title: customer
 -- Author: David Whynot
 -- Email: davidmwhynot@gmail.com
 -- Project: stripe_sandbox

 -- Created: 2018_10_19
 -- Updated: 2018_10_19

 -- VERSION --
 -- v1.0.0 --
---------------------------------------------------------------------------------------------------


-- customer TABLE STRUCUTRE

create table if not exists customer (
	customer_id varchar(255) not null primary key,
	customer_first_name varchar(255) not null,
	customer_last_name varchar(255) not null,
	customer_email varchar(255) not null,
	customer_created_at datetime default current_timestamp()
);


-- customer TEST DATA

insert into customer (
	customer_id,
	customer_first_name,
	customer_last_name,
	customer_email
) values (
	'foo',
	'John',
	'Doe',
	'example@gmail.com'
);
