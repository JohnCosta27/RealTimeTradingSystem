# Final Year Project - Real time Trading Platform

A platform that allows multiple users to buy and sell resources, in real time. Call it a stock exchange if you will.

## Dependencies
- Nodejs version 18 or above
- Pnpm (I used version 8, but I believe most are fine).
- Golang (Used 1.20)
- Docker and Docker Compose

## Technologies

### Backend
- Golang
- Docker
- RabbitMQ
- Postgres
- Redis

### Frontend
- SolidJS (known for its speed)

## Dependencies
There are a few dependencies in the project so, there are some requirements:
- Nodejs (Tested on V16 and V19): This is to run the frontend dev server.
- Docker engine (Tested on Arch Linux and Ubuntu): Runs the backend.
- Golang: For developing the backend.
- Pnpm: Improved NPM. (Package manager for the frontend).

## Running the project
### Frontend
To run the frontend you will also need an .env file, which has already been filled out in the `.env.example` file, you can just rename this file to `.env`.

```
cd apps/frontend
pnpm install
pnpm run dev
```

### E2E Testing
I have used Cypress for end to end testing, which creates a browser and attempts to use to create trades and use the website in a black box kind of way, to mimic a real user, to use it:
```
cd apps/frontend
pnpx cypress install
```

### Backend
```
cd apps/backend
docker-compose up --build //The flag is optional but ensures the containers are re-built.
```

There are also various useful scripts you might want. All in the apps/backend folder.
- CleanDb.bash -> Requires sudo to run and deletes the data of your local databases. 
- HubAndBrain.bash -> Runs the hub and brain services as simple processes (without docker), useful for development.
- NoHub.bash -> Runs the docker compose file but without the hub, which you can run individually. Again, useful for development.

Sometimes you might also want to run the docker images without the hub and brain, for development, which you can do with the following command.
```
docker-compose -f no-brain-hub.yml up --build //Again, the flag is optional if you want to rebuild the containers.
```

### Integration Testing
Integration testing must be done whilst the backend services are running, so you must perform the stage above and only after run this. Will make this process nicer in the future.

You will also need a `.env` file, which you need to create in the integration testing folder. There is an example `.env.example` file, for convinient, you can just rename this file to `.env` and it will work, as it is prefilled with localhost information.
```
cd apps/integration
npm install
npm run prisma:gen // Generates the required type files for the Prisma ORM.
npm run test // Can also do npm run test:watch
```

Note: The integration tests completely wipes your database to get accurate testing results, so you might need to run `CleanDb.bash`, to get the test users back.

## Extra information

There is a README.md in each backend service (Auth, Hub and Brain), where you can find out more about each service.
