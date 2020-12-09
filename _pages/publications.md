---
layout: page
permalink: /publications/
title: publications
description: to be updated soon...
years: []
# years:  [1956, 1950, 1935, 1905]
nav: true
---
<div class="publications">
{% for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}

<div>
