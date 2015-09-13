How to colocate your first server at a datacenter
11/06/2014
Colocating your first server can be a scary process and one that can seem cheap (it can be cheap!) but one that can get expensive unless you're careful and know all the details of what you're buying into.

## What is colocation

Colocation is where you house your server (either a tower but usually a rackmount server) in a datacenter and you rent power and transit. If you're colocating a single server then you will have your networking provided and you won't need to install your own firewall, KVM, power or switch.

>A colocation centre or colocation center (also spelled co-location, collocation, colo, or coloc) is a type of data centre where equipment, space, and bandwidth are available for rental to retail customers. Colocation facilities provide space, power, cooling, and physical security for the server, storage, and networking equipment of other firms—and connect them to a variety of telecommunications and network service providers—with a minimum of cost and complexity. <a href="http://en.wikipedia.org/wiki/Colocation_centre">Source: wikipedia.org</a>

## Choosing a server - Power

This is one of the hardest parts of colocation. I'm going to assume you don't already have a server (for convenience), but if you do then some of these ideas will still apply. Now whilst you're choosing a server you should be aware of the fundamental mistake that many people make with colocation, **power.

You can by all means head to eBay and craigslist, both full of servers with buzzwords like **powerful, **high RAM, **VT enabled and many more but one of the most expensive and important factors of choosing a server to colocate is how much power it takes.

For brands I recommend: HP, Dell and SuperMicro. For HP and Dell you have power calculators found <a href="http://www8.hp.com/uk/en/products/servers/solutions.html?compURI=1439951">here</a> and <a href="http://www.dell.com/html/us/products/rack_advisor_new/">here</a> which allow you to choose the chassis and input the configuration. For SuperMicro you will need to add up the Watts of all the different components to find the maximum power draw, I'll talk about this below.

Now you will need to know what voltage your datacentre supplies power at (if you have a datacentre) otherwise you're looking at likely 240V, 208V and 120V for North America. 230V for the Netherlands and mainland Europe and 240V or 230V for the United Kingdom. It may be best to email the datacentre to get the voltage that they supply at.

Usually when you buy your colocation package you will have a certain amount of Amps provided (this is your power), and then you either pay per extra Amp or you pay in kWh (kilowatt hours). You need to work out your current draw in amps from one of the above voltages with the following formula: Current = Power / Voltage. So for example: Current = 115W / 230V = 0.5A (This is the typical power draw for a E3v3 server (for example the HP gen8s)). Your power calculator above should provide you a reading in Amps anyway. For SuperMicro you can find the Watts for the CPU on Intel or AMD's website, the chassis on SuperMicro's website and HDDs are 7 to 15W.

For a cheaper colocation deal, and a sign of a new and efficient server you want to find one with **maximum 0.5A to 1A, this will likely be included in a 1U to 4U single server package.

## Choosing a server - Units (1U, 2U, 3U, 4U)

Usually you will colocate a 1U server for many reasons. They are cheap to courier if you do not live near the datacentre and many new 1U servers have performance that's acceptable even for high virtualization tasks. They are also cheapest to colocate.

## Choosing a server - CPU

The CPU can be the bottleneck of many and most servers, you will want to check the benchmark of your CPU whether it a single CPU or a dual CPU on a site like <a href="http://www.cpubenchmark.net">CPUBenchmark</a>, a good value is 7000+ for a single CPU. The higher the value depends on the tasks you want to perform, if you're aiming to sell VPSs and VMs then you will need a much more powerful CPU to have enough to allocate to each virtual machine but if you're just running a light web server then you can make do with a less powerful CPU.

## Choosing a server - RAID adapter and HDD bays

Now again if you're selling VPSs you will usually want 2 to 4 HDD bays. If you have 4 then you can run RAID 10 (either software RAID or hardware RAID) and for 2 you can run in RAID 1. RAID 1 is where your data is mirrored between the drives so you have a backup if 1 drive fails and RAID 10 is where the data is striped between 4 drives, RAID 10 offers much greater performance.

Your server may come with a hardware RAID adapter which may be **battery backed and cached, this will again offer greater performance in all RAID levels but you can still make do with software RAID and have few problems. Make sure to check the watts of the RAID adapter if you've got one.

## Choosing a server - Final notes

Obviously you will need to look to see if you have multiple power supplies and factor this into your colocation package, some datacenters charge more for multiple power drops (the amount of connections) and multiple network drops.

## Choosing a datacentre - Geographical location

This is a huge factor, if you live in the United Kingdom and your main client base is in the United Kingdom then you **DO NOT want to be colocating in the United States. The latency will be huge. However you may want to look to colocate in mainland Europe (the Netherlands has almost no latency difference to colocating in the United Kingdom and it is usually cheaper).

Also if there is a failure, and you don't have any **remote hands (see below) included then you need to factor in the time and money it will cost you to fix an issue with your server, HDD failures etc.

## Choosing a datacentre - IP addresses

This is a huge factor, many data centres will charge you slightly more for the colocation package and then offer you as many IP addresses as you require (subject to justification) but otherwise you may be charged per IP address or IP block. An IP block is simply a contingent of IP addresses, for example /28 which has 13 usuable IP addresses and the other 3 are used for the network, gateway and broadcast. Depending on what you are using your server for, 1 IP address may suffice but if you require more say for VPSs then make sure you look at how easy (and expensive) it is to get IP addresses from your datacentre.

## Choosing a datacentre - Remote hands

When you leave your shiny new server in a noisy building it might damage itself, HDD failures and RAM failures and these need to be rectified. If you live near the datacentre then you can simply travel and fix it but if you don't, say it's in another country then you will have a feature called &quot;remote hands&quot; in your colocation package. Usually you will get some included, HDD replacements etc and you can either mail a replacement HDD or buy one from the datacentre but sometimes you will have to pay per hour and if it's a weekend, the time when you sell the most products, then it may be expensive to get someone to come and replace your failed HDD for you.

## Final notes

Colocating can be a tricky process, it certainly was for me and it can be very cheap or very expensive unless you're careful and wise about it. I used to colocate in the United Kingdom but have since moved to the Netherlands for a much better deal and I have experienced no latency difference, just a tip if you're in the UK and looking for colocation.

## Contact

If you need any help, you can find me on <a href="http://twitter.com/will3942">twitter @Will3942</a> and you can comment on this article at Hacker News <a href="https://news.ycombinator.com/item?id=7877310">here</a> or you can email me: will@will3942.com
