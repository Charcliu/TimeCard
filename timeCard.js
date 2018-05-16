(function() {
  // 初始化select下拉框年份，默认从当前往前5年
  var date = new Date();
  for (var i = date.getFullYear(); i > date.getFullYear() - 5; i--) {
    $("#selectYear").append("<option value=" + i + ">" + i + "</option>")
  }

  //初始化左侧月份选择
  for (var i = 0; i < monthArray.length;) {
    $("#selectMonth").append("<div>" +
      "<span id = " + monthArray.slice(i, i + 2)[0] + ">" +
      monthArray.slice(i, i + 2)[0] +
      "</span>" +
      "<span id = " + monthArray.slice(i, i + 2)[1] + ">" +
      monthArray.slice(i, i + 2)[1] +
      "</span>" +
      "</div>");
    i += 2;
  }

  //默认选中当前月份
  var curMonth = monthArray[date.getMonth()]
  $("#" + curMonth).addClass("curMonth");

  //初始化星期
  var week = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
  week.forEach(function(item, index, array) {
    $(".week").append("<div>" + item + "</div>")
  })
})()

function showCalendarData(year, curMonth) {
  var days = getDaysOfCurMonth(year, curMonth);
  var firstDayOfWeek = getCurMonthFirstDayOfWeek(year, curMonth);
  var lastDayOfWeek = getCurMonthLastDayOfWeek(year, curMonth);
  var preDays = [],
    curDays = [],
    lastDays = [],
    showData = [];
  firstDayOfWeek != 0 ? preDays = getPreMonth(firstDayOfWeek, year, curMonth) : ""
  lastDayOfWeek != 6 ? lastDays = getAfterMonth(lastDayOfWeek, year, curMonth) : ""
  curDays = getCurMonth(days, year, curMonth);
  showData = groupData(preDays.concat(curDays).concat(lastDays))
  showData.forEach(function(item) {
    var html = "<div class = 'aWeek'>"
    item.forEach(function(item1) {
      html += "<div class = 'aDay'>" + item1.day + "</div>"
    })
    html += "</div>"
    $("#calendar").append(html);
  })

}

function getCurMonth(curDays, year, curMonth) {
  var curMonthArray = [];
  for (var i = 0; i < curDays; i++) {
    curMonthArray.push(dateInfo(year, monthArray.indexOf(curMonth), i + 1));
  }
  return curMonthArray;
}

function getPreMonth(week, year, curMonth) {
  var preYear, preMonth;
  if (monthArray.indexOf(curMonth) > 0) {
    preYear = parseInt(year);
    preMonth = monthArray.indexOf(curMonth) - 1;
  } else {
    preYear = parseInt(year) - 1;
    preMonth = 11;
  }
  var days = getDaysOfCurMonth(preYear, preMonth);
  var preMonthArray = []
  for (var i = 0; i < week; i++) {
    preMonthArray.push(dateInfo(preYear, preMonth, days - i));
  }
  return preMonthArray.reverse();
}

function getAfterMonth(week, year, curMonth) {
  var afterYear, afterMonth;
  if (monthArray.indexOf(curMonth) < 11) {
    afterYear = parseInt(year);
    afterMonth = monthArray.indexOf(curMonth) + 1;
  } else {
    afterYear = parseInt(year) + 1;
    afterMonth = 0;
  }
  var days = getDaysOfCurMonth(afterYear, afterMonth);
  var afterMonthArray = []
  for (var i = 0; i < 6 - week; i++) {
    afterMonthArray.push(dateInfo(afterYear, afterMonth, i + 1))
  }
  return afterMonthArray;
}

function dateInfo(year, month, day) {
  var date = new Date(year, month, day);
  var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
  return {
    day: month + "-" + day,
    week: date.getDay(),
    date: date
  }
}

function groupData(data) {
  var size = data.length / 7;
  var groupData = [];
  for (var i = 0; i < size; i++) {
    groupData.push(data.slice(i * 7, i * 7 + 7))
  }
  return groupData;
}

showCalendarData($("#selectYear").val(), $(".curMonth").text())
