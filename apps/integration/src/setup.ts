import crypto from 'crypto';
import { PrismaClient as AuthPrismaClient} from './generated/auth';
import { PrismaClient as BrainPrismaClient } from './generated/brain';


export default async function() {
  const authClient = new AuthPrismaClient();
  const brainClient = new BrainPrismaClient();

  // Delete all users before tests run.
  // And all other user information in both auth and brain services.
  await authClient.users.deleteMany({});
  await brainClient.user_assets.deleteMany({});
  await brainClient.transactions.deleteMany({});
  await brainClient.assets.deleteMany({});
  await brainClient.users.deleteMany({});

  console.log("Purged databases successfully");

  const uuid = crypto.randomUUID();
  const otherUuid = crypto.randomUUID();

  const hash = crypto.createHash('sha512');
  const userPassword = hash.update('password', 'utf8');

  const otherHash = crypto.createHash('sha512');
  const otherUserPassword = otherHash.update('password', 'utf8');

  await authClient.users.create({
    data: {
      id: uuid,
      firstname: "Testing1",
      surname: "User",
      email: "testing1@user.com",
      password_salt: "",
      password: userPassword.digest('hex'),
    }
  });

  await authClient.users.create({
    data: {
      id: otherUuid,
      firstname: "Testing2",
      surname: "User",
      email: "testing2@user.com",
      password_salt: "",
      password: otherUserPassword.digest('hex'),
    }
  });

  await brainClient.users.create({
    data: {
      id: uuid,
      balance: 10000,
    }
  });

  await brainClient.users.create({
    data: {
      id: otherUuid,
      balance: 10000,
    }
  });

  const gold = await brainClient.assets.create({
    data: {
      name: "Gold",
    }
  });

  await brainClient.user_assets.create({
    data: {
      asset_id: gold.id,
      user_id: uuid,
      amount: 10,
    }
  });

  const trade = await brainClient.transactions.create({
    data: {
      seller_id: uuid,
      amount: 10,
      price: 1000,
      asset_id: gold.id,
      state: 'in-market',
    }
  });
  console.log(trade);

  console.log("Created test data");
};
