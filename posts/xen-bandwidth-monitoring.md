Monitoring Xen VMs traffic usage
19th April 2014
Monitoring the traffic usage (bytes received/transmitted) of Xen VMs can be tricky, there are very few management scripts and panels available for you. Here is a tutorial to get you started with monitoring, alerting and null routing abusive Xen guests.  
##Just want the source?
If you just came here for the <a href="https://github.com/will3942/xen-bandwidth-monitor">source</a> and the script it&#39;s available on <a href="https://github.com/will3942/xen-bandwidth-monitor">Github</a> otherwise read on for installation guidelines.
##Installation
First off make sure that MongoDB is installed (<code>apt-get install mongodb</code> for Debian/Ubuntu) and the Xen hypervisor is installed using the <code>xm</code> toolstack.
Next follow these steps:
<ol>
<li><code>bundle install</code> install necessary dependencies.   </li>
<li>Edit <code>bwmon.rb</code> lines 101, 110 and 112 to your own email address, domain and subject respectively.   </li>
<li><code>ruby addvm.rb</code> Add all your VMs with their hostnames (must be the same as <code>xm list</code> and their config file).   </li>
<li><code>./install.sh</code> Move the necessary scripts in place.  </li>
<li>Edit your crontab (<code>crontab -e</code>) to run <code>bash /path/to/start.sh</code> at your specified interval.   </li>
<li>The monitor will then run the script at that interval and email you and nullroute the VM if it goes over its bandwidth allocation.   </li>
</ol>
##How does it work
The script <code>bwmon.rb</code> will parse the output of <code>xentop</code> or <code>xm top</code> to get the current received &amp; transmitted bytes for each VM. This is then logged to the DB in both cumulative and just raw form, this is then checked against the allowance and if it exceeds the VM&#39;s allowance then the IP address is null routed by REJECTing all packets in the chains INPUT, OUTPUT and FORWARD using <code>iptables</code>.
##Contact
If you want to contact me for any more information I&#39;m available on twitter <a href="http://twitter.com/will3942">@Will3942</a> or by email will@will3942.com
