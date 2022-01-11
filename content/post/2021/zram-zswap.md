---
title: "zram আর zswap"
date: 2021-04-07T18:06:56+06:00
categories:
- Linux
- system tweaks
tags:
- Tweaks
- Swap
- Ram
- Linux
series:
- Linux Newbie
---

লো মেমরি কনফিগের পিসি অপ্টিমাইজ করার জন্য লিনাক্সে দুইটা কার্নেল মডিউল হল zram আর zswap...
র‍্যামে ডাটা পেজ হিসাবে ইনডেক্স করা থাকে...
zswap পেজ গুলাকে lz4/zstd/lzo ফরম্যাটে কমপ্রেস করে রাখে...
আর zram র‍্যামের মোটামুটি ২০-৪০% জায়গা কে ফরম্যাটেবল ব্লক ডিভাইস হিসাবে devfs(/dev) এ এক্সপোজ করে,
আর এই ব্লক ডিভাইস র‍্যামে কমপ্রেসড থাকে... এর জন্য এইটাকে swap হিসাবে ইউজ করলে ফিজিক্যাল swap থেকে বেশি স্পিড পাওয়া যাবে...
তো এখন বলি কিভাবে এই দুইটা কনফিগার করতে হয়...

### `zswap`
 * কার্নেল ভার্সন যদি (<=৫.৪) হয় তাহলে টারমিনালে `printf '%s\n' zstd zstd_compress | sudo tee /etc/modules-load.d/10-zstd.conf` রান করেন...
 * এরপরে `/etc/default/grub` ফাইল ওপেন করে `GRUB_CMDLINE_LINUX_DEFAULT` লাইন টার শেষে `""` 
  <!---->এর মধ্যে `zswap.compressor=zstd zswap.max_pool_percent=30 zswap.zpool=z3fold zswap.enabled=1` লিখে
  <!---->(লাইনটা যদি এইরকম হয়: `GRUB_CMDLINE_LINUX_DEFAULT="quiet splash zswap.compressor=zstd zswap.max_pool_percent=30 zswap.zpool=z3fold zswap.enabled=1"` তাহলে চেঞ্জ এর পরে লাইনটা হবে  `GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"`)
  <!---->(টারমিনালে `sudo grub-mkconfig -o /boot/grub/grub.cfg` রান করেন...
 
### `zram` 
1. `echo zram | sudo tee /etc/modules-load.d/zram.conf`
1. `echo "options zram num_devices=$(nproc)" | sudo tee /etc/modprobe.d/zram.conf`
1. {{<highlight sh>}}
for ((i=0;i<$(nproc);i++));do
  printf "KERNEL==\"zram${i}\","
  printf "ATTR{disksize}=\"256M\","
  printf "RUN=\"/usr/bin/mkswap /dev/zram${i}\","
  printf "TAG+=\"systemd\"\n"
done \
  | sudo tee /etc/udev/rules.d/99-zram.rules{{</highlight>}}
1. {{<highlight sh>}}
sudo cp /etc/fstab{,~}
for ((i=0;i<$(nproc);i++));do
  printf '/dev/zram%d\t' "$i" # target zram device
  printf 'none\t'             # mount point
  printf 'swap\t'             # filesystem
  printf 'defaults\t'         # mount options
  printf '0 0\n'              # skip fsck 
done \
  | sudo tee -a /etc/fstab    # append the generated content to fstab{{</highlight>}}
