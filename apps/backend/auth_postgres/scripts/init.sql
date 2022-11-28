/*
 * Users table in auth system stores personal information,
 * It is not meant to be perfectly linked with the users table,
 * in the brain service.
 * 
 * These scripts will destroy data, so they have to be ran with big care!
 */
DROP TABLE IF EXISTS user_session_logs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
	id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  email VARCHAR(256) NOT NULL UNIQUE,
  firstname VARCHAR(256) NOT NULL,
  surname VARCHAR(256) NOT NULL,
  password VARCHAR(512) NOT NULL,
  password_salt VARCHAR(512) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE TABLE user_session_logs (
	id uuid DEFAULT gen_random_uuid() PRIMARY key NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  type VARCHAR(24) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

INSERT INTO users VALUES ('f2e6a94f-b50b-4b7d-9c32-f444104715ba', 'johncosta027@gmail.com', 'John', 'Costa', 'SafePassword123.', '60f892852ffb8e2f9d8da41db12e0ed52ebe93df069c1465decab320864c3ad42f9ae390294837bbcb10d642f43edac9e6edcca338170323bb7adf4c916844fb');
