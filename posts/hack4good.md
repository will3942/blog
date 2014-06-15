Geeklist's hack4good London hackathon
7th October 2013
From Friday 4th October 2013 until Sunday 6th October 2013, I attended [hack4good][1]. Hack4good is a global hackathon run by Geeklist and operating in 20 countries worldwide, it attracted around 1000 attendees who got together to hack together a product to make the world better. Charities were able to suggest their own challenges which you could help build with them or, as I did, you could think up your own and hack it together over the weekend.

## Presentation or code?

When I attended my first hackathon, I thought it would be all about the code and the presentation wouldn't matter; I couldn't have been more wrong. Code doesn't matter at hackathons. At hackathons, it's not about the code, it's about whether it works and how good your presentation is. At all the hackathons I've been to, the judges haven't understood the code or only had a basic knowledge of programming; they care about the product and the presentation. Because of this you can only win on your presentation, and this is why you should set aside at least some time to make sure you know what you are going over. Always record a demo video of the product, because it won't work. If you create a hack that is either a mobile-app or on a separate device then record a video of it, because when you hold it up to the audience, 90% of the audience can't see it!

## Should you go to a hackathon to win

No. Hackathons are not about winning, they're about learning new ideas and meeting new people. For hack4good it was definitely not about winning, it was about making an impact on the world.

## What did we make

In the ~48 hours we were there me and Josh created MobileRescue, a small device that intercepted WiFi probe requests sent out for nearby devices and uploaded it to a server, to then be accessed and parsed by a mobile application (iOS). [<img src="/mobilerescue_device.jpeg" alt="Device" height="500px" />][2] We thought this would be useful in avalanches, collapsed buildings and earthquakes; this is because when one of these situations happens, it's most likely that nowadays people would have mobile phones on them. When you connect to a WiFi network and set it to "join automatically", it will probe frequently for that network, to see if it's nearby. When a mobile device probes for a network it will also send the signal strength in decibels, this was key in implementing our idea. Using a formula we were able to convert these decibels into the distance from our device in metres.

A device will also send out a probe request for every network it has set to automatically join, so we made sure that we only scanned for devices that would probe multiple networks, since they would more likely be a device that is on the move (such as a phone or tablet) rather than a printer or desktop PC. What we would also implement in the future would be to parse the MAC addresses and filter products that would be stationary, e.g EPSON printers, we would do this by matching the first 3 octets of the MAC address (which identifies the manufacturer of the device) to that of a manufacturer we don't want to scan for. Once we had calculated the distance, we linked this up with the MAC address of the device and displayed it on a radar as shown below. [<img src="/mobilerescue_radar.png" alt="Radar" height="250px" />][3]

## We won!

MobileRescue won first place at hack4good London, [was talked about on Sky News][4] and has been entered into the hack4good global judging. If you want to contact me then I'm available on twitter [@Will3942][5]. 

## Update

We won the global hackathon too and had a great trip to Dublin for WebSummit!

 [1]: http://hack4good.io
 [2]: /mobilerescue_device.jpeg
 [3]: /mobilerescue_radar.png
 [4]: http://uk.news.yahoo.com/video/hack-good-world-hackers-unite-090405127.html
 [5]: http://twitter.com/will3942