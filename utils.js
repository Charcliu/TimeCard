var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
/**
 * 判断闰年
 * @param  {[type]}  year [description]
 * @return {Boolean}      [description]
 */
function isLeapYear(year) {
  return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
}

/**
 * 获取当前月份天数
 * @param  {[type]} year  [description]
 * @param  {[type]} month [description]
 * @return {[type]}       [description]
 */
function getDaysOfCurMonth(year, month) {
  var days = 0;
  var _31Days = [1, 3, 5, 7, 8, 10, 12];
  var is31Days = _31Days.some(function(item) {
    return monthArray[item - 1] === month
  })
  var leapYear = isLeapYear(year);
  if (is31Days) {
    days = 31
  } else {
    if (month === "Feb") {
      leapYear ?
        days = 29 : days = 28
    } else {
      days = 30
    }
  }
  return days;
}

/**
 * 获取当前月份第一天是星期几
 * @param  {[type]} year  [description]
 * @param  {[type]} month [description]
 * @return {[type]}       [description]
 */
function getCurMonthFirstDayOfWeek(year, month) {
  var firstDate = new Date(year, monthArray.indexOf(month), 1);
  return firstDate.getDay();

}

/**
 * 获取当前月份最后一天是星期几
 * @param  {[type]} year  [description]
 * @param  {[type]} month [description]
 * @return {[type]}       [description]
 */
function getCurMonthLastDayOfWeek(year, month) {
  var lastDate = new Date(year, monthArray.indexOf(month), getDaysOfCurMonth(year, month));
  return lastDate.getDay();
}
