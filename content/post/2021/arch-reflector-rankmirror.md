---
title: আর্চলিনাক্সে রিফ্লেক্টর আর র‍্যাঙ্কমিরর
date: 2021-04-20T19:18:59+06:00
tags:
- ArchLinux
- Rankmirror
- Reflector
- Mirrorlist
---
নতুন যারা আর্চ বা এর ডেরিভেটিভ(এন্ডেভার/মাঞ্জারো...) তে সুইচ করে তাদের অনেকের অভিযোগ থাকে যে রিপোর স্পিড কম।
আবার লোকাল মিররে স্পিড বেশি থাকলেও সব সময় আপ-টু-ডেট থাকে না।
রিফ্লেক্টর দিয়ে আপ-টু-ডেট মিররলিস্ট জেনারেট করার পরে র‍্যাঙ্কমিরর দিয়ে স্পিড অনুযায়ী সর্ট করলেই এই সমস্যা সমাধান হবে।

 1. রিফ্লেক্টর সেটআপ: [^1]
    1. `$EDITOR /etc/xdg/reflector/reflector.conf` কমান্ডটা টারমিনালে রান করেন।  
    `$EDITOR` = `vi`/`vim`/`nano`/`emacs`
    1. এডিটর ওপেন হলে নিচের কনফিগ অনুযায়ী চেঞ্জ করেন।
       {{<highlight sh>}}
--latest 20
--sort rate
{{</highlight>}}

 1. র‍্যাঙ্কমিরর সেটআপ: [^2]
    1. সার্ভিস:
       1. টারমিনালে `sudo systemctl edit --force --full rankmirror@.service` রান করেন।
       1. এডিটরে নিচের কনফিগ লিখে সেভ করেন।
          {{<highlight ini>}}
[Unit]
Description=Rank /etc/pacman.d/%i based on speed

[Service]
Type=oneshot
ExecStart=/bin/sh -c "rankmirrors /etc/pacman.d/%i > /etc/pacman.d/%i~ && mv /etc/pacman.d/%i~ /etc/pacman.d/%i"{{</highlight>}}

    1. টাইমার:
       1. টারমিনালে `sudo systemctl edit --force --full rankmirror@.timer` রান করেন।
       1. এডিটরে নিচের কনফিগ লিখে সেভ করেন।
          {{<highlight ini>}}
[Unit]
Description=Rank /etc/pacman.d/%i based on speed daily

[Timer]
OnCalendar=daily
Persistent=true
AccuracySec=3s
RandomizedDelaySec=2h

[Install]
WantedBy=timers.target{{</highlight>}}
1. মিররলিস্ট আপডেট করা:
   1. টার্মিনালে `sudo systemctl start reflector` রান করেন...
   1. এইটা শেষ হইলে `systemctl start rankmirror@mirrorlist` রান করেন...
1. অটোম্যাট করা:
   [যে কোন একটা ইউজ করেন]
   1. টারমিনালে `sudo systemctl enable --now reflector.timer rankmirror@mirrorlist.timer` রান করেন।

   1. `rankmirror@mirrorlist.service` কে `reflctor.service` এর সাথে কানেক্ট করা।
      {{<highlight sh>}}
sudo EDITOR=ed systemctl edit reflector.service <<EOF
2a
[Unit]
Wants=rankmirror@mirrorlist.service
Before=rankmirror@mirrorlist.service
.
w
EOF
systemctl reenable reflector
systemctl restart reflector
{{</highlight>}}
   
[^1]: https://wiki.archlinux.org/index.php/Reflector
[^2]: https://wiki.archlinux.org/index.php/Mirrors#List_by_speed
