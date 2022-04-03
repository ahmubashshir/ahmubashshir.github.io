---
title:  "NIC.EU.ORG ডোমেইন রেজিস্ট্রেশন"
date:   2022-04-03
tags:
- DNS
- Authoritive DNS
- NIC.EU.ORG
series:
- Tutorials
---
পার্সোনাল/ননকমার্শিয়াল অর্গানাইজেশন এর ডোমেইন এর জন্য [EU.ORG][nic] অনেক ভালো একটা সাইট। এইটার রিভিউ পড়তে চাইলে সার্চ করে বের করতে পার, রিভিউ দিয়ে আমি টাইম নষ্ট করতেছি না :3

[EU.ORG][nic] এ রেজিস্ট্রেশন করতে তোমার প্রাইমারি/সেকেন্ডারি নেমসার্ভার লাগবে, হয় তুমি নিজে বাইন্ড/অন্য কোন নেমসার্ভার হোস্ট করতে পারো বা [গ্রানাইটক্যানিয়ন][GC]([EU.ORG][dns-doc] রিকমেন্ডেড)/[ক্লাউডিএনএস][cloudns] এ <span title="আমি সেলফ-হোস্টেড নেমসার্ভার দিয়ে করেছি">তোমার ডিএনএস জোন ক্রিয়েট করতে পার</span>।

প্রথমে [এইখানে][reg] রেজিস্টার করতে হবে।
## ডিপেন্ডেন্সি
1. BIND - https://bind9.readthedocs.io/
2. uacme - https://github.com/ndilieto/uacme

## নেমসার্ভার সেটআপ
1. ডোমেইন এর জন্য জোন ফাইল বানানো
{{<highlight dns>}}
; Replace domain and A/AAAA address with actual domain/address
; /etc/bind/zones/domain.eu.org
$TTL 3h;
@	IN	SOA	ns.domain.eu.org. domain.eu.org. (
	1 ; serial
	3h; refresh timeout
	1h; retry timeout
	1w; expire timeout
	1h; negative caching TTL
)
@	IN	NS		ns.domain.eu.org.  ; name server
@	IN	MX	10	domain.eu.org.     ; mail exchange server

ns	IN	A		1.2.3.4
@	IN	A		1.2.3.4

ns	IN	AAAA	ff::1
@	IN	AAAA	ff::1

www	IN	CNAME	domain.eu.org.
{{</highlight>}}

1. /var/lib/bind এ লিঙ্ক করা
{{<highlight bash>}}
ln -s /etc/bind/zones/domain.eu.org /var/lib/bind/
{{</highlight>}}

1. রিভার্স জোন বানানো
{{<highlight dns>}}
; /etc/bind/zones/3.2.1.in-addr.arpa

$TTL	3h;
@	IN	SOA	ns.domain.eu.org. domain.eu.org. (
	1 ; serial
	3h; refresh timeout
	1h; retry timeout
	1w; expire timeout
	1h ); Negative caching TTL of 1 day
;

@	IN	NS	ns.domain.eu.org.

4	IN	PTR	domain.eu.org.
{{</highlight>}}
1. জোন একটিভেট করা
{{<highlight named>}}
zone "util.net.eu.org" {
	type master;
	file "/var/lib/bind/util.net.eu.org";
	allow-update {localhost;};
};

zone "163.86.45.in-addr.arpa" {
	type master;
	file "/etc/bind/zones/163.86.45.in-addr.arpa";
};
{{</highlight>}}

1. বাইন্ড রিলোড করা
{{<highlight bash>}}
service named reload
# or
systemctl reload named
{{</highlight>}}

### ডোমেইন রেজিস্টার

[এখানে][dns-reg] নতুন ডোমেইন রেজিস্টার করতে হবে।
1. `Complete domain name` বক্সে তোমার পছন্দের <abbr title="Fully Qualified Domain Name">FQDN</abbr> লিখতে হবে(EU.ORG সহ)।
2. `Name servers` ফর্মে `NameN`/`IPn` বক্সে নেমসার্ভার এর <abbr title="Fully Qualified Domain Name">FQDN</abbr> আর আইপি অ্যাড্রেস লিখতে হবে।

এখন সাবমিট করলে ডোমেইন রেজিস্ট্রেশন শেষ(ডোমেইন ম্যানুয়াল ভেরিফিকেশন + প্রোপাগেট করতে মোটামুটি ১ সপ্তা থেকে ১ মাস লাগে)

## letsencrypt.org এস.এস.এল সার্টিফিকেট
এর জন্য `uacme` ইন্সটল করা লাগবে

### রেজিস্ট্রেশন
{{<highlight bash>}}
uacme -v new [email]
{{</highlight>}} 

### সার্টিফিকেট
{{<highlight bash>}}
/usr/bin/uacme -vv -h /usr/share/uacme/nsupdate.sh issue domain.eu.org \*.domain.eu.org
{{</highlight>}}

### অটোমেটেড সার্টিফিকেট রিনিউয়াল

#### সিস্টেমডি সার্ভিস
{{<highlight service>}}
# /etc/systemd/system/uacme@.service
[Unit]
Description=Update %i ssl certs
Documentation=man:uacme(1)

[Service]
ExecStart=/usr/bin/uacme -vvvv -h /usr/share/uacme/nsupdate.sh issue %i *.%i
EnvironmentFile=-/etc/uacme/keys/%i
SuccessExitStatus=1
{{</highlight>}}

#### সিস্টেমডি টাইমার
{{<highlight timer>}}
# /etc/systemd/system/uacme@.timer
[Unit]
Description=Update %i ssl certs monthly
Documentation=man:uacme(1)

[Timer]
OnCalendar=monthly
Persistent=true
RandomizedDelaySec=30m

[Install]
WantedBy=timers.target
{{</highlight>}}

[nic]: //nic.eu.org
[doc]: //nic.eu.org/register.html
[dns-doc]: //nic.eu.org/dns-hosting.html
[GC]: //soa.granitecanyon.com/
[cloudns]: //www.cloudns.net/
[reg]: //nic.eu.org/arf/en/
[dns-reg]: https://nic.eu.org/arf/en/domain/new/
