Running OS X Mavericks under QEMU with KVM
04/06/2014
Virtualizing OS X is a thing that can today be done very easily, with VMware and VirtualBox fully supporting it under OS X hosts. But what about virtualizing it using a bare metal hypervisor and QEMU? Under Linux? Finally I&#39;ve got Mavericks fully working under QEMU (with no extra kexts(!)) and it wasn&#39;t easy.

## Credits

Lots of credit for this goes to <a href="http://www.contrib.andrew.cmu.edu/%7Esomlo/OSXKVM/">Gabriel L. Somlo</a> who got the prelimary work for this completed, however I could not get any version of OS X Mavericks to boot from a clean install from his guide, so I adapted it here.

## Update 5th June 2014

Here is a fix for the App Store and/or iCloud not working on OS X. Simply create a folder in the root of your drive called &quot;Extra&quot; and then add the following in a file called <code>org.chameleon.boot.plist</code>. This is very generic for most unsupported computers running OS X.

<code gist="https://gist.github.com/will3942/343bd7daef55748c9104.json" file="org.chameleon.boot.plist"></code>

## Why?

OS X in the cloud. This was a project for fun to see if I could get OS X virtualized on a dedicated server, and it succeeded! Note this was for educational purposes and it is not recommended - there is no guarantee of stability, and it may be against Apple&#39;s EULA.

## Requirements

To complete this you will need:

<ul>
<li>Machine capable of running KVM    </li>
<li>Basic knowledge of a bash shell     </li>
<li>Mavericks .ISO (generated with <a href="http://forums.appleinsider.com/t/159955/howto-create-bootable-mavericks-iso">this shell script</a>)    </li>
<li>Mountain Lion .ISO (generated with <a href="http://forums.appleinsider.com/t/159955/howto-create-bootable-mavericks-iso">this shell script</a>)    </li>
<li>git    </li>
<li>build-essential (gcc, make, iasl, your linux kernel headers)    </li>
</ul>

The same shell script works for both versions of OS X.

## Installing KVM with OS X support

First you need to grab the latest <em>KVM</em> code from their git repo (this is required since the patches for OS X are not shipped with KVM that is in the latest <code>apt</code> or <code>yum</code> repositories). You also need the <em>kvm-kmod</em> code from their git repo, you can get these and build them with the following commands:

<code gist="https://gist.github.com/will3942/343bd7daef55748c9104.json" file="kvm.sh"></code>

## Installing the latest QEMU with OS X support

We grab the latest QEMU and latest SeaBIOS which are patched to support OS X from their git repository:

<code gist="https://gist.github.com/will3942/343bd7daef55748c9104.json" file="qemu.sh"></code>

## Chameleon bootloader to boot into the installer and OS X

You can install Chameleon to the disk after you have installed OS X but for convenience we can pass a binary file to QEMU to boot chameleon.

<a href="http://www.contrib.andrew.cmu.edu/%7Esomlo/OSXKVM/chameleon_svn2360_boot">Download this binary and put it in the same directory as all the other folders you&#39;ve just downloaded.</a>

## Installing Mountian Lion

Before we can install Mavericks, we must first install Mountian Lion and then do an upgrade (this is due to the fact QEMU will just hang on a clean install of Mavericks).

Make sure you have your Mountain Lion and Mavericks .ISOs in the same directory right now, I&#39;m referring to them from now on as <em>MountainLion.iso</em> and <em>Mavericks.iso</em>.

We now need to create a flat file to install OS X to (<em>dd</em> can be used to copy this to an LVM or partition later but unfortunately I haven&#39;t got the installer to boot when a partition is used):

<code>qemu-img create -f qcow2 osx.img 30G</code>

To boot the guest we can use the following command:

<code gist="https://gist.github.com/will3942/343bd7daef55748c9104.json" file="ml.sh"></code>

You will need to insert a key there which you can retrieve from a Apple Mac computer with <a href="http://www.osxbook.com/book/bonus/chapter7/tpmdrmmyth/">the first piece of code here</a>.

You may need to replace the path of <code>./share/qemu/bios-mac.bin</code> with your own path (this should be in a <code>./share</code> or <code>./usr/share</code> to your current path).

This will start up a VNC session on localhost:5901 which you can connect to and boot into the installer!

-smp here defines the number of cores available to the guest. I have used 4 and that functions well, however OS X will quite happily perform fine on just 1 core too.

Install OS X normally and then continue to the next section.

## Upgrading to Mavericks

This is pretty much the same as above, start the same guest with the following command:

<code gist="https://gist.github.com/will3942/343bd7daef55748c9104.json" file="m.sh"></code>

In Chameleon, make sure to boot to &quot;OS X Base System&quot; (your .iso) and not your HDD. Then install Mavericks as normal to the same partition <strong>making sure not the format the partition</strong>.

After this you will have a fully working Mavericks system!

## No Kexts?

This is a fully native system and requires no kext modifications, not even FakeSMC. I have not tested it with FakeSMC but it should all work.

## Networking

Now, the default network driver with QEMU does not work so it is recommeded to use <code>virtio</code>. You can download it with the following command:

<code gist="https://gist.github.com/will3942/343bd7daef55748c9104.json" file="virtio.sh"></code>

Then append the following commands to your above command, start the guest and install the <em>.pkg</em> from the FAT drive that will be mounted and then reboot and networking will work!

<code gist="https://gist.github.com/will3942/343bd7daef55748c9104.json" file="networking.sh"></code>

## Contact

You can contact me at will@will3942.com or <a href="http://twitter.com/will3942">@Will3942</a>.

Feel free to join in the discussion on Reddit <a href="#">here</a>.
