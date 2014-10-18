#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'James Michael DuPont'
SITENAME = "Kansas Linux Fest"
SITEURL = 'http://kansaslinuxfest.us'
TIMEZONE = "America/CST"

# can be useful in development, but set to False when you're ready to publish
RELATIVE_URLS = True

GITHUB_URL = 'https://github.com/KansasLinuxFest/website/'
DISQUS_SITENAME = "kansaslinuxfest"
PDF_GENERATOR = False
REVERSE_CATEGORY_ORDER = True
LOCALE = "C"
DEFAULT_PAGINATION = 4
DEFAULT_DATE = (2012, 3, 2, 14, 1, 1)
MENUITEMS= ()
FEED_ALL_RSS = 'feeds/all.rss.xml'
CATEGORY_FEED_RSS = 'feeds/%s.rss.xml'

LINKS = (('FSF', 'http://ww.fsf.org'),
         ('Free/Libre Open Source and Open Knowledge Association of Kansas', "http://openkansas.us/"),)

SOCIAL = (('twitter', 'https://twitter.com/OpenSrcKansas'),
          ('facebook', 'https://www.facebook.com/kansaslinuxfest'),
          ('github', 'https://github.com/kansaslinuxfest'),
          ('lanyrd','http://lanyrd.com/2015/klf15'),
      )


# global metadata to all the contents
DEFAULT_METADATA = {
    'State' :'Kansas',  
    'Topic' : 'Linux', 
    "Location": 'Lawrence'
}

# path-specific metadata
EXTRA_PATH_METADATA = {
    'extra/robots.txt': {'path': 'robots.txt'},
    }

# static paths will be copied without parsing their contents
STATIC_PATHS = [
    'pictures',
    'extra/robots.txt',
    ]

# custom page generated with a jinja2 template
#TEMPLATE_PAGES = {'pages/jinja2_template.html': 'jinja2_template.html'}

TIMEZONE = 'Europe/Paris'

DEFAULT_LANG = u'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
