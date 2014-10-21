from icalendar import Calendar, Event
from dateutil.tz import tzlocal
import pytz
import urllib2

#url='https://www.google.com/calendar/ical/5d3cfgd5sqi3t4htn24bgio9ds%40group.calendar.google.com/public/basic.ics'
#data = urllib2.urlopen(url).read()
of=open('talks.ics')
data = of.read()
of.close()
cal = Calendar.from_ical(data)
localtimezone = tzlocal()
events = []

for k in cal.walk():
    if  k.name == 'VEVENT' :
        #print k['DTSTART'].
        #print k['DTEND']
        start_date = k.decoded('dtstart').astimezone(localtimezone)
        end_date = k.decoded('dtend').astimezone(localtimezone)
        location =  k['LOCATION']
        summary=  k['SUMMARY']

        #,k.decoded('dtstart'),k.decoded('dtend')
        events.append({
            "summary": summary,
            "start": start_date,
            "end": end_date,
            #"raw" : k,            
            "location": location,
        })


columns =  [ "summary",
             "start",
             "end",
             "location"]

table = []
for x in (sorted(events, key=lambda t: t["start"])):
    row = []
    for c in columns :
        v = x[c]
        row.append(v)
    table.append(row)
print table
