---
title: "লিনাক্সে ফ্রন্ট প্যানেলের ইন/আউট জ্যাক ডিটেকশন বন্ধ করা"
date: 2021-02-13T23:20:31+06:00
series:
- Linux Newbie
tags:
- snd-hda-intel
- Front Panel Jack
- Disable Jack Detection
- Hardware Tweaks
- Linux 
---

আমি নিজেও এই ফ্রন্ট প্যানেলের জ্যাক ডিটেকশন নিয়ে ঝামেলায় ছিলাম, উইন্ডোজে তো রিয়েলটেক এর ড্রাইভার এর ইউআই দিয়ে ফিক্স করতাম, লিনাক্সে কেমনে...
তো আমি প্রথমে alsa-profile এডিট করে জ্যাক ডিটেকশন বন্ধ করছিলাম... কিন্তু পালসঅডিও আপডেট করার পরে ঐ ফিক্স আর কাজ করে নাই...

এইজন্য আমি `hdajackretask` টুল টা ব্যবহার করে এইটা ফিক্স করেছি।

  - প্রথমে `Advanced override` এনাবল করেন। ![img1](https://imgur.com/o7p9p2E.png)
  - এরপরে `Pink Mic, Front side` অংশে `override` এনাবল করে `Jack detection` এ `Not Present` সেট করেন। ![img2](https://imgur.com/Khd3R5w.png)
    অন্য কোন অপশন ভুলেও চেঞ্জ করবেন না।
  - এরপর `Green Headphone, Front side` এর `override` এনাবল করে এইখানেও `Jack detection` এ `Not Present` সেট করেন। ![img3](https://imgur.com/g6X8pgz.png)
  - এরপরে নিচে ডান দিকে `Install boot override` বাটন ক্লিক করে সেভ করেন। ![img4](https://imgur.com/RQF62eJ.png)
  - এরপর রিস্টার্ট দেন।

কাজ শেষ...
