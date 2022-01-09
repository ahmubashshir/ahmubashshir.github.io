---
layout: post
title:  "sysctl অপটিমাইজেশন"
date:   2020-11-07 10:26 PM +0600
categories: linux
tags: sysctl tweaks
---

আমার তেমন লেখালেখির অভ্যাস নাই.... তো কাজের কথা শুরু করি।

## `vm.swappiness`
এই অপশন এর ভ্যালু কমায় দিলে কার্নেল যখন তখন সোয়াপ করবে না[^1]। এইটার ডিফল্ট ভ্যালু 60 থাকে... তো যেইটা করতে হবে:
```sh
# /etc/sysctl.d/10-vm-swap.conf
vm.swappiness = 10
```
`vm.swappiness` 0 করলে কার্নেল একবারে বিপদে না পড়লে সোয়াপ করবে না।

## `vm.vfs_cache_pressure`
এই অপশন এর ভ্যালু ১০০ এর বেশি সেট করলে কার্নেল যত দ্রুত সম্ভব আইনোড ক্যাশ ক্লিয়ার করবে[^2]। তবে এইটা বেশি দিলে সফটওয়্যার স্টার্ট নিতে সময় বেশি লাগতে পারে।
১০০০ এর উপরে সেট না করাই ভালো।
```sh
# /etc/sysctl.d/10-vm-cache.conf
vm.vfs_cache_pressure = 150
```

## `vm.dirty_*`
এইটা আসলে একটা অপশন না। অপশন গুলা হচ্ছে
 * `vm.dirty_background_bytes`[^3]
 * `vm.dirty_bytes`[^4]
 * `vm.dirty_expire_centisecs`[^5]
 * `vm.dirty_writeback_centisecs`[^6]

এই অপশন গুলা কার্নেলের বাফার সাইজ আর রাইটব্যাক টাইমআউট  কন্ট্রোল করে। আর `vm.dirty_background_bytes` এর সাইজ `vm.dirty_bytes` এর অর্ধেক রাখা উচিত।<br />
আর `vm.dirty_writeback_centisecs` এ সেট করা সময় পর পর কার্নেল বাফারে যা আছে সব ডিস্কে রাইট করে, `vm.dirty_expire_centisecs` এ সেট করা সময় পর পর
বাফার ফ্লাশ করে। আমার মতে `vm.dirty_background_bytes` ২ এমবি আর `vm.dirty_bytes` ৪ এমবি দিলেই যথেষ্ট।<br /> আর `vm.dirty_writeback_centisecs` এ ২০ মানে
0.2 সেকেন্ড পর পর বাফারের ডাটা ডিস্কে রাইট হবে, ফলে ডাটা হারানোর সম্ভাবনা কমবে।
```sh
# /etc/sysctl.d/70-dirty-bytes.conf
vm.dirty_bytes = 4194304
vm.dirty_background_bytes = 2097152
vm.dirty_expire_centisecs = 80
vm.dirty_writeback_centisecs = 20
```

# `kernel.nmi_watchdog`
এই অপশন কার্নেলের নন মাস্কেবল ইন্টারাপ্ট ওয়াচডগ কন্ট্রোল করে[^8]। ডেস্কটপ হ্যাং হলে যেহেতু ফোর্স রিবুট করা যায় এই জন্য আমাদের এইটা দরকার নাই যদিও এইটা ডিফল্ট এনাবল থাকে[^9]।
```sh
kernel.nmi_watchdog = 0
```

[^1]: https://sysctl-explorer.net/vm/swappiness/
[^2]: https://sysctl-explorer.net/vm/vfs_cache_pressure/
[^3]: https://sysctl-explorer.net/vm/dirty_background_bytes/
[^4]: https://sysctl-explorer.net/vm/dirty_bytes/
[^5]: https://sysctl-explorer.net/vm/dirty_expire_centisecs/
[^6]: https://sysctl-explorer.net/vm/dirty_writeback_centisecs/
[^8]: https://sysctl-explorer.net/kernel/nmi_watchdog/
[^9]: https://unix.stackexchange.com/questions/353895/should-i-disable-nmi-watchdog-permanently-or-not
