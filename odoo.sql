create database odoo;
use odoo;

select * from users;
ALTER TABLE users
ADD COLUMN profile_image_url VARCHAR(500) NULL;