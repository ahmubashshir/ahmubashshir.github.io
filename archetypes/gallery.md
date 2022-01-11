---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
description:
images:
categories:
- Gallery
tags:
- Photography
- Hobby
- Gallery
images:
series:
- Gallery
---
{{% photoswipe %}}

{{<gallery caption-effect="fade">}}
{{</gallery>}}
