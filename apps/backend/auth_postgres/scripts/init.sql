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

INSERT INTO users VALUES ('f2e6a94f-b50b-4b7d-9c32-f444104715ba', 'johncosta027@gmail.com', 'John', 'Costa', '8e0eaa40b46a74f68b75ed68716ae11cdbae260a78419cbe9b2f412018695e6f02b9d4980c1a4014fe7864b75d92551eab4effae2035e74230a1dff06b744a67', '');
