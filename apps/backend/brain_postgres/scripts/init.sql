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
  buyer_id UUID REFERENCES users(id),
  seller_id UUID REFERENCES users(id),
  price FLOAT NOT NULL,
  amount FLOAT NOT NULL,
  state VARCHAR(24),
  asset_id UUID REFERENCES assets(id) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE TABLE user_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  amount FLOAT NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  asset_id UUID REFERENCES assets(id) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

INSERT INTO users VALUES ('f2e6a94f-b50b-4b7d-9c32-f444104715ba', 2000);
INSERT INTO assets VALUES ('f2e6a94f-b50b-4b7d-9c32-f444104715bb', 'Test Asset #1');
INSERT INTO user_assets (user_id, asset_id, amount) VALUES ('f2e6a94f-b50b-4b7d-9c32-f444104715ba', 'f2e6a94f-b50b-4b7d-9c32-f444104715bb', 10);
