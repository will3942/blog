How I got blacklisted by Uber (cab company)
28/11/2013
After attending a hackathon, I've since been blacklisted by Uber. My original account has been banned (I can't login), and it seems that any attempt to sign up with my name, albeit with a new debit card gets the account immediately banned. This is how I got blacklisted from ever hailing a cab with Uber again.

# Update
Uber have kindly reinstated my account.

# The Hackathon
I attended the [Hackference](http://hackference.co.uk) hackathon from August 31st to September 1st 2013 in Birmingham and built an app that reverse engineered Uber's private api to show the nearest cabs on a Pebble smartwatch and on the web on Google Maps in realtime (video [here](http://uber.will3942.com)). Our hack later won us first prize at this hackathon and won us two Nexus 7s. <img src="/nexus.jpg" height="500px" />

# How did I do it?
Passing all the traffic from my iPhone through a proxy on my Mac allowed me to see all the traffic, endpoints and data that was sent by the Uber app. I found that (at this point) a token was used that was created when you joined Uber, therefore I passed this to the endpoint, a Linux epoch (needs to be realtime), and the two coordinates "of where I am" to get the nearby cabs. My account appeared to zip across the world by using multiple locations in a city to get all the cabs in this city and repeating this process using ajax to get them updating in realtime.

# The traffic
As I left the hackathon, I thought I should probably throw what we made onto Hacker News, we got 9 upvotes and we had 50 people visiting the site simultaneously which sent out 12 requests every 1.2 seconds to Uber's servers, parsed them and then displayed them on Google Maps. So we were hitting their servers with roughly 600 requests every 1.2 seconds for a sustained period of about 2 hours.

# How did they find me?
I open sourced the project soon after it was created on [Github](http://github.com/will3942/uber-hack). They either found me from that (unlikely), from the web page (more likely) or just the traffic spike I probably caused to one of their servers (gotcha!).

# What can I do?
Nothing. I've tweeted them and sent them emails to their support contact, no response. I was a good customer, I spent a lot of money on Uber cabs and loved the service. My cards have been blacklisted and so has many name afaik. All that is left is for me to use Hailo (an alternative) or only use Uber when I'm with a friend, who'll use their account and I'll pay them in cash. I feel that my hack was more educational than harmful and I'd love to apologize to Uber and be able to use their service again, but on the other hand I understand why they banned me. Uber run a great service in many cities (quickly got me from JFK to Manhattan for a fixed rate) and I love them, that's why I created this hack.

You can check Uber out [here](http://uber.com) and if you want to contact me for any more information I'm available on twitter [@Will3942](http://twitter.com/will3942).
