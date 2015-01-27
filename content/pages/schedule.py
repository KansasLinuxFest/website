from icalendar import Calendar, Event
from dateutil.tz import tzlocal
import pytz
import urllib2
import pprint 

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

next_event_id = 1
def event(x) :
    global next_event_id
    #pprint.pprint(x)
    next_event_id = next_event_id +1
    summary = str(x['summary'])
    return {
        "id": next_event_id,
        "title": summary,
        "url": "/events/%s" % summary ,
        "class": "event",
        "start": int(x['start'].strftime("%s")) * 1000,
        "end"  : int(x['end'].strftime("%s")) * 1000
    }

json_events = {
    "success": 1,
    "result": [	]
}



for x in (sorted(events, key=lambda t: t["start"])):
    json_events['result'].append(event(x))

pprint.pprint(json_events)


