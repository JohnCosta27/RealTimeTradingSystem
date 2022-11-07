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
	id uuid DEFAULT gen_random_uuid() PRIMARY KEY NULL,
  firstname VARCHAR(256) NOT NULL,
  surname VARCHAR(256) NOT NULL,
  password VARCHAR(512) NOT NULL,
  password_salt VARCHAR(512) NOT NULL,
  created_at DATE NOT NULL,
  updated_at DATE NOT NULL,
  deleted_at DATE
);

CREATE TABLE user_session_logs (
	id uuid DEFAULT gen_random_uuid() PRIMARY key NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  type VARCHAR(24) NOT NULL,
  created_at DATE NOT NULL,
  updated_at DATE NOT NULL,
  deleted_at DATE
);
