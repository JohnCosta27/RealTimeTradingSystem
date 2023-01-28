# Log book - Individual Project (Advanced Web Development)

## 29/09/2022
First entry in the log book. This week I have taken the time to get organised, finalise my project idea and talk to my superviser about it. I finalised the list of features that I wanted to have in the final product. Also got a draft of my plan.

## 02/10/2022
Finish the draft of the plan, but does not yet include the bibliography. Still need to walk through the marking grid and tick all the boxes.

## 03/10/2022
Completed the bibliography for now. However the work is not complete.

## 05/10/2022
Added testing, how currency will work and core and optional features to the plan.

## 07/10/2022
Finished the plan, submitting it today.

## 11/10/2022
Started implementing the "hub" service, which is the first point of contact from the user.

## 12/10/2022
Beginning template for the frontend application with all the dependencies installed.

## 24/10/2022
- Setup docker file for the hub micro service and a docker compose file to allow for easy deployment and development.
- Created a diagram for the overall system architecture.

## 25/10/2022
Connected frontend to the backend using websocket connection. I am still a week behind on my plan so I will have to work very hard this week to get back on schedule.

## 31/10/2022
Added RabbitMQ docker image, and created a test connection between hub and rabbitmq, it works.

## 05/11/2022
Setup the SQL schemas for the required databases.

## 06/11/2022
Started work on the authentication system.

## 07/11/2022
Finished register method in auth system, with some very nice code.
I also finished the login method.
Also finished the refresh method for JWTs. Basically did the entire Auth system.

## 08/11/2022
Connected frontend to backend login and register methods, learn about state management in SolidJs.

## 23/11/2022
I have a shared types library now and RPC communication working between hub and brain and sending back to the client. Need to implement the rest of the routes.

## 26/11/2022
There was a bug in the backend code, where some memory was declared in a different thread, and therefore was never updating, fixed it by redeclaring this memory.

## 27/11/2022
Fixed a lot of stuff on the backend and did some refactoring so some dependencies are shared. Also started the transactions endpoint but decided that I would like to connect the assets to the frontend first.
Today is also my birthday.

## 29/11/2022
 - Model methods to get user assets, create and complete transaction. Various bug fixes and connected the frontend to view assets. Some things are very prototypy, so will need refactoring
 - Endpoints for the trading of assets are complete, now I need further testing.

## 29/11/2022
 - All the backend is fully dockerised and running in containers!

## 22/11/2022
Started interim report, completed a first draft of the structure and included a lot of my research.

## 23/11/2022
Adding sections about version control monorepos and git worktrees.

## 27/11/2022
Section about project management

## 30/11/2022
Finished the first draft of the report!

# 04/12/2022
Finished integration testing app, it tests the authentication system and most of the routes on the hub.

# 05/12/2022
Final draft of the interim report completed
## 02/12/2022
Integration testing setup.

--------------------------------------------------
Christmas and New year break.
Work was done but I did not log it in the book.
--------------------------------------------------

## 10/01/2023
JMeter testing plan for stress testing the backend APIs.

## 14/01/2023
Developer experience improvements, now we load .env variables and secrets from files instead of hard coding them, which will make deployment of the application a lot easier.

## 19/01/2023
- Had the meeting with Julien, he seems happy with my progress and gave me some pointers in testing the performance of the system.
- Added a redis server to store cache from the system. I haven't yet invalidated the various cached items, that's the next step.

## 23/01/2023
Very significant change with the way that events are handled with RabbitMQ. Previously I was going something pretty wrong, so now I readjusted this and it is working great! (Each service has its own queue, acting as an Inbox).

## 28/01/2023
Finished caching invalidation.
