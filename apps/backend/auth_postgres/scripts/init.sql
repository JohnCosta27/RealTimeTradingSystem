/*
 * Users table in auth system stores personal information,
 * It is not meant to be perfectly linked with the users table,
 * in the brain service.
 */
CREATE TABLE users (
	id uuid PRIMARY KEY NULL,
  firstname VARCHAR(256) NOT NULL,
  surname VARCHAR(256) NOT NULL,
  password VARCHAR(512) NOT NULL,
  password_salt VARCHAR(512) NOT NULL
);

CREATE TABLE userSessionLogs (
	id uuid PRIMARY key NOT NULL,
  userID UUID REFERENCES users(id) NOT NULL,
  date date NOT NULL,
  type VARCHAR(24) NOT NULL
);
