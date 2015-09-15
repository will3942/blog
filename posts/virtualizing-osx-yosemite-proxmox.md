Virtualizing OS X Yosemite on Proxmox
14/09/2015
Information on virtualizing OS X on bare-metal hypervisors is hard to find and not easy to replicate. This guide aims to simplify that by explaining how you can run OS X on a virtualization platform (Proxmox) which will allow you to easily access VNC and replicate the VM in just a few clicks. No longer do you need to delve into the CLI, forward your VNC port over SSH etc when your VM goes south.

# Prelude
This guide should work for all versions of Proxmox however I have only tested it on Debian Wheezy with Proxmox 3.x installed on top. You will need to have SSH access (with the ability to edit `/etc/pve`) to the server running the hypervisor. Obviously your hardware must support full hardware virtualization with KVM support. Apple's EULA permits you to only virtualize OS X on Apple hardware so please keep this in mind.

# The ISO image
First off you're going to need a computer running Mac OS X with `Install OS X Yosemite.app` downloaded from the Mac App Store. Note I have tried a *hackintosh* type ISO with Chameleon/Chimera pre-installed with kexts onto it and this did not boot successfully so I will not provide any guidance/support on this. Once you have the .app save the following code (credit to [Gabriel L. Somlo](http://www.contrib.andrew.cmu.edu/~somlo/OSXKVM/)) to a file (for example `create_iso.sh`) and open `Terminal.app` and execute it.

```
# As of Yosemite, this really only works if executed as root,
# so let's start with that:
sudo -s

# Mount the installer image:
hdiutil attach /Applications/Install\ OS\ X\ Yosemite.app/Contents/SharedSupport/InstallESD.dmg -noverify -nobrowse -mountpoint /Volumes/install_app

# Convert the boot image to a sparse bundle:
hdiutil convert /Volumes/install_app/BaseSystem.dmg -format UDSP -o /tmp/Yosemite

# Increase the sparse bundle capacity for packages, kernel, etc.:
hdiutil resize -size 8g /tmp/Yosemite.sparseimage

# Mount the sparse bundle target for further processing:
hdiutil attach /tmp/Yosemite.sparseimage -noverify -nobrowse -mountpoint /Volumes/install_build

# Remove Package link and replace with actual files:
rm /Volumes/install_build/System/Installation/Packages
cp -rp /Volumes/install_app/Packages /Volumes/install_build/System/Installation/

# NEW: As of Yosemite, there are additional installer dependencies:
cp -rp /Volumes/install_app/BaseSystem* /Volumes/install_build/

# NEW: As of Yosemite, we also need a kernel image!
# Assuming we're executing these steps on a Yosemite machine:
cp -rp /System/Library/Kernels /Volumes/install_build/System/Library/
# NOTE: on older versions of OS X, it is possible to extract the
#       necessary files (/System/Library/Kernels/*) from the
#       /Volumes/install_app/Packages/Essentials.pkg package,
#       using third party software.

# Unmount both the installer image and the target sparse bundle:
hdiutil detach /Volumes/install_app
hdiutil detach /Volumes/install_build

# Resize the partition in the sparse bundle to remove any free space:
hdiutil resize -size $(hdiutil resize -limits /tmp/Yosemite.sparseimage | tail -n 1 | awk '{ print $1 }')b /tmp/Yosemite.sparseimage

# Convert the sparse bundle to ISO/CD master:
hdiutil convert /tmp/Yosemite.sparseimage -format UDTO -o /tmp/Yosemite

# Remove the sparse bundle:
rm /tmp/Yosemite.sparseimage

# Rename the ISO and move it to the desktop:
mv /tmp/Yosemite.cdr ~/Desktop/Yosemite.iso
```

After Yosemite.iso has appeared on your Desktop transfer this to the server running the hypervisor and make sure the root user has permission to access it. This may take a while so make sure you have a fast network connection if you're not on the same LAN.

# The bootloader
I've tested both Chimera and Chameleon and I've only successfully had Chameleon run OS X on KVM so you will need to either compile a version of [Chameleon's trunk](http://forge.voodooprojects.org/svn/chameleon/) or use this [binary (r2757)](http://will3942.com/chameleon_2757_boot). Transfer this file to the server running the hypervisor.

# Creating the VM
Creating the VM is as simple as creating any other KVM machine in Proxmox, simply click the *Create VM* button in the top right of the document, give it a name and set the OS type to *Other*. The networking can either be bridged or routed, in the example below I assume you've used bridged networking. Make sure the CPU is a *core2duo* and only has 1 socket and 1 core (I've been unsuccessful booting it with more than this in Proxmox). The memory and HDD can be whatever you like however **DO NOT USE A CD DRIVE HERE/MOUNT AN ISO. WE WILL DO THIS MANUALLY LATER**. Keep the VM shutdown and your resulting config should look something like this:
<div class="post-img"><img src="/osx-hardware.png"></div>
<div class="post-img"><img src="/osx-options.png"></div>

# Retrieve the OSK key
Use the first piece of code on [this page](http://www.osxbook.com/book/bonus/chapter7/tpmdrmmyth/) to retrieve the key, save this somewhere safe.

# Editing the VM's config
You will now need to SSH into the server running the hypervisor. Make sure you know the ID of the VM in Proxmox (it's the number before the hostname in the VM list in the sidebar). Then open `/etc/pve/qemu-server/VMID.conf` in your favourite text editor (`nano` or `vim` for example). You should modify it to look something like this file:
```
args: -machine q35 -device isa-applesmc,osk="INSERT OSK KEY HERE" -kernel /path/to/chameleon_2757_boot -smbios type=2 -usb -device usb-kbd -device usb-mouse -device ide-drive,bus=ide.2,drive=MacDVD -drive id=MacDVD,if=none,snapshot=on,file=/path/to/Yosemite.iso -readconfig /usr/share/qemu-server/pve-q35.cfg
bootdisk: ide0
cpu: core2duo
ide0: main:105/vm-105-disk-2.qcow2,format=qcow2,cache=writeback,backup=no,size=200G
memory: 4096
name: build-osx-yosemite-1.sys.cuvva.co
net0: e1000-82545em=6A:8F:EE:FC:C6:7B,bridge=vmbr1
ostype: other
tablet: 0
vga: std
```

You should replace `INSERT OSK KEY HERE` with the OSK key you retrieved earlier, the `/path/to/` references and the MAC address of net0.

# Fixing pve-q35.cfg

You should edit `/usr/share/qemu-server/pve-q35.cfg` and comment out the sections from "ehci" to "uhci-3" (inclusive) so it looks something like this:

<div class="post-img"><img src="/pve-q35.png"></div>

# Booting the VM!

You can now boot the VM using the Proxmox Web UI. You should then click Console and use NoVNC to navigate the bootloader (click enter to boot into OS X Base System (Installer)) and then install OS X as you normally would.

# Post-installation modifications

After OS X has installed you should be on the bootloader again, boot into the other entry to OS X Base System and finish the setup. Once you're on the desktop open `Terminal.app` and follow the following screenshots to allow Mac App Store access and automatic booting.

<div class="post-img"><img src="/mk-extra.png"></div>
<div class="post-img"><img src="/org-chameleon.png"></div>
<div class="post-img"><img src="/rm-net.png"></div>

# Finishing off

You can now restart, you should then edit your Network Preferences and enable Screen Sharing (to avoid the weird cursor bug). You can now create templates in the Proxmox GUI and provision OS X VMs very quickly from it. Enjoy!
