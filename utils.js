// 日历帮助对象
function TimeCardUtil() {
  this.config = {
    _31Days: [1, 3, 5, 7, 8, 10, 12]
  }
}

TimeCardUtil.prototype = {
  // 判断闰年
  leapYear: function(year) {
    return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
  },
  // 获取某年某月有多少天
  getDaysOfCurMonth: function(year, month) {
    var days = 0;
    var is31Days = this.config._31Days.some(function(item) {
      return item - 1 === month
    }, this)
    var isLeapYear = this.leapYear(year);
    if (is31Days) {
      days = 31
    } else {
      if (month === 1) {
        isLeapYear ?
          days = 29 : days = 28
      } else {
        days = 30
      }
    }
    return days;
  },
  // 获取当月第一天是星期几
  getCurMonthFirstDayOfWeek: function(year, month) {
    return new Date(year, month, 1).getDay();
  },
  // 获取当月最后一天是星期几
  getCurMonthLastDayOfWeek: function(year, month) {
    return new Date(year, month, this.getDaysOfCurMonth(year, month)).getDay();
  },
  // 返回日历中的天的详细对象信息
  dateInfo: function(year, month, day) {
    var date = new Date(year, month, day);
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
    return {
      day: month + "-" + day,
      week: date.getDay(),
      date: date,
      weekDesc: date.getDay() === 0 || date.getDay() === 6 ? "休息日" : "工作日"
    }
  },
  // 分组应该显示的日历集合
  groupData: function(dateArray) {
    var size = dateArray.length / 7;
    var groupData = [];
    for (var i = 0; i < size; i++) {
      groupData.push(dateArray.slice(i * 7, i * 7 + 7))
    }
    return groupData;
  }
}
