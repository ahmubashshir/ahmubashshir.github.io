+++
title = 'ডেপ্লয় হিউগো - গিটহাব-পেজ'
date = '2022-02-07'
tags = [ 'Hugo', 'GitHub', 'Actions', 'CI/CD', 'github-actions', 'gh-pages' ]
series = ['Tutorials' ]
+++
### গৌরচন্দ্রিকা
গিটহাব-পেজ এর সাথে হিউগো ইউজ করলে সাধারণত একটা ওয়ার্কফ্লো দিয়ে প্রথমে জেনারেট করা সাইটটা gh-pages ব্রাঞ্চে পুশ করে, এরপরে গিটহাব
gh-pages ব্রাঞ্চ থেকে সাইটে ডেপ্লয় করে। হয়তো খেয়াল করেছ যে গিটহাব এখন একটা অটোজেনারেটেড অ্যাকশন দিয়ে  gh-pages ব্রাঞ্চ ডেপ্লয় করে।

কৌতূহলবশত অ্যাকশনটা কিভাবে কাজ করে তা বের করতে গিয়ে আমি যে ওয়ার্কফ্লোটা লিখি সেটা দিয়ে আমি এখন আমার ব্লগ ডেপ্লয় করেছি, নিচের ডায়াগ্রামটাতে
আগের ওয়ার্কফ্লোর সাথে বর্তমান ওয়ার্কফ্লোর তুলনা দেখতে পারবে।
{{<graphviz file="actions.dot" title="হিউগো থেকে গিটহাব-পেজে ডেপ্লয়<br />নীল: gh-pages ব্রাঞ্চে পুশ করে ডেপ্লয়<br /> সবুজ: সরাসরি master/main ব্রাঞ্চ থেকে ডেপ্লয়" type="dot" />}}

### আমার খাটনির ফিরিস্তি
`pages-build-deployment` ওয়ার্কফ্লোর লগ দেখতে গিয়ে দেখতে পেলাম যে এখানে নতুন দুইটা অ্যাকশন ইউজ করতেছে,
`actions/upload-artifact` আর `actions/deploy-pages`। ঐ অ্যাকশন দুইটার রিপোতে কাজ চালানোর ডক দেয়া,
বাকিটা `action.yml` ফাইল থেকে দেখে মোটামুটি বুঝলাম যে অ্যাকশন দুইটা কিভাবে কাজে লাগানো যায়।

আমার আগের ওয়ার্কফ্লোকে টেমপ্লেট হিসাবে ইউজ করে নতুন একটা ওয়ার্কফ্লো লিখলাম অ্যাকশন গুলা ইউজ করে... সব ভালোই চলতেছিল,
বাগড়া দিল গিটহাব এপিআই, বলল যে আমার ওয়ার্কফ্লোর ডেপ্লয় পারমিশন নাই, দ্বারস্থ হইলাম গুরু <abbr title="Stack Overflow">স্তূপাধিক্যের</abbr>।<br />
উনি বললেন যে নতুন দুইটা পারমিশন লাগবে, `id-token` আর `pages`; দিলাম ডেপ্লয় জবে এই দুইটা পারমিশন,
বত্ব... এর মধ্যে কিন্তু আমি ওয়ার্কফ্লোটাকে দুইটা জবে ভাগ করছি, _বিল্ড_ আর _ডেপ্লয়_।

ভালো কথা, পারমিশন দিলাম, বিল্ড হইল, ডেপ্লয় হইতে গিয়া দেখায় যে ডেপ্লয় করতে পারতেছে না, একটা বিদঘুটে এরর দেখায় ডেপ্লয় ফেইল করে।
গুরুকে আবার জিজ্ঞেস করলাম, এইটার মানে কী? সমস্যাটা কই? গুরুও জানেননা ঝামেলাটা কই লাগছে। এইদিকে গিটহাব কি করছে,
এরর মেসেজের সাথে গিটহাব ডকের একটা লিঙ্ক দেয়, কিন্তু এমন লিঙ্ক যে যেইদিকে যাই, খালি ৪০৪ দেখি।

ভাবলাম, নাহ... যেইটুকু হইছে, হইছে... বাকিটা পরে দেখুম।

