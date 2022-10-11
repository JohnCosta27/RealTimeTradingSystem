# Hub

The hub is the first point of contact for the frontend application, it is what contains web socket connections to various clients. It does not handle any sort of persistent storage, this is very much an intentional decision because the __hub__ service is likely to be the heaviest trafficked. It does interact with a __Redis__ datastore for caching purposes so it doesn't constantly need to make requests to other services.
