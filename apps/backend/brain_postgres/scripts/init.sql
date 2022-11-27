CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  balance FLOAT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  name VARCHAR(256),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  buyer UUID REFERENCES users(id),
  seller UUID REFERENCES users(id),
  price FLOAT NOT NULL,
  state VARCHAR(24),
  assetId UUID REFERENCES assets(id) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE TABLE userAssets (
  userId UUID REFERENCES users(id) NOT NULL,
  assetId UUID REFERENCES assets(id) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);
