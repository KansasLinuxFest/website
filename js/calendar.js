/**
 * Bootstrap based calendar full view.
 *
 * https://github.com/Serhioromano/bootstrap-calendar
 *
 * User: Sergey Romanov <serg4172@mail.ru>
 */
"use strict";

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}
// Production steps of ECMA-262, Edition 5, 15.4.4.21
// Reference: http://es5.github.io/#x15.4.4.21
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function(callback /*, initialValue*/) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.reduce called on null or undefined');
    }
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    var t = Object(this), len = t.length >>> 0, k = 0, value;
    if (arguments.length == 2) {
      value = arguments[1];
    } else {
      while (k < len && ! k in t) {
        k++;
      }
      if (k >= len) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      value = t[k++];
    }
    for (; k < len; k++) {
      if (k in t) {
        value = callback(value, t[k], k, t);
      }
    }
    return value;
  };
}
Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
};
Date.prototype.getMonthFormatted = function() {
  var month = this.getMonth() + 1;
  return month < 10 ? '0' + month : month;
};
Date.prototype.getDateFormatted = function() {
  var date = this.getDate();
  return date < 10 ? '0' + date : date;
};
if(!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}
if(!String.prototype.formatNum) {
  String.prototype.formatNum = function(decimal) {
    var r = "" + this;
    while(r.length < decimal)
      r = "0" + r;
    return r;
  };
}

