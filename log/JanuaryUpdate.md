# January Update

During the holiday period and the new year period, my projects front facing element (The advanced web interface), is near completion. It provides the user with a simple way to buy/sell assets and view their historical prices. There are few more nice to have feature which I would like to add, such as a Profile page, but these are not urgent and I didn't mention them as important in my Plan.

To get these backend features to work, I also finalised the core endpoints of the Hub and the corresponding database lookups in the Brian service. What is not completed yet is the caching element of the project, which could prevent the brain from doing lookups from storage everytime there is a request. The web interface does actually cache from HTTP requests, instead of re-request everytime, but this is only a client side optimisation and would not work at scale.

In the coming weeks, I have planned to the following:
- Backend caching, using Redis, to save on the amount of inter-service communication needed.
- BOTs to trade between themselves, directly with the backend services. This will stress test my system.
- Nice to have frontend features. (Better error messages, notifications, etc...).

I have finalised all the core features, and I am happy with the stability and performance of my system. I am at a good stage at this time, and going forward will finalise making my system fully able to scale, and testing that it can do just that.
