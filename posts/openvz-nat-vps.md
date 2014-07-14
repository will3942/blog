Selling OpenVZ VPSs with no public IPv4 addresses
13th July 2014
Usually when you create a VPS on your virtualization platform you give it a public IPv4 address but with RIPE, ARIN and other NCCs running out datacenters are shooting up their prices and we need to find another way. IPv4 NAT ports.

##What is a VPS?

In essence a VPS is a virtual computer/server running inside the main "dedicated" server. It has it's own shell and it's allocated it's own resources, it thinks it's a real server. If you know what a virtual machine is, a VPS is just a fancy name for that.

##What is OpenVZ?

OpenVZ is a hypervisor, it allows you to run "containers" which are VPSs which share the same kernel as the host (dedicated server). It's one of the most lightweight, little-overhead hypervisors out there and is commercially used by many providers around the world. 

##What is an IPv4 NAT port?

This is simply a port on the host node with the host's IPv4 address which is forwarded to the OpenVZ guest and the client can therefore access a service (or range of) e.g SSH from the outside world without having a dedicated IPv4 address.

##Giving internet access to NAT'd OpenVZ containers

First you need to create a OpenVZ container, this is fairly simple and there are plenty of guides covering this (e.g [here][1]) so I won't go over it here.  

After that you have to assign the container a private IPv4 address (e.g 192.168.0.1):  

`vzctl set 101 --ipadd 192.168.0.1 --save`  

In `/etc/modprobe.d/openvz.conf` change `options ip_conntrack ip_conntrack_disable_ve0=1` to `options ip_conntrack ip_conntrack_disable_ve0=0`. Then you need to make sure the containers can access the internet from the outside:  
`iptables -t nat -A POSTROUTING -o eth0 -j SNAT --to public_server_ip`  

You need to replace **public_server_ip** with a public IPv4 address on your "dedicated" server. This is the IPv4 address that the clients on the containers will use to connect to their services on their containers.  

##Forwarding ports to containers  

To allow outside users to access ports on containers you will need to forward them with the following command:  

`iptables -t nat -A PREROUTING -p tcp -d public_server_ip --dport PORT -i eth0 -j DNAT --to-destination 192.168.0.1:CLIENTPORT`  

You need to set **public_server_ip** with the same IPv4 address you set above. You need to replace **PORT** with the port you want outside users to use and **CLIENTPORT** to the port of the service inside the container. Once you've done this, everything will work smoothly.  

##How can you use this?

An example is what I'm currently working on [Defined Code Hosting][2] where we provide extremely cheap VPSs £4/year for 64MB RAM and £8/year for 128MB RAM. You can see these plans [here][2].

##Contact

If you need any help, you can find me on <a href="http://twitter.com/will3942">twitter @Will3942</a> and you can comment on this article at Hacker News <a href="https://news.ycombinator.com/item?id=7877310">here</a> or you can email me: will@will3942.com

[1]: https://openvz.org/Basic_operations_in_OpenVZ_environment
[2]: https://definedcodehosting.com


