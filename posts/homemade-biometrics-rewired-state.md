Coding a biometrics system using photoresistors
12/03/2014
I attended Rewired State&#39;s National Hack The Government from 8th to 9th March 2014. The vibe was awesome and there were lots of other great hackers there, finding vulns in *.gov.uk sites for example! My contribution included a system of detecting MPs faces (on ID cards) using a photoresistor I had in my bag.

## Why?

Hardware hacks are my thing, I had brought along every resistor I owned and had thought of this idea quickly beforehand. I set out in a team but it quickly became apparent that I&#39;d be tackling this challenge on my own; that&#39;s what I did.

## What is it?

Using a bunch of images of UK Members of Parliament (sorry <a href="http://theyworkforyou.com">TheyWorkForYou</a> for the repeated API usage!) converted to monochrome I built a system that would detect which MP was displayed on the phot based on the light coming into the sensor.

## How does it work?

At the time I didn&#39;t know, I was tired and it was 3:30am when it finally worked successfully.

The basic principle is that the black parts of the image wouldn&#39;t allow light to pass through (or not enough to be detected), so calculating the amount of black in the image and then getting the percentage light level when the image was placed on the sensor compared to a plain white light would detect the MP.

I just match up the two percentages and if they&#39;re the same (I had a +-0.4% accuracy) then it would be the MP!

<div class="video-container">

  <iframe width="853" height="480" src="//www.youtube.com/embed/33tpPE9dmJs?rel=0" frameborder="0" allowfullscreen></iframe>

</div>

## Contact

Keep in mind that this was created in less than 24 hours so the <a href="https://github.com/will3942/pseudo-facial-recognition">code</a> isn&#39;t meant to be pretty.

You can contact me at will@will3942.com or <a href="http://twitter.com/will3942">@Will3942</a>.

Feel free to join in the discussion on Hacker News <a href="https://news.ycombinator.com/item?id=7387467">here</a>.
