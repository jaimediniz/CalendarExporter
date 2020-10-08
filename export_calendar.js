const weeks = document
  .getElementById("mvEventContainer")
  .getElementsByClassName("month-row");

const zeroPad = (num, places) => String(num).padStart(places, '0')

var calendar = `BEGIN:VCALENDAR
PRODID:Calendar
VERSION:2.0`
var uid = 0;
for (var week = 0; week < weeks.length; week++) {
  const rows = weeks[week].getElementsByTagName("tr");
  const days = rows[0].getElementsByTagName("td");
  const filteredRows = Array.prototype.slice.call(rows).slice(2, -1);
  var day;

  for (var day = 0; day < days.length; day++) {
    const date = days[day].abbr;
    const dayArray = date.split("/");
    const dayTime = `${dayArray[1]}/${zeroPad(dayArray[0], 2)}/${dayArray[2]}`
    for (var row = 0; row < filteredRows.length; row++) {
      var element = filteredRows[row]
        .getElementsByTagName("td")[day]?.getElementsByTagName("div")[2];

      if (!element) { continue; }

      const classEl = element.getElementsByTagName("div")[0].getElementsByTagName("span")[0].innerHTML.split(" ");

      const initTime = classEl[0].split(":");
      const endTime = classEl[2].split(":");
      const className = classEl[3].replace("&amp;", " ");

      console.log(`${dayTime}: ${initTime[0]}:${initTime[1]} - ${endTime[0]}:${endTime[1]} - ${className}`);

      calendar += `
BEGIN:VEVENT
UID:${uid}@default
CLASS:PUBLIC
DESCRIPTION:${className}
DTSTAMP;VALUE=DATE-TIME:20201008T154747
DTSTART;VALUE=DATE-TIME:${dayArray[2]}${zeroPad(dayArray[0], 2)}${zeroPad(dayArray[1], 2)}T${initTime[0]}${initTime[1]}-02Z
DTEND;VALUE=DATE-TIME:${dayArray[2]}${zeroPad(dayArray[0], 2)}${zeroPad(dayArray[1], 2)}T${endTime[0]}${endTime[1]}-02Z
LOCATION:Ingolstadt
SUMMARY;LANGUAGE=en-us:${className}
TRANSP:TRANSPARENT
BEGIN:VALARM
TRIGGER:-PT15M
REPEAT:1
DURATION:PT15M
ACTION:DISPLAY
DESCRIPTION:Reminder
END:VALARM
END:VEVENT`
      uid += 1
    }
  }
}

calendar += `
END:VCALENDAR
`


var blob = new Blob([calendar], { type: 'text/json' }),
  e = document.createEvent('MouseEvents'),
  a = document.createElement('a')

a.download = "calendar.ics"
a.href = window.URL.createObjectURL(blob)
a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
a.dispatchEvent(e)
