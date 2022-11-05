CREATE TABLE users (
  id UUID PRIMARY KEY NOT NULL,
  balance FLOAT NOT NULL
);

CREATE TABLE assets (
  id UUID PRIMARY KEY NOT NULL,
  name VARCHAR(256)
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY NOT NULL,
  buyer UUID REFERENCES users(id) NOT NULL,
  seller UUID REFERENCES users(id) NOT NULL,
  price FLOAT NOT NULL,
  state VARCHAR(24),
  assetId UUID REFERENCES assets(id) NOT NULL
);

CREATE TABLE userAssets (
  userId UUID REFERENCES users(id) NOT NULL,
  assetId UUID REFERENCES assets(id) NOT NULL
);
