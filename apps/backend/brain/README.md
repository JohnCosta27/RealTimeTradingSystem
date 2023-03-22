# Brain service

The brain service is the most distant from the users. It deals purely with storing data into a Postgres database and making sure that users have valid inputs into their trades and various requests.

It communicates using RabbitMQ and is very much a pure "server", hence it does not ask the Hub any questions. It listens to the requests that the hub has and responds with the correct information.

The list of requests that are possible are listen in the `main.go` file under a big switch statement, these are used by the Hub to communicate with the Brain, think of them as API endpoints, but for internal systems.

One of the things the brain is responsible for is informing the Hub when some write to permanent storage invalidated cache. This is more appropriate here because we have more visibility over the data that is returned, and can abtract this logic from the Hub, which is already busy with serving user requests.
