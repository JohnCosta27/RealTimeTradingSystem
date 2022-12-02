import { PrismaClient as AuthPrismaClient} from './generated/auth';
import { PrismaClient as BrainPrismaClient } from './generated/brain';

const authClient = new AuthPrismaClient();
const brainClient = new BrainPrismaClient();

export { brainClient, authClient };
