How I analyzed twitter archives to show user's likes & dislikes
9th December 2013
Twitter archives are very interesting things, they provide (in my opinion) a much easier way to look through your tweets than using twitter search. Twitter provides your tweets in an easy-to-use JSON format (even with an index JSON file to tell is which files are which (sorted by year + month)), not only this but twitter provides a *fucking* ton of metadata. 

## What did I build?

I built 1) a [class][1] to parse twitter archives and return opinions for a defined number of topics (this includes a custom sentiment analysis engine) and 2) a [web app][2] to display these opinions in a *nice* format. 

## What does it analyze

By default the class analyzes the following topics: Weather, Football, Soccer, Rugby, Hockey, Cricket, Mac OS X, Windows, Linux, Google, Microsoft, Apple, Starbucks, Wendy's, Pret a Manger, Dunkin' Donuts, Costa Coffee, Coffee, iPhone, Android, Blackberry.

## How does it do it?

After the user downloads their twitter archive from [twitter][3] they upload it to the web app, the web app then unzips this and stores the folder in a temporary directory. The directory is then validated and then passed to the class before it is destroyed (no data is retained). 

The class, [*tanalyzer.rb*][1] reads the *tweet_index.js* file in the extracted twitter archive which contains a list of files containing the tweets. A bunch of hashes are then created to store various data and then each file is parsed one by one, initially the user's info is retrieved and then we start incrementing the number of tweets, retweets and hashtagged tweets depending on whether the tweet contains any of these types and also checks if any user's have been mentioned, if they have then a count is incremented for each of these users (so we can see the top mentioned users). 

After incrementing the counts the class then starts doing sentiment analysis, it passes the tweet, a list of topics, a list of prohibited words and a list of good words to our sentiment analysis function. This function first splits the tweet into an array of words, checks if the words array contains a topic, if it does then we do sentiment analysis; this is where it gets more complex! 

The sentiment analysis function tries to implement basic english sentence structure and adjective placement using case (switch) statements. It then increments a *good* count if a good adjective/sentence is found or increments a *bad* count if a bad adjective/sentence is found. If at the end of this method both counts are 0 then it checks if any prohibited words or good words are in the sentence and increments the counts respectively, if some are still not found then it is taken as a neutral sentiment. 

After we've found the sentiment of the tweet, we then check if it has any location data, if it does then we reverse geolocate the coordinates and find the country and city. 

## What data do we get?

After all the analysis has done, the class returns a JSON object of the percentage good and bad sentiment for each of the topics (+ respective good and bad counts) and also the top cities tweeted from, top countries, top mentioned users and the tweet types. 

All of this is open sourced on Github [here][4] and you can try the web app out at [twitter.will3942.com][2] . If you want to contact me about this I'm available on twitter [@Will3942][5].

 [1]: https://github.com/will3942/tanalyzer/blob/master/tanalyzer.rb
 [2]: http://twitter.will3942.com
 [3]: http://twitter.com/settings/account
 [4]: https://github.com/will3942/tanalyzer
 [5]: http://twitter.com/will3942