(function($) {

  var defaults = {
    // Width of the calendar
    width: '100%',
    // Initial view (can be 'month', 'week', 'day')
    view: 'month',
    // Initial date. No matter month, week or day this will be a starting point. Can be 'now' or a date in format 'yyyy-mm-dd'
    day: 'now',
    // Day Start time and end time with time intervals. Time split 10, 15 or 30.
    time_start: '06:00',
    time_end: '22:00',
    time_split: '30',
    // Source of events data. It can be one of the following:
    // - URL to return JSON list of events in special format.
    //   {success:1, result: [....]} or for error {success:0, error:'Something terrible happened'}
    //   events: [...] as described in events property description
    //   The start and end variables will be sent to this url
    // - A function that received the start and end date, and that
    //   returns an array of events (as described in events property description)
    // - An array containing the events
    events_source: '',
    classes: {
      months: {
        inmonth: 'cal-day-inmonth',
        outmonth: 'cal-day-outmonth',
        saturday: 'cal-day-weekend',
        sunday: 'cal-day-weekend',
        holidays: 'cal-day-holiday',
        today: 'cal-day-today'
      },
      week: {
        workday: 'cal-day-workday',
        saturday: 'cal-day-weekend',
        sunday: 'cal-day-weekend',
        holidays: 'cal-day-holiday',
        today: 'cal-day-today'
      }
    },
    // ID of the element of modal window. If set, events URLs will be opened in modal windows.
    modal: null,
    //	modal handling setting, one of "iframe", "ajax" or "template"
    modal_type: "iframe",
    //	function to set modal title, will be passed the event as a parameter
    modal_title: null,
    views: {
      year: {
        slide_events: true,
        enable: true
      },
      month: {
        slide_events: true,
        enable: true
      },
      week: {
        enable: true,
        group: false
      },
      day: {
        enable: true,
        group: false
      }
    },
    merge_holidays: false,
    templates: {
      "day": _.template('<div id="cal-day-box"><div class="row-fluid clearfix cal-row-head"><div class="span1 col-xs-1 cal-cell"><%= cal.locale.time %></div><div class="span11 col-xs-11 cal-cell"><%= cal.locale.events %></div></div><% if(all_day.length) {%><div class="row-fluid clearfix cal-day-hour"><div class="span1 col-xs-1"><b><%= cal.locale.all_day %></b></div><div class="span11 col-xs-11"><% _.each(all_day, function(event){ %><div class="day-highlight dh-<%= event[\'class\'] %>"><a href="<%= event.url ? event.url : \'javascript:void(0)\' %>" data-event-id="<%= event.id %>"data-event-class="<%= event[\'class\'] %>" class="event-item"><%= event.title %></a></div><% }); %></div></div><% }; %><% if(before_time.length) {%><div class="row-fluid clearfix cal-day-hour"><div class="span1 col-xs-3"><b><%= cal.locale.before_time %></b></div><div class="span5 col-xs-5"><% _.each(before_time, function(event){ %><div class="day-highlight dh-<%= event[\'class\'] %>"><span class="cal-hours pull-right"><%= event.end_hour %></span><a href="<%= event.url ? event.url : \'javascript:void(0)\' %>" data-event-id="<%= event.id %>"data-event-class="<%= event[\'class\'] %>" class="event-item"><%= event.title %></a></div><% }); %></div></div><% }; %><div id="cal-day-panel" class="clearfix"><div id="cal-day-panel-hour"><% for(i = 0; i < hours; i++){ %><div class="cal-day-hour"><% for(l = 0; l < cal._hour_min(i); l++){ %><div class="row-fluid cal-day-hour-part"><div class="span1 col-xs-1"><b><%= cal._hour(i, l) %></b></div><div class="span11 col-xs-11"></div></div><% }; %></div><% }; %></div><% _.each(by_hour, function(event){ %><div class="pull-left day-event day-highlight dh-<%= event[\'class\'] %>" style="margin-top: <%= (event.top * 30) %>px; height: <%= (event.lines * 30) %>px"><span class="cal-hours"><%= event.start_hour %> - <%= event.end_hour %></span><a href="<%= event.url ? event.url : \'javascript:void(0)\' %>" data-event-id="<%= event.id %>"data-event-class="<%= event[\'class\'] %>" class="event-item"><%= event.title %></a></div><% }); %></div><% if(after_time.length) {%><div class="row-fluid clearfix cal-day-hour"><div class="span1 col-xs-3"><b><%= cal.locale.after_time %></b></div><div class="span11 col-xs-9"><% _.each(after_time, function(event){ %><div class="day-highlight dh-<%= event[\'class\'] %>"><span class="cal-hours"><%= event.start_hour %></span><a href="<%= event.url ? event.url : \'javascript:void(0)\' %>" data-event-id="<%= event.id %>"data-event-class="<%= event[\'class\'] %>" class="event-item"><%= event.title %></a></div><% }); %></div></div><% }; %></div>'),
      "events-list": _.template('<span id="cal-slide-tick" style="display: none"></span><div id="cal-slide-content" class="cal-event-list"><ul class="unstyled list-unstyled"><% _.each(events, function(event) { %><li><span class="pull-left event <%= event[\'class\'] %>"></span>&nbsp;<a href="<%= event.url ? event.url : \'javascript:void(0)\' %>" data-event-id="<%= event.id %>"data-event-class="<%= event[\'class\'] %>" class="event-item"><%= event.title %></a></li><% }) %></ul></div>'),
      "modal": _.template('<% 	event.date_start = new Date(parseInt(event.start));event.date_end = new Date(parseInt(event.end)); %><div id = "event-meta" class  = "pull-right"><span>Starts on <%= event.date_start.date() %> <%= calendar.locale["m" + event.date_start.month()] %> <%= event.date_start.year() %>, at <%= event.date_start.format(\'hh:mm\') %> <i class = "icon-time"></i></span><br /><span>Ends on <%= event.date_end.date() %> <%= calendar.locale["m" + event.date_end.month()] %> <%= event.date_end.year() %> at <%= event.date_end.format(\'hh:mm\') %> <i class = "icon-time"></i></span><br /></div><div style = "margin: 10px 0"><a href = "<%= event.url %>" class = "btn btn-primary"><i class = "icon-calendar"></i> More info</a></div>'),
      "month": _.template('<div class="cal-row-fluid cal-row-head"><% _.each(days_name, function(name){ %><div class="cal-cell1"><%= name %></div><% }) %></div><div class="cal-month-box"><% for(i = 0; i < 6; i++) { %><% if(cal.stop_cycling == true) break; %><div class="cal-row-fluid cal-before-eventlist"><div class="cal-cell1 cal-cell" data-cal-row="-day1"><%= cal._day(i, day++) %></div><div class="cal-cell1 cal-cell" data-cal-row="-day2"><%= cal._day(i, day++) %></div><div class="cal-cell1 cal-cell" data-cal-row="-day3"><%= cal._day(i, day++) %></div><div class="cal-cell1 cal-cell" data-cal-row="-day4"><%= cal._day(i, day++) %></div><div class="cal-cell1 cal-cell" data-cal-row="-day5"><%= cal._day(i, day++) %></div><div class="cal-cell1 cal-cell" data-cal-row="-day6"><%= cal._day(i, day++) %></div><div class="cal-cell1 cal-cell" data-cal-row="-day7"><%= cal._day(i, day++) %></div></div><% } %></div>'),
      "month-day": _.template('<div class="cal-month-day <%= cls %>"><span class="pull-right" data-cal-date="<%= data_day %>" data-cal-view="day" data-toggle="tooltip" title="<%= tooltip %>"><%= day %></span><% if (events.length > 0) { %><div class="events-list" data-cal-start="<%= start %>" data-cal-end="<%= end %>"><% _.each(events, function(event) { %><a href="<%= event.url ? event.url : \'javascript:void(0)\' %>" data-event-id="<%= event.id %>" data-event-class="<%= event[\'class\'] %>"class="pull-left event <%= event[\'class\'] %>" data-toggle="tooltip"title="<%= event.title %>"></a><% }); %></div><% } %></div>'),
      "week": _.template('<div class="cal-week-box"><div class="cal-offset1 cal-column"></div><div class="cal-offset2 cal-column"></div><div class="cal-offset3 cal-column"></div><div class="cal-offset4 cal-column"></div><div class="cal-offset5 cal-column"></div><div class="cal-offset6 cal-column"></div><div class="cal-row-fluid cal-row-head"><% _.each(days_name, function(name) { %><div class="cal-cell1 <%= cal._getDayClass(\'week\', start) %>" data-toggle="tooltip" title="<%= cal._getHolidayName(start) %>"><%= name %><br><small><span data-cal-date="<%= start.format(\'YYYY-MM-DD\') %>" data-cal-view="day"><%= start.date() %> <%= cal.locale[\'ms\' + start.month()] %></span></small></div><% start = start.clone().date(start.date() + 1); %><% }) %></div><hr><%= cal._week() %></div>'),
      "week-days": _.template('<% for (var group in events) { %><div class="group event-info"><%= group%></div><% _.each(events[group], function(event){ %><div class="cal-row-fluid"><div class="cal-cell<%= event.days%> cal-offset<%= event.start_day %> day-highlight dh-<%= event[\'class\'] %>" data-event-class="<%= event[\'class\'] %>"><a href="<%= event.url ? event.url : \'javascript:void(0)\' %>" data-event-id="<%= event.id %>" class="cal-event-week event<%= event.id %>"><%= event.title %></a></div></div><% }); %><% } %>'),
      "year": _.template('<div class="cal-year-box"><div class="row row-fluid cal-before-eventlist"><div class="span3 col-md-3 cal-cell" data-cal-row="-month1"><%= cal._month(0) %></div><div class="span3 col-md-3 cal-cell" data-cal-row="-month2"><%= cal._month(1) %></div><div class="span3 col-md-3 cal-cell" data-cal-row="-month3"><%= cal._month(2) %></div><div class="span3 col-md-3 cal-cell" data-cal-row="-month4"><%= cal._month(3) %></div></div><div class="row row-fluid cal-before-eventlist"><div class="span3 col-md-3 cal-cell" data-cal-row="-month1"><%= cal._month(4) %></div><div class="span3 col-md-3 cal-cell" data-cal-row="-month2"><%= cal._month(5) %></div><div class="span3 col-md-3 cal-cell" data-cal-row="-month3"><%= cal._month(6) %></div><div class="span3 col-md-3 cal-cell" data-cal-row="-month4"><%= cal._month(7) %></div></div><div class="row row-fluid cal-before-eventlist"><div class="span3 col-md-3 cal-cell" data-cal-row="-month1"><%= cal._month(8) %></div><div class="span3 col-md-3 cal-cell" data-cal-row="-month2"><%= cal._month(9) %></div><div class="span3 col-md-3 cal-cell" data-cal-row="-month3"><%= cal._month(10) %></div><div class="span3 col-md-3 cal-cell" data-cal-row="-month4"><%= cal._month(11) %></div></div></div>'),
      "year-month": _.template('<span class="pull-right" data-cal-date="<%= data_day %>" data-cal-view="month"><%= month_name %></span><% if (events.length > 0) { %><small class="cal-events-num badge badge-important pull-left"><%= events.length %></small><div class="hide events-list" data-cal-start="<%= start %>" data-cal-end="<%= end %>"><% _.each(events, function(event) { %><a href="<%= event.url ? event.url : \'javascript:void(0)\' %>" data-event-id="<%= event.id %>" data-event-class="<%= event[\'class\'] %>" class="pull-left event <%= event[\'class\'] %> event<%= event.id %>" data-toggle="tooltip" title="<%= event.title %>"></a><% }); %></div><% } %>')
    },
    // -------------------------------------------------------------
    // INTERNAL USE ONLY. DO NOT ASSIGN IT WILL BE OVERRIDDEN ANYWAY
    // -------------------------------------------------------------
    events: [],
    stop_cycling: false
  };

  var defaults_extended = {
    first_day: 2,
    holidays:  {
      // January 1
      '01-01':  "New Year's Day",
      // Third (+3*) Monday (1) in January (01)
      '01+3*1': "Birthday of Dr. Martin Luther King, Jr.",
      // Third (+3*) Monday (1) in February (02)
      '02+3*1': "Washington's Birthday",
      // Last (-1*) Monday (1) in May (05)
      '05-1*1': "Memorial Day",
      // July 4
      '04-07':  "Independence Day",
      // First (+1*) Monday (1) in September (09)
      '09+1*1': "Labor Day",
      // Second (+2*) Monday (1) in October (10)
      '10+2*1': "Columbus Day",
      // November 11
      '11-11':  "Veterans Day",
      // Fourth (+4*) Thursday (4) in November (11)
      '11+4*4': "Thanksgiving Day",
      // December 25
      '25-12':  "Christmas"
    }
  };

  var strings = {
    error_noview: 'Calendar: View {0} not found',
    error_dateformat: 'Calendar: Wrong date format {0}. Should be either "now" or "yyyy-mm-dd"',
    error_loadurl: 'Calendar: Event URL is not set',
    error_where: 'Calendar: Wrong navigation direction {0}. Can be only "next" or "prev" or "today"',
    error_timedevide: 'Calendar: Time split parameter should divide 60 without decimals. Something like 10, 15, 30',

    no_events_in_day: 'No events in this day.',

    title_year: '{0}',
    title_month: '{0} {1}',
    title_week: 'week {0} of {1}',
    title_day: '{0} {1} {2}, {3}',

    week: 'Week {0}',
    all_day: 'All day',
    time: 'Time',
    events: 'Events',
    before_time: 'Ends before timeline',
    after_time: 'Starts after timeline',


    m0: 'January',
    m1: 'February',
    m2: 'March',
    m3: 'April',
    m4: 'May',
    m5: 'June',
    m6: 'July',
    m7: 'August',
    m8: 'September',
    m9: 'October',
    m10: 'November',
    m11: 'December',

    ms0: 'Jan',
    ms1: 'Feb',
    ms2: 'Mar',
    ms3: 'Apr',
    ms4: 'May',
    ms5: 'Jun',
    ms6: 'Jul',
    ms7: 'Aug',
    ms8: 'Sep',
    ms9: 'Oct',
    ms10: 'Nov',
    ms11: 'Dec',

    d0: 'Sunday',
    d1: 'Monday',
    d2: 'Tuesday',
    d3: 'Wednesday',
    d4: 'Thursday',
    d5: 'Friday',
    d6: 'Saturday'
  };

  var browser_timezone = '';
  try {
    if($.type(window.jstz) == 'object' && $.type(jstz.determine) == 'function') {
      browser_timezone = jstz.determine().name();
      if($.type(browser_timezone) !== 'string') {
        browser_timezone = '';
      }
    }
  }
  catch(e) {
  }

  function buildEventsUrl(events_url, data) {
    var url = events_url;
    url = url.replace('%FROM%', data.from);
    url = url.replace('%TO%', data.to);
    url = url.replace('%BROWSER_TIMEZONE%', data.browser_timezone);
    return url;
  }

  function getExtentedOption(cal, option_name) {
    var fromOptions = (cal.options[option_name] != null) ? cal.options[option_name] : null;
    var fromLanguage = (cal.locale[option_name] != null) ? cal.locale[option_name] : null;
    if((option_name == 'holidays') && cal.options.merge_holidays) {
      var holidays = {};
      $.extend(true, holidays, fromLanguage ? fromLanguage : defaults_extended.holidays);
      if(fromOptions) {
        $.extend(true, holidays, fromOptions);
      }
      return holidays;
    }
    else {
      if(fromOptions != null) {
        return fromOptions;
      }
      if(fromLanguage != null) {
        return fromLanguage;
      }
      return defaults_extended[option_name];
    }
  }

  function getHolidays(cal, year) {
    var hash = [];
    var holidays_def = getExtentedOption(cal, 'holidays');
    for(var k in holidays_def) {
      hash.push(k + ':' + holidays_def[k]);
    }
    hash.push(year);
    hash = hash.join('|');
    if(hash in getHolidays.cache) {
      return getHolidays.cache[hash];
    }
    var holidays = [];
    $.each(holidays_def, function(key, name) {
      var firstDay = null, lastDay = null, failed = false;
      $.each(key.split('>'), function(i, chunk) {
        var m, date = null;
        if(m = /^(\d\d)-(\d\d)$/.exec(chunk)) {
          date = new Date(year, parseInt(m[2], 10) - 1, parseInt(m[1], 10));
        }
        else if(m = /^(\d\d)-(\d\d)-(\d\d\d\d)$/.exec(chunk)) {
          if(parseInt(m[3], 10) == year) {
            date = new Date(year, parseInt(m[2], 10) - 1, parseInt(m[1], 10));
          }
        }
        else if(m = /^easter(([+\-])(\d+))?$/.exec(chunk)) {
          date = getEasterDate(year, m[1] ? parseInt(m[1], 10) : 0);
        }
        else if(m = /^(\d\d)([+\-])([1-5])\*([0-6])$/.exec(chunk)) {
          var month = parseInt(m[1], 10) - 1;
          var direction = m[2];
          var offset = parseInt(m[3]);
          var weekday = parseInt(m[4]);
          switch(direction) {
            case '+':
              var d = new Date(year, month, 1 - 7);
              while(d.getDay() != weekday) {
                d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
              }
              date = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7 * offset);
              break;
            case '-':
              var d = new Date(year, month + 1, 0 + 7);
              while(d.getDay() != weekday) {
                d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
              }
              date = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7 * offset);
              break;
          }
        }
        if(!date) {
          warn('Unknown holiday: ' + key);
          failed = true;
          return false;
        }
        switch(i) {
          case 0:
            firstDay = date;
            break;
          case 1:
            if(date.getTime() <= firstDay.getTime()) {
              warn('Unknown holiday: ' + key);
              failed = true;
              return false;
            }
            lastDay = date;
            break;
          default:
            warn('Unknown holiday: ' + key);
            failed = true;
            return false;
        }
      });
      if(!failed) {
        var days = [];
        if(lastDay) {
          for(var date = new Date(firstDay.getTime()); date.getTime() <= lastDay.getTime(); date.setDate(date.getDate() + 1)) {
            days.push(new Date(date.getTime()));
          }
        }
        else {
          days.push(firstDay);
        }
        holidays.push({name: name, days: days});
      }
    });
    getHolidays.cache[hash] = holidays;
    return getHolidays.cache[hash];
  }

  getHolidays.cache = {};

  function warn(message) {
    if($.type(window.console) == 'object' && $.type(window.console.warn) == 'function') {
      window.console.warn('[Bootstrap-Calendar] ' + message);
    }
  }

  function Calendar(params, context) {
    this.options = $.extend(true, {
      position: {
        start: moment(new Date()),
        end: moment(new Date())
      }
    }, defaults, params);
    this.setLanguage(this.options.language);
    this.context = context;

    context.css('width', this.options.width).addClass('cal-context');

    this.view();
    $(context).data('bs-calendar', this);
    return this;
  }

  Calendar.prototype.reload = function() {
    this.view();
  }

  Calendar.prototype.setOptions = function(object) {
    $.extend(this.options, object);
    if('language' in object) {
      this.setLanguage(object.language);
    }
    if('modal' in object) {
      this._update_modal();
    }
  }

  Calendar.prototype.setLanguage = function(lang) {
    if(window.calendar_languages && (lang in window.calendar_languages)) {
      this.locale = $.extend(true, {}, strings, calendar_languages[lang]);
      this.options.language = lang;
    } else {
      this.locale = strings;
      delete this.options.language;
    }
  }

  Calendar.prototype._render = function() {
    this.context.empty();
    this.stop_cycling = false;

    var data = {};
    data.cal = this;
    data.day = 1;

    // Getting list of days in a week in correct order. Works for month and week views
    if(getExtentedOption(this, 'first_day') == 1) {
      data.days_name = [this.locale.d1, this.locale.d2, this.locale.d3, this.locale.d4, this.locale.d5, this.locale.d6, this.locale.d0]
    } else {
      data.days_name = [this.locale.d0, this.locale.d1, this.locale.d2, this.locale.d3, this.locale.d4, this.locale.d5, this.locale.d6]
    }

    data.events = this.getEventsBetween(this.options.position.start, this.options.position.end);

    switch(this.options.view) {
      case 'month':
        break;
      case 'week':
        this._calculate_hour_minutes(data);
        break;
      case 'day':
        this._calculate_hour_minutes(data);
        // if (this.options.views.day.group) {
        //   data.events = this._groupEvents(data.events);
        // }
        break;
    }

    data.start = this.options.position.start;
    data.lang = this.locale;

    this.context.append(this.options.templates[this.options.view](data));
    this._update();
  };

  Calendar.prototype._calculate_hour_minutes = function(data) {
    var $self = this;
    var time_split = parseInt(this.options.time_split);
    var time_split_count = 60 / time_split;
    var time_split_hour = Math.min(time_split_count, 1);

    if(((time_split_count >= 1) && (time_split_count % 1 != 0)) || ((time_split_count < 1) && (1440 / time_split % 1 != 0))) {
      $.error(this.locale.error_timedevide);
    }

    var time_start = this.options.time_start.split(":");
    var time_end = this.options.time_end.split(":");

    data.hours = (parseInt(time_end[0]) - parseInt(time_start[0])) * time_split_hour;
    var lines = data.hours * time_split_count - parseInt(time_start[1]) / time_split;
    var ms_per_line = (60000 * time_split);

    var start = this.options.position.start.toDate();
    start.setHours(time_start[0]);
    start.setMinutes(time_start[1]);
    var end = this.options.position.end.toDate();
    end.setHours(time_end[0]);
    end.setMinutes(time_end[1]);

    data.all_day = [];
    data.by_hour = [];
    data.after_time = [];
    data.before_time = [];
    $.each(data.events, function(k, e) {
      var s = $self._convertDateToMoment(e.start).toDate();
      var f = $self._convertDateToMoment(e.end).toDate();

      e.start_hour = s.getHours().toString().formatNum(2) + ':' + s.getMinutes().toString().formatNum(2);
      e.end_hour = f.getHours().toString().formatNum(2) + ':' + f.getMinutes().toString().formatNum(2);

      if(s < start) {
        warn(1);
        e.start_hour = s.getDate() + ' ' + $self.locale['ms' + s.getMonth()] + ' ' + e.start_hour;
      }

      if(f > end) {
        warn(1);
        e.end_hour = f.getDate() + ' ' + $self.locale['ms' + f.getMonth()] + ' ' + e.end_hour;
      }

      if(s < start && f > end) {
        data.all_day.push(e);
        return;
      }

      if(f < start) {
        data.before_time.push(e);
        return;
      }

      if(s > end) {
        data.after_time.push(e);
        return;
      }

      var event_start = start.getTime() - s.getTime();

      if(event_start >= 0) {
        e.top = 0;
      } else {
        e.top = Math.abs(event_start) / ms_per_line;
      }

      var lines_left = Math.abs(lines - e.top);
      var lines_in_event = (f.getTime() - s.getTime()) / ms_per_line;
      if(event_start >= 0) {
        lines_in_event = (f.getTime() - start.getTime()) / ms_per_line;
      }


      e.lines = lines_in_event;
      if(lines_in_event > lines_left) {
        e.lines = lines_left;
      }

      data.by_hour.push(e);
    });

    //var d = new Date('2013-03-14 13:20:00');
    //warn(d.getTime());
  };

  Calendar.prototype._hour_min = function(hour) {
    var time_start = this.options.time_start.split(":");
    var time_split = parseInt(this.options.time_split);
    var in_hour = 60 / time_split;
    return (hour == 0) ? (in_hour - (parseInt(time_start[1]) / time_split)) : in_hour;
  };

  Calendar.prototype._hour = function(hour, part) {
    var time_start = this.options.time_start.split(":");
    var time_split = parseInt(this.options.time_split);
    var h = "" + (parseInt(time_start[0]) + hour * Math.max(time_split / 60, 1));
    var m = "" + (time_split * part + ((hour == 0) ? parseInt(time_start[1]) : 0));

    return h.formatNum(2) + ":" + m.formatNum(2);
  };

  Calendar.prototype._week = function() {
    var t = {};
    var start = this.options.position.start.clone();
    var end = this.options.position.end.clone();
    var events = [];
    var self = this;
    var first_day = getExtentedOption(this, 'first_day');

    $.each(this.getEventsBetween(start, end), function(k, event) {
      var eventStart = self._convertDateToMoment(event.start);
      var eventEnd = self._convertDateToMoment(event.end);
      var startMs = eventStart.toDate().getTime();
      var endMs = eventEnd.toDate().getTime();

      event.start_day = eventStart.day();
      if(first_day == 1) {
        event.start_day = (event.start_day + 6) % 7;
      }
      if((endMs - startMs) <= 86400000) {
        event.days = 1;
      } else {
        event.days = ((endMs - startMs) / 86400000);
      }

      if(startMs < start) {
        event.days = event.days - ((start - startMs) / 86400000);
        event.start_day = 0;
      }

      event.days = Math.ceil(event.days);

      if(event.start_day + event.days > 7) {
        event.days = 7 - (event.start_day);
      }

      events.push(event);
    });
    t.events = self.options.views.week.group ? this._groupEvents(events) : { "": events };
    t.cal = this;
    return self.options.templates['week-days'](t);
  }

  Calendar.prototype._month = function(month) {
    var t = {cal: this};
    var newmonth = month + 1;
    t.data_day = this.options.position.start.year() + '-' + (newmonth < 10 ? '0' + newmonth : newmonth) + '-' + '01';
    t.month_name = this.locale['m' + month];

    t.start = moment(new Date(this.options.position.start.year(), month, 1, 0, 0, 0));
    t.end = moment(new Date(this.options.position.start.year(), month + 1, 1, 0, 0, 0));
    t.events = this.getEventsBetween(t.start, t.end);
    return this.options.templates['year-month'](t);
  }

  Calendar.prototype._day = function(week, day) {
    var t = {tooltip: '', cal: this};
    var cls = this.options.classes.months.outmonth;

    var firstday = this.options.position.start.day();
    if(getExtentedOption(this, 'first_day') == 2) {
      firstday++;
    } else {
      firstday = (firstday == 0 ? 7 : firstday);
    }

    day = (day - firstday) + 1;
    var curdate = new Date(this.options.position.start.year(), this.options.position.start.month(), day, 0, 0, 0);

    // if day of the current month
    if(day > 0) {
      cls = this.options.classes.months.inmonth;
    }
    // stop cycling table rows;
    var daysinmonth = (new Date(this.options.position.end.toDate().getTime() - 1)).getDate();
    if((day + 1) > daysinmonth) {
      this.stop_cycling = true;
    }
    // if day of the next month
    if(day > daysinmonth) {
      day = day - daysinmonth;
      cls = this.options.classes.months.outmonth;
    }

    cls = $.trim(cls + " " + this._getDayClass("months", moment(curdate)));

    if(day <= 0) {
      var daysinprevmonth = (new Date(this.options.position.start.year(), this.options.position.start.month(), 0)).getDate();
      day = daysinprevmonth - Math.abs(day);
      cls += ' cal-month-first-row';
    }

    var holiday = this._getHoliday(moment(curdate));
    if(holiday !== false) {
      t.tooltip = holiday;
    }

    t.data_day = curdate.getFullYear() + '-' + curdate.getMonthFormatted() + '-' + (day < 10 ? '0' + day : day);
    t.cls = cls;
    t.day = day;

    t.start = moment(curdate);
    t.end = moment(new Date(curdate.getTime() + 86400000));
    t.events = this.getEventsBetween(t.start, t.end);
    // var events = this.getEventsBetween(t.start, t.end);
    // t.events = this.options.views.day.group ? this._groupEvents(events) : { "": events };
    return this.options.templates['month-day'](t);
  }

  Calendar.prototype._getHoliday = function(date) {
    var result = false;
    $.each(getHolidays(this, date.year()), function() {
      var found = false;
      $.each(this.days, function() {
        if(date.isSame(this)) {
          found = true;
          return false;
        }
      });
      if(found) {
        result = this.name;
        return false;
      }
    });
    return result;
  };

  Calendar.prototype._getHolidayName = function(date) {
    var holiday = this._getHoliday(date);
    return (holiday === false) ? "" : holiday;
  };

  Calendar.prototype._getDayClass = function(class_group, date) {
    var self = this;
    var addClass = function(which, to) {
      var cls;
      cls = (self.options.classes && (class_group in self.options.classes) && (which in self.options.classes[class_group])) ? self.options.classes[class_group][which] : "";
      if((typeof(cls) == "string") && cls.length) {
        to.push(cls);
      }
    };
    var classes = [];
    if(date.isSame(new Date())) {
      addClass("today", classes);
    }
    var holiday = this._getHoliday(date);
    if(holiday !== false) {
      addClass("holidays", classes);
    }
    switch(date.day()) {
      case 0:
        addClass("sunday", classes);
        break;
      case 6:
        addClass("saturday", classes);
        break;
    }

    addClass(date.toDate().toDateString(), classes);

    return classes.join(" ");
  };

  Calendar.prototype._groupEvents = function(events) {
    return events.reduce(function(previousValue, currentValue, index, array) {
      var group = currentValue.group || "";
      if (!previousValue[group]) {
        previousValue[group] = [];
      }
      previousValue[group].push(currentValue);
      return previousValue;
    }, {});
  };

  Calendar.prototype.view = function(view) {
    var self = this;
    if(view) {
      if(!self.options.views[view].enable) {
        return;
      }
      self.options.view = view;
    }


    self._init_position();
    self._loadEvents(function() {
      self._render();

      $(self.context).trigger($.Event('view-loaded.bs-calendar', {
        calendar: self,
        view: self.options.view
      }));
    });
  };

  Calendar.prototype.navigate = function(where, next) {
    var to = $.extend({}, this.options.position);
    if(where == 'next') {
      switch(this.options.view) {
        case 'year':
          to.start.year(this.options.position.start.year() + 1);
          break;
        case 'month':
          to.start.month(this.options.position.start.month() + 1);
          break;
        case 'week':
          to.start.date(this.options.position.start.date() + 7);
          break;
        case 'day':
          to.start.date(this.options.position.start.date() + 1);
          break;
      }
    } else if(where == 'prev') {
      switch(this.options.view) {
        case 'year':
          to.start.year(this.options.position.start.year() - 1);
          break;
        case 'month':
          to.start.month(this.options.position.start.month() - 1);
          break;
        case 'week':
          to.start.date(this.options.position.start.date() - 7);
          break;
        case 'day':
          to.start.date(this.options.position.start.date() - 1);
          break;
      }
    } else if(where == 'today') {
      to.start = moment();
    } else {
      $.error(this.locale.error_where.format(where))
    }
    this.options.day = to.start.format("YYYY-MM-DD");
    this.view();
    if(typeof next === "function") {
      next();
    }
  };

  Calendar.prototype._init_position = function() {
    var year, month, day;

    if(this.options.day == 'now') {
      var date = new Date();
      year = date.getFullYear();
      month = date.getMonth();
      day = date.getDate();
    } else if(this.options.day.match(/^\d{4}-\d{2}-\d{2}$/g)) {
      var list = this.options.day.split('-');
      year = parseInt(list[0], 10);
      month = parseInt(list[1], 10) - 1;
      day = parseInt(list[2], 10);
    } else {
      $.error(this.locale.error_dateformat.format(this.options.day));
    }

    switch(this.options.view) {
      case 'year':
        this.options.position.start = moment(new Date(year, 0, 1));
        this.options.position.end = moment(new Date(year + 1, 0, 1));
        break;
      case 'month':
        this.options.position.start = moment(new Date(year, month, 1));
        this.options.position.end = moment(new Date(year, month + 1, 1));
        break;
      case 'day':
        this.options.position.start = moment(new Date(year, month, day));
        this.options.position.end = moment(new Date(year, month, day + 1));
        break;
      case 'week':
        var curr = new Date(year, month, day);
        var first;
        if(getExtentedOption(this, 'first_day') == 1) {
          first = curr.getDate() - ((curr.getDay() + 6) % 7);
        } else {
          first = curr.getDate() - curr.getDay();
        }
        this.options.position.start = moment(new Date(year, month, first));
        this.options.position.end = moment(new Date(year, month, first + 7));
        break;
      default:
        $.error(this.locale.error_noview.format(this.options.view))
    }
    return this;
  };

  Calendar.prototype.getTitle = function() {
    var p = this.options.position.start;
    switch(this.options.view) {
      case 'year':
        return this.locale.title_year.format(p.year());
        break;
      case 'month':
        return this.locale.title_month.format(this.locale['m' + p.month()], p.year());
        break;
      case 'week':
        return this.locale.title_week.format(p.week(), p.year());
        break;
      case 'day':
        return this.locale.title_day.format(this.locale['d' + p.day()], p.date(), this.locale['m' + p.month()], p.year());
        break;
    }
    return;
  };

  Calendar.prototype.isToday = function() {
    var now = moment();

    return ((now > this.options.position.start) && (now < this.options.position.end));
  }

  Calendar.prototype.getStartDate = function() {
    return this.options.position.start.toDate();
  }

  Calendar.prototype.getEndDate = function() {
    return this.options.position.end.toDate();
  }

  Calendar.prototype._loadEvents = function(callback) {
    var self = this;
    var source = this.options.events_source;
    var loader;
    switch($.type(source)) {
      case 'function':
        loader = function(loaderCallback) {
          source(self.options.position.start, self.options.position.end, browser_timezone, loaderCallback);
        };
        break;
      case 'array':
        loader = function(loaderCallback) {
          return loaderCallback([].concat(source));
        };
        break;
      case 'string':
        if(source.length) {
          loader = function(loaderCallback) {
            var events = [];
            var params = {
              from: self.options.position.start.format("MM/DD/YYYY"),
              to: self.options.position.end.format("MM/DD/YYYY")
            };
            if(browser_timezone.length) {
              params.browser_timezone = browser_timezone;
            }
            $.ajax({
              url: buildEventsUrl(source, params),
              dataType: 'json',
              type: 'GET'
            }).done(function(data, status, jqXHR) {
              events = data;
              if (typeof loaderCallback == "function") {
                loaderCallback(events);
              }
            }).fail(function(jqXHR, status, errorThrown) {
              $.error(errorThrown);
            });
          };
        }
        break;
    }
    if(!loader) {
      $.error(self.locale.error_loadurl);
    }
    var beforeEventsLoadEvent = $.Event('events-loading.bs-calendar', {
      calendar: self
    });
    $(self.context).trigger(beforeEventsLoadEvent);
    if (!beforeEventsLoadEvent.isDefaultPrevented()) {
      loader(function(events) {
        self.options.events = events;
        self.options.events.sort(function(a, b) {
          var delta;
          if (isNaN(a.start)) {
            delta = moment(a.start) - moment(b.start);
            if(delta == 0) {
              delta = moment(a.end) - moment(b.end);
            }
          } else {
            delta = a.start - b.start;
            if(delta == 0) {
              delta = a.end - b.end;
            }
          }
          return delta;
        });

        $(self.context).trigger($.Event('events-loaded.bs-calendar', {
          calendar: self,
        events: self.options.events
      }));
        if (typeof callback == "function") {
          callback.call(self);
        }
      });
    }
  };

  Calendar.prototype._update = function() {
    var self = this;

    $('*[data-toggle="tooltip"]').tooltip({container: 'body'});

    $('*[data-cal-date]').click(function() {
      var view = $(this).data('cal-view');
      self.options.day = $(this).data('cal-date');
      self.view(view);
    });
    $('.cal-cell').dblclick(function() {
      var view = $('[data-cal-date]', this).data('cal-view');
      self.options.day = $('[data-cal-date]', this).data('cal-date');
      self.view(view);
    });

    this['_update_' + this.options.view]();

    this._update_modal();

  };

  Calendar.prototype._update_modal = function() {
    var self = this;

    $('a[data-event-id]', this.context).unbind('click');

    if(!self.options.modal) {
      return;
    }

    var modal = $(self.options.modal);

    if(!modal.length) {
      return;
    }

    var ifrm = null;
    if(self.options.modal_type == "iframe") {
      ifrm = $(document.createElement("iframe"))
        .attr({
          width:       "100%",
          frameborder: "0"
        });
    }


    $('a[data-event-id]', this.context).on('click', function(index, event) {
      event.preventDefault();
      event.stopPropagation();

      var url = $(this).attr('href');
      var id = $(this).data("event-id");
      var event = self.options.events.find(function(event) {
        return event.id == id
      });

      if(self.options.modal_type == "iframe") {
        ifrm.attr('src', url);
        $('.modal-body', modal).html(ifrm);
      }

      if(!modal.data('handled.bootstrap-calendar') || (modal.data('handled.bootstrap-calendar') && modal.data('handled.event-id') != event.id)) {
        modal	.off('show.bs.modal')
          .off('shown.bs.modal')
          .off('hidden.bs.modal')
          .on('show.bs.modal', function() {
            var modal_body = $(this).find('.modal-body');
            switch(self.options.modal_type) {
              case "iframe" :
                var height = modal_body.height() - parseInt(modal_body.css('padding-top'), 10) - parseInt(modal_body.css('padding-bottom'), 10);
                $(this).find('iframe').height(Math.max(height, 50));
                break;

              case "ajax":
                $.ajax({url: url, dataType: "html", async: false, success: function(data) {
                  modal_body.html(data);
                }});
                break;

              case "template":
                //	also serve calendar instance to underscore template to be able to access current language strings
                modal_body.html(self.options.templates["modal"]({"event": event, "calendar": self}))
                break;
            }

            //	set the title of the bootstrap modal
            if(typeof self.options.modal_title == "function") {
              modal.find("h3").html(self.options.modal_title(event));
            }
          })
          .on('shown.bs.modal', function() {
            $(self.context).trigger($.Event('shown.bs-calendar.modal', {
              calendar: this,
              events: self.options.events
            }));
          })
          .on('hidden.bs.modal', function() {
            $(self.context).trigger($.Event('hidden.bs-calendar.modal', {
              calendar: this,
              events: self.options.events
            }));
          })
          .data('handled.bootstrap-calendar', true).data('handled.event-id', event.id);
      }
      modal.modal('show');
    });
  };

  Calendar.prototype._update_day = function() {
    $('#cal-day-panel').height($('#cal-day-panel-hour').height());
  };

  Calendar.prototype._update_week = function() {
  };

  Calendar.prototype._update_year = function() {
    this._update_month_year();
  };

  Calendar.prototype._update_month = function() {
    this._update_month_year();

    var self = this;

    var week = $(document.createElement('div')).attr('id', 'cal-week-box');
    var start = this.options.position.start.year() + '-' + this.options.position.start.format("MM") + '-';
    $('.cal-month-box .cal-row-fluid')
      .on('mouseenter', function() {
        var p = self.options.position.start.toDate();
        var child = $('.cal-cell1:first-child .cal-month-day', this);
        var day = child.hasClass('cal-month-first-row') ? 1 : $('[data-cal-date]', child).text().trim();
        p.setDate(parseInt(day));
        day = (day < 10 ? '0' + day : day);
        week.html(self.locale.week.format(p.getWeek()));
        week.attr('data-cal-week', start + day).show().appendTo(child);
      })
      .on('mouseleave', function() {
        week.hide();
      })
    ;

    week.click(function() {
      self.options.day = $(this).data('cal-week');
      self.view('week');
    });

    $('a.event').mouseenter(function() {
      $('a[data-event-id="' + $(this).data('event-id') + '"]').closest('.cal-cell1').addClass('day-highlight dh-' + $(this).data('event-class'));
    });
    $('a.event').mouseleave(function() {
      $('div.cal-cell1').removeClass('day-highlight dh-' + $(this).data('event-class'));
    });
  };

  Calendar.prototype._update_month_year = function() {
    if(!this.options.views[this.options.view].slide_events) {
      return;
    }
    var self = this;
    var activecell = 0;
    var downbox = $(document.createElement('div')).attr('id', 'cal-day-tick').html('<i class="icon-chevron-down glyphicon glyphicon-chevron-down"></i>');

    $('.cal-month-day, .cal-year-box .span3')
      .on('mouseenter', function() {
        if($('.events-list', this).length == 0) return;
        if($(this).children('[data-cal-date]').text() == self.activecell) return;
        downbox.show().appendTo(this);
      })
      .on('mouseleave', function() {
        downbox.hide();
      })
      .on('click', function(event) {
        if($('.events-list', this).length == 0) return;
        if($(this).children('[data-cal-date]').text() == self.activecell) return;
        showEventsList(event, downbox, slider, self);
      })
    ;

    var slider = $(document.createElement('div')).attr('id', 'cal-slide-box');
    slider.hide().click(function(event) {
      event.stopPropagation();
    });

    downbox.click(function(event) {
      showEventsList(event, $(this), slider, self);
    });
  };

  Calendar.prototype.getEventsBetween = function(start, end) {
    var events = [];
    var self = this;
    $.each(self.options.events, function(index, event) {
      if(event.start == null) {
        return true;
      }
      var event_start = self._convertDateToMoment(event.start);
      var event_end = self._convertDateToMoment(event.end);
      if ((event_start < end) && (event_end >= start)) {
        events.push(event);
      }
    });
    return events;
  };

  Calendar.prototype._convertDateToMoment = function(date) {
    return isNaN(date) ? moment(date) : moment(new Date(parseInt(date)));
  }

  function showEventsList(event, that, slider, self) {

    event.stopPropagation();

    var that = $(that);
    var cell = that.closest('.cal-cell');
    var row = cell.closest('.cal-before-eventlist');
    var tick_position = cell.data('cal-row');

    that.fadeOut('fast');

    slider.slideUp('fast', function() {
      var event_list = $('.events-list', cell);
      slider.html(self.options.templates['events-list']({
        cal:    self,
        events: self.getEventsBetween(parseInt(event_list.data('cal-start')), parseInt(event_list.data('cal-end')))
      }));
      row.after(slider);
      self.activecell = $('[data-cal-date]', cell).text();
      $('#cal-slide-tick').addClass('tick' + tick_position).show();
      slider.slideDown('fast', function() {
        $('body').one('click', function() {
          slider.slideUp('fast');
          self.activecell = 0;
        });
      });
    });



    // Wait 400ms before updating the modal & attach the mouseenter&mouseleave(400ms is the time for the slider to fade out and slide up)
    setTimeout(function() {
      $('a.event-item').mouseenter(function() {
        $('a[data-event-id="' + $(this).data('event-id') + '"]').closest('.cal-cell1').addClass('day-highlight dh-' + $(this).data('event-class'));
      });
      $('a.event-item').mouseleave(function() {
        $('div.cal-cell1').removeClass('day-highlight dh-' + $(this).data('event-class'));
      });
      self._update_modal();
    }, 400);
  }

  function getEasterDate(year, offsetDays) {
    var a = year % 19;
    var b = Math.floor(year / 100);
    var c = year % 100;
    var d = Math.floor(b / 4);
    var e = b % 4;
    var f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4);
    var k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var n0 = (h + l + 7 * m + 114)
    var n = Math.floor(n0 / 31) - 1;
    var p = n0 % 31 + 1;
    return new Date(year, n, p + (offsetDays ? offsetDays : 0), 0, 0, 0);
  }

  $.fn.calendar = function(params) {
    var calendar = $(this).data('bs-calendar');
    if (calendar) {
      return calendar;
    } else {
      return new Calendar(params, this);
    }
  }
}(jQuery));
