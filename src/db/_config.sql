--------------------------------------------------------------------------------
 -- Title: config
 -- Author: David Whynot

 -- Created: 2018_06_14
 -- Updated: 2018_06_16

 -- VERSION --
 -- v1.0.1 --
--------------------------------------------------------------------------------
-- Must be run as root.
-- Sanitizes a mysql installation. Should be coupled with additional security
-- measures as described in the following digitalocean article:
-- https://www.digitalocean.com/community/tutorials/how-to-secure-mysql-and-mariadb-databases-in-a-linux-vps
--------------------------------------------------------------------------------


-- config db

show databases;

drop database if exists {{{DATABASE}}};
create database if not exists {{{DATABASE}}};
use {{{DATABASE}}};

-- create tables
-- INJECT TABLES --
-- ENDINJECT --

show tables;
show databases;

select user, host from mysql.user;

drop user if exists '{{{USER}}}'@'{{{HOST}}}';
flush privileges;
create user '{{{USER}}}'@'{{{HOST}}}' identified by '{{{PASSWORD}}}';

grant SELECT, UPDATE, DELETE, INSERT on {{{DATABASE}}}.* to '{{{USER}}}'@'{{{HOST}}}';

flush privileges;

select user, host from mysql.user;
