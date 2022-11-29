## Dockerfiles

Some of the dockerfiles are in the root of the backend project and some others are not. The reason is because my services use shared libraries (shared-types and utils), in order to follow the DRY principle (Don't repeat yourself).

However, other services such as the postgres datases, redis cache and rabbitmq services, do have such a requirement, and therefore are kept in their own seperate folders.
