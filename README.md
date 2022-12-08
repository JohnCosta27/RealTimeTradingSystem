# Final Year Project - Real time Trading Platform

A platform that allows multiple users to buy and sell resources, in real time. Call it a stock exchange if you will.

## Technologies

### Backend
- Golang
- Docker

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
```
cd apps/frontend
pnpm install
pnpm run dev
```

### Backend
```
cd apps/backend
docker-compose up --build //The flag is optional but ensures the containers are re-built.
```

### Integration Testing
Integration testing must be done whilst the backend services are running, so you must perform the stage above and only after run this. Will make this process nicer in the future.
```
cd apps/integration
npm install
npm run test //Can also do npm run test:watch
```
