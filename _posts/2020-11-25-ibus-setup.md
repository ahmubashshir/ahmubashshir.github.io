---
layout: post
title: আইবাস সেটআপ
date: 2020-11-24 20:25:00 +0600
categories: ibus-setup linux i18n
tags: linux tweaks
---
# বেসিক সেটআপ
লিনাক্স যারা নতুন চালানো শুরু করে তাদের যেই সমস্যা গুলায় পড়তে সবথেকে বেশি পড়তে দেখছি টার মধ্যে একটা হল আইবাস কনফিগার করা...

তো এখন কাজের কথা শুরু করি... আইবাস দিয়ে অন্যান্য ইনপুট মেথড ব্যবহার করার জন্য কয়েকটা এনভায়রনমেন্ট ভেরিয়েবল সেট করতে হবে যে গুলো শুধু গ্রাফিকাল সেশনে লাগে... X11 সেশনের জন্য এই ভেরিয়েবল সেট করার সবথেকে ভালো ফাইল `~/.xprofile`। এই ফাইলে যে ভেরিয়েবল গুলো সেট করতে হবে সেগুলো হচ্ছে 
+ `QT_IM_MODULE`
+ `GTK_IM_MODULE`
+ `XMODIFIERS`

`~/.xprofile` ফাইলে নিচের লাইন গুলো লিখতে হবে:[^1]
```bash
#!/bin/sh
export GTK_IM_MODULE=ibus
export QT_IM_MODULE=ibus
export XMODIFIERS=@im=ibus
```
এরপরে `chmod +x ~/.xprofile` কমান্ড দিয়ে ফাইলে এক্সিকিউট পারমিশন দিয়ে সেশন রিস্টার্ট দিলে সব অ্যাপ আইবাস থেকে ইনপুট নিবে...

এইবার `ibus-setup` রান করে যে যে ইনপুট মেথড গুলো লাগবে সেগুলো অ্যাড করে নিলেই কাজ শেষ।


## ট্রাবলশুটিং
+ আইবাস নিজে নিজে চালু হয় না
  + সমাধান: 
    + শর্টকাট: `~/.xprofile` ফাইলের শেষে `ibus-daemon -drx` লিখে সেভ করে সেশন রিস্টার্ট দেন
    + লম্বা সমাধান[^2]:  
    [ibus@.service](https://github.com/KSXGitHub/ibus-daemon.pkgbuild/raw/master/ibus%40.service) আর [ibus-config@.service](https://github.com/KSXGitHub/ibus-daemon.pkgbuild/raw/master/ibus-config%40.service) ফাইল দুইটা কপি করে `~/.config/systemd/user` ফোল্ডারে রেখে `systemctl --user daemon-reload` কমান্ড দেন। এরপরে `systemctl --user restart ibus@$DISPLAY` কমান্ড দিয়ে আইবাস স্টার্ট করেন।  
    আর `~/.xprofile` ফাইলের শেষেও `systemctl --user restart ibus@$DISPLAY` কমান্ড টা লিখে সেভ করেন।
    
আর অন্য কোন সমস্যা থাকলে কমেন্ট বা মেইল করতে পারেন... তবে প্রথম পরামর্শ হচ্ছে  *আগে সার্চ করে দেখবেন*।


[^1]: https://wiki.archlinux.org/index.php/IBus#Initial_setup
[^2]: https://github.com/KSXGitHub/ibus-daemon.pkgbuild/