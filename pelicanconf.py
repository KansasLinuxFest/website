#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'Free/Libre Open Source and Open Knowledge Association of Kansas'
SITENAME = "Kansas Linux Fest"
SITELOGO = 'images/klf15logo_compact.png'
SITEURL = 'http://kansaslinuxfest.us'
SITELOGO_SIZE = 24
TIMEZONE = "America/Chicago"

DEFAULT_CATEGORY='main'

#THEME = 'pelican-bootstrap3-components'
THEME = './pelican-themes/pelican-bootstrap3/'

# can be useful in development, but set to False when you're ready to publish
RELATIVE_URLS = True

GITHUB_URL = 'https://github.com/KansasLinuxFest/website/'

MD_EXTENSIONS = ['toc(permalink=true)']
# from markdown.extensions.codehilite import CodeHiliteExtension
# from markdown.extensions.toc import TocExtension
# MD_EXTENSIONS = [
#     CodeHiliteExtension(css_class='highlight'),
#     TocExtension(permalink=True, anchorlink=True, ),
#     'markdown.extensions.extra',
# ]


DISQUS_SITENAME = "kansaslinuxfest"
PDF_GENERATOR = False
REVERSE_CATEGORY_ORDER = True
LOCALE = "C"
DEFAULT_PAGINATION = 4
DEFAULT_DATE = (2012, 3, 2, 14, 1, 1)
MENUITEMS= ()

#LINKS = (('FSF', 'http://ww.fsf.org'),
#         ('Free/Libre Open Source and Open Knowledge Association of Kansas', "http://openkansas.us/"),)


CC_LICENSE='CC-BY-SA'

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
    'theme/images', 
    'images',
    'pictures',
    'extra/robots.txt',
    ]

# custom page generated with a jinja2 template
#TEMPLATE_PAGES = {'pages/jinja2_template.html': 'jinja2_template.html'}

DEFAULT_LANG = u'en'

# Feed generation is usually not desired when developin
FEED_ALL_RSS = 'feeds/all.rss.xml'
CATEGORY_FEED_RSS = 'feeds/%s.rss.xml'

#FEED_ALL_ATOM = True
#CATEGORY_FEED_ATOM = True
#TRANSLATION_FEED_ATOM = None
#AUTHOR_FEED_ATOM = None
#AUTHOR_FEED_RSS = None

DEFAULT_PAGINATION = 10

# plugins :
PLUGIN_PATHS = ['pelican-plugins']
PLUGINS = ['sitemap', 'extract_toc', 'tipue_search', 'googleplus_comments', 'ical', 'pdf', 'share_post', 'pelican-bootstrap3-components', 'extract_toc' ]

# settings for plugins
SITEMAP = {'format': "xml"}


# def sidebar_filter(x):
#     return x

# JINJA_FILTERS= {
#     'sidebar' : sidebar_filter
# }

SHOW_ARTICLE_AUTHOR=False
GOOGLE_ANALYTICS_UNIVERSAL = 'UA-54320514-2'
GOOGLE_ANALYTICS_UNIVERSAL_PROPERTY = 'auto'

#twitter
TWITTER_CARDS=True
TWITTER_USERNAME='opensrckansas'

#add this
ADDTHIS_PROFILE='ra-5443a3056328c49c'

DISPLAY_TAGS_INLINE=True
DISPLAY_TAGS_ON_SIDEBAR=True
DISPLAY_CATEGORIES_ON_SIDEBAR=True
DISPLAY_BREADCRUMBS=True


#publish the website to http://kansaslinuxfest.github.io/website-qa
 
BOOTSTRAP_COMPONENTS_PATHS= ['bootstrap-components']
BOOTSTRAP_COMPONENTS=['bootstrap-calendar',]
