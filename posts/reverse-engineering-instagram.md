Reverse-engineering Instagram to access the private API
24/12/2013
This is how I reverse engineered the Instagram app + included linux binaries to locate the private key used for signing requests to their private API and therefore allowing access to uploading photos and *fewer* rate limits.

## Why?

It posed as a challenge and I was also itnerested in working out how these 3rd party clients actually upload to Instagram's servers.

## What signing algorithm does Instagram use?

For all requests to their private API Instagram signs the post data with HMAC-SHA256 and passes this in the parameter *signed_body* using the format `signed_body=signed.postdata` for example `signed_body=nc8e1774526bf84b58bb4ffebb357bddb822a5183e0355db1effc2dad47107a29.{"_uuid":"00000000-0000-0000-0000-000000000000","password":"password","username":"will","device_id":"00000000-0000-0000-0000-000000000000","_csrftoken":"missing"}`

## Getting the key for the HMAC-SHA256 hash

1.  Pull the Instagram apk off your device (make sure USB debugging is enabled in Settings->Developer)

    1.  Run `adb shell pm path com.instagram.android` to get the path of the Instagram app.

    2.  Run `adb pull PATH_FROM_ABOVE` to pull the apk.


2.  Decompile the apk using [apktool](https://code.google.com/p/android-apktool/): `./apktool d com.instagram.android.apk`

3.  Navigate to the decompiled smali code directory `cd com.instagram.android/smali`

4.  Find the file that makes requests `grep -r "RequestUtil.java" .`

5.  Open that file `nano FILE_LOCATION_RETURNED_ABOVE`

6.  Navigate to the lien starting with `.method public static b(Ljava/lang/String;)Ljava/lang/String;`

7.  Change the line below from `.locals 5` to `.locals 6`

8.  Two lines below `.line 70` insert the following code to log the key (comign from variable *v0* which is returned from the `getInstagramString` function in the code above): <code gist="https://gist.github.com/will3942/8113903.json" file="logging_function.smali"></code>

9.  Save the file and exit nano

10. Navigate back to the apktool directory `cd ../..`

11. Build the apk `./apktool b com.instagram.android`

12. Navigate to the built apk location `cd com.instagram.android/dist/`

13. Create a signing key `keytool -genkey -v -keystore android.keystore`

14. Sign the apk `jarsigner -verbose -keystore android.keystore com.instagram.android.apk mykey`

15. Verify the apk `zipalign -f -v 4 com.instagram.android.apk instagram.apk`

16. Push the apk to your device's sdcard `adb -d push instagram.apk /sdcard/instagram.apk`

17. Install the apk on your phone.

18. Start logcat on your computer `adb -d logcat | grep "LOGGING"`

19. Open the instagram app, login and the private key will be returned.

## Making requests

We can create a simple Ruby app to simulate a login:
<code gist="https://gist.github.com/will3942/8113903.json" file="app.rb"></code>

Hopefully the login will be successful, you can then request other locations in the private API (sniff the Instagram app to find these endpoints and the required post data.)

## Finished!

This article was created for educational purposes only, obviously Instagram's public API should only ever be used for making requests. You can find me on [twitter @Will3942](http://twitter.com/will3942) and you can comment on this article at Hacker News [here](https://news.ycombinator.com/item?id=6959472).
