Fuck Internet Censorship
4/11/2015
How to *avoid* Internet censorship with an always-on WiFi Access Point proxying traffic through the Tor network using a Raspberry Pi.

# The Problem
[Today](http://www.bbc.co.uk/news/uk-politics-34715872), Theresa May has said that the UK government will start recording all the sites that you visit on the internet and they will be accessible without a warrant. This is not ok. This is a complete invasion of privacy. This violates our basic human rights.
> **Article 12.**
>
> No one shall be subjected to arbitrary interference with his privacy, family, home or correspondence, nor to attacks upon his honour and reputation. Everyone has the right to the protection of the law against such interference or attacks

# What do I need to *protect* against this?
An internet connection, an ethernet cable, 4GB+ SD card, a [Raspberry Pi](https://www.raspberrypi.org/) (or other Linux based computer) and a [USB WiFi adapter](http://www.amazon.co.uk/Edimax-EW-7811UN-150Mbps-Wireless-Adapter/dp/B003MTTJOY). The Edimax WiFi adapter I have linked has been the best in my testing. I have tried WiFi adapters labeled "The Pi Hut" and these have failed after a few months of constant use (they just drain power and refuse to do anything now) so I'd definitely recommend this one as it's cheap, can run in Access Point mode and is available with next day delivery.

# Tor
We will be using [Tor](https://www.torproject.org/) to provide anonymity. There are known [problems](http://www.wired.com/2013/09/freedom-hosting-fbi/) [with](http://www.eweek.com/security/snowden-nsa-disclosures-left-a-changed-world-in-their-wake.html) [Tor](https://mice.cs.columbia.edu/getTechreport.php?techreportID=1545&format=pdf) however it is still a very good (and easy) option to provide anonymity. In addition to Tor you could also use a VPN so that the government cannot see that you are actually connecting to Tor and so that will not be logged.

# Prepare the Raspberry Pi
1. Make sure your Raspberry Pi is plugged in with power to a [USB plug with at least 1A available](http://www.amazon.co.uk/Pixnor-PIXNOR-UK-plug-Adapter-Charger/dp/B00IVAO8G8/), then connect it via an Ethernet cable to your switch or router that will provide internet connectivity.
2. Download the Raspbian image from [here](https://www.raspberrypi.org/downloads/raspbian/) (click "Download ZIP"). I have used the Wheezy version but this should also work fine for Jessie.
3. Copy the Raspbian image to your SD card using the tutorial on Raspberry Pi's website, [here](https://www.raspberrypi.org/documentation/installation/installing-images/).
4. Boot your Raspberry Pi and grab its IP address from your switch/router's interface (this may be a web interface at http://192.168.1.1 or a GUI or CLI interface depending on what you're using ([email me for help if needed](mailto:will+tor@will3942.com))).
5. SSH to your Raspberry Pi `ssh pi@IPADDRESSFROMABOVE`, the password is `raspberry`.
6. Now run `sudo raspi-config` to configure the Raspbery Pi, you should only need to do options `Expand Filesystem` and `Change User Password`.
7. Plug in your WiFi adapter by USB to the Raspberry Pi (it may reboot due to a sudden surge in power consumption (if so you will need to reconnect to SSH)) and run the command `sudo ifconfig -a` and check that `wlan0` is returned. Mine is displayed below.
		eth0      Link encap:Ethernet  HWaddr b8:27:eb:ca:88:88
		          inet addr:192.168.1.90  Bcast:192.168.1.255  Mask:255.255.255.0
		          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
		          RX packets:4721164 errors:0 dropped:0 overruns:0 frame:0
		          TX packets:2605876 errors:0 dropped:0 overruns:0 carrier:0
		          collisions:0 txqueuelen:1000
		          RX bytes:573962156 (547.3 MiB)  TX bytes:737125559 (702.9 MiB)

		lo        Link encap:Local Loopback
		          inet addr:127.0.0.1  Mask:255.0.0.0
		          UP LOOPBACK RUNNING  MTU:65536  Metric:1
		          RX packets:119760 errors:0 dropped:0 overruns:0 frame:0
		          TX packets:119760 errors:0 dropped:0 overruns:0 carrier:0
		          collisions:0 txqueuelen:0
		          RX bytes:20593707 (19.6 MiB)  TX bytes:20593707 (19.6 MiB)

		mon.wlan0 Link encap:UNSPEC  HWaddr 24-3C-20-09-1E-E8-00-00-00-00-00-00-00-00-00-00
		          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
		          RX packets:665146 errors:0 dropped:0 overruns:0 frame:0
		          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
		          collisions:0 txqueuelen:1000
		          RX bytes:78776567 (75.1 MiB)  TX bytes:0 (0.0 B)

		wlan0     Link encap:Ethernet  HWaddr 24:3c:20:09:1e:e8
		          inet addr:192.168.39.1  Bcast:192.168.42.255  Mask:255.255.255.0
		          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
		          RX packets:3182150 errors:0 dropped:0 overruns:0 frame:0
		          TX packets:3943803 errors:0 dropped:0 overruns:0 carrier:0
		          collisions:0 txqueuelen:1000
		          RX bytes:408582060 (389.6 MiB)  TX bytes:3631017924 (3.3 GiB)


# Setting up the Pi as an Access Point
We will now setup the Raspberry Pi as a WiFi Access Point with a built-in DHCP server.
1. Execute `sudo apt-get update` to update the Raspberry Pi's software lists.
2. Execute `sudo apt-get install hostapd isc-dhcp-server` and hit `Y` when prompted to install HostAPD, an access point daemon, and a DHCP Server.
3. Replace the contents in the file, `/etc/dhcp/dhcpd.conf` with the following (for example using `nano /etc/dhcp/dhcpd.conf`). This will setup a DHCP server offering IP address in the range 192.168.42.2 to 192.168.42.253 with 192.168.39.1 as the Raspberry Pi's IP address.
		ddns-update-style none;
		default-lease-time 600;
		max-lease-time 7200;
		authoritative;
		log-facility local7;
		subnet 192.168.42.0 netmask 255.255.255.0 {
		        range 192.168.42.2 192.168.42.253;
		        option broadcast-address 192.168.42.255;
		        option routers 192.168.39.1;
		        default-lease-time 600;
		        max-lease-time 7200;
		        option domain-name "local";
		        option domain-name-servers 8.8.8.8, 8.8.4.4;
		}
4. Edit the file `/etc/default/isc-dhcp-server` and change `INTERFACES=""` to `INTERFACES="wlan0"`, this will enable the DHCP server to offer IP addresses on the `wlan0` interface.
5. Add the following to a file named `/etc/ap.rules` to a) forward traffic to Tor, b) allow SSH access and c) allow HTTP access to the server.
		*nat
		:PREROUTING ACCEPT [0:0]
		:INPUT ACCEPT [0:0]
		:OUTPUT ACCEPT [0:0]
		:POSTROUTING ACCEPT [0:0]
		-A PREROUTING -i wlan0 -p tcp -m tcp --dport 22 -j REDIRECT --to-ports 22
		-A PREROUTING -i wlan0 -p tcp -m tcp -d 192.168.39.1 -j REDIRECT --to-ports 80
		-A PREROUTING -i wlan0 -p udp -m udp --dport 53 -j REDIRECT --to-ports 53
		-A PREROUTING -i wlan0 -p tcp -m tcp --tcp-flags FIN,SYN,RST,ACK SYN -j REDIRECT --to-ports 9040
		COMMIT
		*filter
		:INPUT ACCEPT [152:10497]
		:FORWARD ACCEPT [23:13601]
		:OUTPUT ACCEPT [165:25479]
		COMMIT
6. Now edit `/etc/network/interfaces` so it looks like the following to give `wlan0` the static IP address of `192.168.39.1` so it functions as the gateway for the access point. Remove any other lines in the file.
		auto lo
		iface lo inet loopback

		auto eth0
		allow-hotplug eth0
		iface eth0 inet dhcp

		iface wlan0 inet static
		  address 192.168.39.1
		  netmask 255.255.255.0
		up iptables-restore < /etc/ap.rules
7. Execute `sudo ifdown wlan0 && sudo ifup wlan0` or restart to activate the `wlan0` interface.
8. Enable IPv4 forwarding permanently in the kernel by editing `/etc/sysctl.conf` and adding `net.ipv4.ip_forward=1` to the bottom. Activate this immediately with `echo 1 > /proc/sys/net/ipv4/ip_forward`.
9. Edit `/etc/hostapd/hostapd.conf` and add the following to setup the WiFi Hotspot. You can replace `fgov` with another SSID name however I find it quite fitting. Security can also be added however the range of this WiFi adapter doesn't reach outside my house so I didn't bother.
		interface=wlan0
		driver=nl80211
		ssid=fgov
		hw_mode=g
		channel=6
10. Now activate the HostAPD config by editing `/etc/default/hostapd` and changing `#DAEMON_CONF=""` to `DAEMON_CONF="/etc/hostapd/hostapd.conf"`.
11. Enable HostAPD and isc-dhcp-server to start on system start with `sudo update-rc.d hostapd enable` and `sudo update-rc.d isc-dhcp-server enable`.
12. Now execute `sudo service isc-dhcp-server start` and then `sudo service hostapd start` to start the DHCP server and then the Access Point daemon. You should now be able to see `fgov` in your list of available WiFi networks on the computer you are connecting to the Raspberry Pi with.

# Setting up Tor
This is the last step to *anonymity*!
1. Install Tor `sudo apt-get install tor`
2. Replace the contents of `/etc/tor/torrc` with:
		Log notice file /var/log/tor.notices.log
		VirtualAddrNetwork 10.192.0.0/10
		AutomapHostsSuffixes .onion,.exit
		AutomapHostsOnResolve 1
		TransPort 9040
		TransListenAddress 192.168.39.1
		DNSPort 53
		DNSListenAddress 192.168.39.1
3. Create the log file with `sudo touch /var/log/tor.notices.log` and then `sudo chown debian-tor /var/log/tor.notices.log`.
4. Start Tor and enable it on system start with `sudo service tor start` and then `sudo update-rc.d tor enable`.

# Anonymity
This isn't a perfect, foolproof way to anonymity but it is a good start. As said before added extras would be connecting to a VPN before Tor. You could also try replacing the Ethernet connecting with another WiFi adapter and having anonymity-on-the-go.

# Troubleshooting
If you have issues, SSH into the Raspberry Pi and cat `/var/log/tor.notices.log` which will show you output of the Tor daemon. If you want to contact me for any more information or help  I'm available on twitter [@Will3942](http://twitter.com/will3942) or [email](mailto:will@will3942.com).
