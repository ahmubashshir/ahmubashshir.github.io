---
title:  "র‍্যাম থেকে nginx এর কনফিগ ডাম্প করা"
date:   2023-08-26
tags:
- nginx
- awk
- gdb
series:
- Tutorials
---

ঘটনা বেশি দিন আগের না... গত সপ্তায় nginx এর কনফিগ এডিট করতে গিয়া `sed -nEi '<regex>' /etc/nginx/sites-enabled/*` মাইরা বসছিলাম... আর যা হওয়ার তাই হইল... পুরা কনফিগ উধাও... এখন ext4magic দিয়া যে রিকভার করা যাবে তাও কনফার্ম না  🙃️

কী করা যায়? দ্বারস্থ হইলাম গুরু <abbr title="Stack Overflow">স্তুপাধিক্যের</abbr> ভাই <abbr title="ServerFault">সেবকভঙ্গের</abbr>[^1]। উনার আরেক <abbr title="User">মুরিদের</abbr> কাছ থেকে জানা গেল যে nginx এর মেমোরি ডাম্প করলে ওইখানে বাইনারি ডাটার সাথে কনফিগও খিচুড়ি পাকায় থাকে... করলাম গদব(gdb) দিয়া র‍্যাম ডাম্প... `strings mem_*` দিয়া দেখি কনফিগ ফাইলের টেক্সট আছে... সাথে ফাংশন নেম(elf symbols) ও ডাম্প করতেছে... এইবার সাহায্যে আসলেন আরেক মুরিদ... উনি আবার আওকে(awk) ওস্তাদ... উনি যেই স্ক্রিপ্টটা দিলেন ওইটা রান করার পরে মোটামুটি সুন্দর একটা কনফিগ ডাম্প পাইলাম... বাট সব কনফিগ এক ফাইলে... পরে সব পার্ট আলাদা ফাইলে সেভ করার পরে কাজ হইল...

এইবার কাজের জিনিসে আসি... প্রথম পার্ট (nginx এর র‍্যাম ডাম্প নেয়া[^2])

```bash
# Set pid of nginx master process here
pid=8192

# generate gdb commands from the process's memory mappings using awk
cat /proc/$pid/maps | awk '$6 !~ "^/" {split ($1,addrs,"-"); print "dump memory mem_" addrs[1] " 0x" addrs[1] " 0x" addrs[2] ;}END{print "quit"}' > gdb-commands

# use gdb with the -x option to dump these memory regions to mem_* files
gdb -p $pid -x gdb-commands

# look for some (any) nginx.conf text
grep worker_connections mem_*
grep server_name mem_*
```

সেকেন্ড পার্ট (কনফিগ এক্সট্র্যাক্ট করা[^3])

```gawk
#!/usr/bin/awk -f
### Setup
# We're searching for a keyword followed by an open brace to start
# And the a close brace at the start of a line to end
# Also include commented sections, cause otherwise they look funny
BEGIN {
  start="[[:alpha:]_#]+ \\{$";
  end="^#?}"
}

# Shortcut to extract a regex pattern from $0
function extract(ere) { return substr($0, match($0, ere), RLENGTH) }

# Check for end conditions first
# This way we end the section before we print below

# For the primary end condition, print out the matched bit
$0 ~ end { print extract(end); go=0}
# And a safety stop: bail on any non-printable lower-ASCII characters
/[\x00-\x08\x0e-\x19]/ { go=0 }

# If we're in a section, print the line!
go {print}

# Otherwise, check for our starting condition
# If we find it, print just that bit and turn on our flag
!go && $0 ~ start {
  go=1;
  print "### Extracted from memory dump:";
  print extract(start)
}
```

পুনশ্চ: এইখানে একটা টুইস্ট আছে... যেইটা আমি আগে খেয়াল করলে এত প্যারা নিতে হইত না...
{{<spoiler>}}আমি ভুলে গেছিলাম যে `/etc/nginx/sites-enabled` ডিরেক্টরিতে নরমালি সব ফাইল `/etc/nginx/sites-available` থেকে লিঙ্ক করা থাকে... এত প্যারা না নিয়ে `ln -s` মারলেই হইত 😁️{{</spoiler>}}

[^1]: https://serverfault.com/q/361421
[^2]: https://serverfault.com/a/361465
[^3]: https://serverfault.com/a/1090838