### দুই সপ্তাহ পর...
আবার ডেপ্লয় করতে গিয়া দেখি যে এইবারের এরর মেসেজ অন্যরকম, এইবার বলতেছে যে মাস্টার ব্রাঞ্চ থেকে গিটহাব-পেজ এনভায়রনমেন্টে ডেপ্লয়
করার পারমিশন নাই। আমিও কম যাই না, রিপো সেটিংস থেকে এনভায়রনমেন্ট সেটিংসে গিয়া মাস্টার ব্রাঞ্চকে পেজ ব্রাঞ্চ হিসাবে সেট করলাম।

এইবার দেখি আরেক প্যারা। ডেপ্লয় হয়, কিন্তু গিটহাব জেকিল দিয়া সাইট জেনারেট করে আমার হিউগো সাইটকে ওভাররাইট করে।

আবার `gh-pages` ব্রাঞ্চ বানাইলাম (এইবার অরফান হিসাবে)। এরপরে ঐ ব্রাঞ্চে `.nojekyll` ফাইল বানায় কমিট করে পুশ করলাম।
এনভায়রনমেন্ট প্রোটেকশন রুলসে গিয়া `master` ব্রাঞ্চ অ্যাড করলাম। পুশ করলাম, ডেপ্লয় ও হইল... সাইটে গিয়া দেখতেও পাইলাম যে
সব ঠিক আছে, কিন্তু ২ মিনিট পরে দেখি গিটহাব আবার ঝামেলা বাধাইছে, আমার সাইটকে রিডমি দিয়ে রিপ্লেস করে দিছে।

এইবার  `master` ব্রাঞ্চেও `.nojekyll` কমিট করলাম। এরপরে ঠিকঠাক ডেপ্লয় হইল

**দি এন্ড?**<br />
_নাহ_, এতক্ষণ গৌরচন্দ্রিকা দিলাম, এত খাটাখাটনির রেজাল্ট এত সহজে শেয়ার করব? এত সোজা??

### আসল বস্তু
1. প্রিপারেশন:
   1. আগের `gh-pages` ব্রাঞ্চ ডিলিট করা।
    {{<highlight sh>}}
git push origin :gh-pages
git branch -Dq gh-pages{{</highlight>}}
   1. ডামি `gh-pages` ব্রাঞ্চ পুশ করা। 
      {{<highlight sh>}}
git checkout --orphan gh-pages
touch .nojekyll
git add .nojekyll
git commit -m 'Init dummy branch'
git checkout master # or main{{</highlight>}}

   1. `https://github.com/<owner>/<repo>/settings/environments` লিঙ্কে গিয়ে `github-pages` এনভায়রনমেন্টে যাওয়া,
       এরপরে `Deployment branches` সেকশনে `Selected branches` সিলেক্ট করে `master` বা `main` ব্রাঞ্চ অ্যাড করা।
   1. হেড(master/main) ব্রাঞ্চে `.nojekyll` ফাইল কমিট করা।
      {{<highlight sh>}}
touch .nojekyll
git add .nojekyll
git commit -m 'github, ignore this branch'{{</highlight>}}

1. ওয়ার্কফ্লো বানানো
   {{<highlight yaml>}}
name: gohugo.io
on:
    workflow_dispatch:
    push:
        branches:
        - master
jobs:
    build:
        runs-on: ubuntu-latest
        steps:
        - name: checkout
          uses: actions/checkout@v2
          with:
              fetch-depth: 0
              submodules: true
        - name: prepare(hugo)
          uses: peaceiris/actions-hugo@v2
          with:
              hugo-version: latest
        - name: init-cache(hugo)
          uses: actions/cache@v2
          with:
              key: ${{ runner.os }}-hugomod-${{ hashFiles('go.sum') }}
              path: /tmp/hugo_cache
              restore-keys: ${{ runner.os }}-hugomod-
        - name: build(site)
          run: |
              hugo --minify --environment production
              tar --dereference --hard-dereference --directory public -cvf artifact.tar .
        - name: upload(site)
          uses: actions/upload-artifact@main
          with:
              name: github-pages
              path: ./artifact.tar
              if-no-files-found: warn
   deploy:
       runs-on: ubuntu-latest
       environment: github-pages
       needs: build
       permissions:
           id-token: write
           contents: read
           pages: write
       steps:
       - name: deploy(site)
         uses: actions/deploy-pages@master
         with:
             token: ${{ secrets.GITHUB_TOKEN }}
             timeout: 600000
             error_count: 10
             reporting_interval: 1000{{</highlight>}}
1. পুশ, এনজয়...

-- দি এন্ড --
<!-- vim: ft=markdown:ts=3:et: -->
