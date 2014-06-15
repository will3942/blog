More notes on OS X Mavericks (+ Yosemite) on QEMU with KVM
5th June 2014
Following up on the article I posted, I have started work on getting OS X Yosemite to boot on QEMU. I also have tested all video cards supplied with QEMU on OS X and have interesting notes.  

##mach_kernel in Yosemite
Yosemite is an interesting topic among hackintoshers and people running virtualized copies of OS X. Apple have decided to finally discontinue <em>legacy boot</em> support in 10.10 (Yosemite) by removing <em>mach_kernel</em> which bootloaders like Chameleon and BIOSes looked for when trying to boot a HDD. Instead they have moved it to <code>/System/Library/Kernels/kernel</code> and legacy bootloaders can no longer boot this.  
##How do we combat this?
Clover. The simple answer is a bootloader capable of booting in EFI or UEFI mode. All Apple computers capable of running OS X Yosemite load it through Apple&#39;s <em>boot.efi</em> file and since Clover is an EFI bootloader it can quite happily load is and boot Yosemite.
##EFI boot on QEMU?
Not yet. We have <a href="http://sourceforge.net/apps/mediawiki/tianocore/index.php?title=OVMF">OVMF</a> which is a UEFI bootloader for QEMU however this currently does not have OS X support and therefore, even if you can get Clover to boot, no operating systems are detected and we can get no further because of the lack of OS X specific support.  
##Accessing OS X VM
You can use VNC (provided by QEMU) to access OS X to do the install (and if you do not have a public-facing (or private if you&#39;re running this locally) IP address to access it from) but the mouse positioning is not ideal. As you move your mouse more, the virtual cursor will get further away from your <em>real</em> cursor which makes it very difficult to use. Solution? OS X Screen Sharing + VNC. Hidden with System Preferences->Sharing is &quot;Screen Sharing&quot; which is a hidden gem for both people accessing on OS X who can use the native screen sharing app (vnc://ip_address) but also for Linux and Windows clients who can access the VM via VNC (System Preferences->Sharing->Screen Sharing->Advanced) by setting a password in the Screen Sharing preferences.  
##VGA drivers in QEMU
QEMU provides us with the following drivers for a <em>simulated</em> graphics card: std, cirrus, vmware, qxl, xenfb, tcx, cg3. Now the following don&#39;t work under OS X: qxl, xenfb, tcx and cg3. That leaves us with std, cirrus and vmware.
##VGA driver: VMware
This driver will quite happily boot OS X, both in Screen Sharing and VNC (provided by QEMU) however as soon as you install the <em>VMsvga2</em> kext in OS X you will be unable to boot, with no kernel panic output but simply a line specifying the &quot;System uptime in nanoseconds&quot;. So this isn&#39;t recommended as it may be unstable without the kext.  
##VGA driver: Cirrus
This driver will work fine in VNC (provided by QEMU) however as soon as you use Screen Sharing or any VNC server within OS X you will get wonderful purple graphics glitches, unsure how to fix this.
##VGA driver: std
This will work for both VNC (provided by QEMU) and Screen Sharing and this is the driver I personally recommend to use since it is stable in my testing and provides reasonable performance for a non hardware-enhanced driver.  
##VGA passthrough
This will be interesting since QEMU now supports VGA passthrough via <a href="http://wiki.qemu.org/ChangeLog/1.5">VFIO</a> however I have neither an ATI nor NVidia card and therefore I am unable to test this, so do not expect any research from me on this.
##virtio-net kext
This will quite happily work fine in Mountain Lion and below, however Mavericks will complain that it is not properly signed. To combat this, simply move the kext from System/Library/Extensions to your desktop and drop it into <a href="http://cvad-mac.narod.ru/index/0-4">Kext Utility</a> and this will sign and install it for you. Then you will get no kernel panics on boot.
##Mavericks install
Based on my previous research, the method was that you need to go from Mountain Lion -> Mavericks via an upgrade. This is now false, you can install Mavericks directly. I believe there may be issues with Mavericks and therefore the install will be hit and miss so continue trying until you get it complete.
##Migrating from a flat file to an LVM partition
Since the installer will not boot unless you are using a flat file and not an LVM partition you will need to copy it over afterwards. This is easy and can be achieved with the following command:
<code>dd if=/path/to/mavericks_installed.img of=/dev/vg/lv bs=64M</code>
##Resizing a qcow flat file with OS X installed
You can resize the image itself with:
<code>qemu-img resize filename +5G</code>
However this will break the partition table (GPT), to fix this we can mount the GParted .iso into the guest, boot into this and then it will automatically fix this for us and you can boot back into OS X and extend it manually. You can attach GParted by appending this to the qemu command:
<code>-device ide-drive,bus=ide.6,drive=GParted -drive id=GParted,if=none,snapshot=on,file=./GParted.iso</code>
##Contact
You can contact me at will@will3942.com or <a href="http://twitter.com/will3942">@Will3942</a>.
Feel free to join in the discussion on Hacker News <a href="https://news.ycombinator.com/item?id=7859756">here</a>.  
