---
title: systemd-resolved + stubby + dnsmasq
date: 2021-04-12T20:44:34+06:00
tags:
- DNS
- Stubby
- Networking
- DNS Resolver
- systemd-resolved
---
আমি কয়েক মাস ধরে ডিএনএস রিসলভার হিসাবে systemd-resolved ইউজ করলাম... এইটা বেসিক রিসলভার হিসাবে ভাল হইলেও কিছু ডিফল্ট ডিএনএস কনফিগ ফলো করে না।

এইজন্য আমি systemd-resolved কে resolve.conf ম্যানেজার হিসাবে ইউজ করে stubby কে রিসলভার আর dnsmasq কে ডিএনএস ক্যাশ হিসাবে কনফিগার করলাম...

1. stubby config: `/etc/stubby/stubby.yml`
	1. প্রথমে নিজের ইচ্ছা মত আপস্ট্রিম ডিএনএস সার্ভার কনফিগার করেন।[^1]
	2. এরপরে `listen_addresses` কীর ডিফল্ট এর বদলে নিচের কনফিগ সেট করেন। [^2]
```yaml
 listen_addresses:
 - 127.0.0.1@53000
 -  0::1@53000
```
	
	3. `sudo systemctl enable --now stubby`
2. dnsmasq config: /etc/dnsmasq.conf
	1. dnsmasq কনফিগ ফাইলের ডিফল্ট সেটিং চেঞ্জ না করে ফাইলের একবারে শেষে নিচের কনফিগ লিখে সেভ করেন। [^3]
```
no-resolv
proxy-dnssec
server=::1#53000
server=127.0.0.1#53000
listen-address=::1,127.0.0.1
```
	2. `sudo systemctl enable --now dnsmasq`
3. systemd-resolved: (drop-in config)
	1. `/etc/systemd/resolved.conf.d` ফোল্ডার না থাকলে `sudo mkdir -p /etc/systemd/resolved.conf.d` রান করেন।
	2. `/etc/systemd/resolved.conf.d/98-servers.conf` ফাইলে নিচের কনফিগ লিখে সেভ করেন।
```ini
[Resolve]
DNS=127.0.0.1
```
	3. `sudo systemctl enable --now systemd-resolved;sudo systemctl restart systemd-resolved`

কাজ শেষ।

[^1]: https://wiki.archlinux.org/index.php/Stubby#Select_resolver
[^2]: https://wiki.archlinux.org/index.php/Stubby#Change_port
[^3]: https://wiki.archlinux.org/index.php/Stubby#dnsmasq
