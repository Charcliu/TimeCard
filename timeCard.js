// 日历对象
function Calendar() {
  // 日历基础配置，可扩展
  this.config = {
      startYear: 2013,
      endYear: new Date().getFullYear(),
      eleYear: "#selectYear",
      constantMonth: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      eleMonth: "#selectMonth",
      constantWeek: ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
      eleWeek: ".week"
    },
    this.date = new Date(),
    this.preDateInfo = [],
    this.curDateInfo = [],
    this.afterDateInfo = [],
    this.daysSize = 0,
    this.firstDayOfWeek = 0,
    this.lastDayOfWeek = 0
}

Calendar.prototype = {
  // 初始化日历显示
  _init: function(options) {
    this.config = $.extend(this.config, options || {})
    this._renderYear();
    this._renderMonth();
    this._renderWeek();
    this._initializeCurMonth();
    return this;
  },
  // 初始化左侧年份显示
  _renderYear: function() {
    for (var i = this.config.endYear; i > this.config.startYear; i--) {
      $(this.config.eleYear).append("<option value=" + i + ">" + i + "</option>")
    }
  },
  // 初始化左侧月份显示
  _renderMonth: function() {
    for (var i = 0; i < this.config.constantMonth.length;) {
      $(this.config.eleMonth).append("<div>" +
        "<div id = month" + i + ">" + this.config.constantMonth.slice(i, i + 2)[0] + "</div>" +
        "<div id = month" + (i + 1) + ">" + this.config.constantMonth.slice(i, i + 2)[1] + "</div>" +
        "</div>");
      i += 2;
    }
  },
  // 初始化右侧顶部周显示
  _renderWeek: function() {
    this.config.constantWeek.forEach(function(item, index, array) {
      $(this.config.eleWeek).append("<div>" + item + "</div>")
    }, this)
  },
  // 初始化当前展示月份标记
  _initializeCurMonth: function() {
    $("#month" + new Date().getMonth()).addClass("curMonth");
  },
  // 获取需要展示的当月信息
  getCurMonth: function(year, month) {
    var curMonthArray = [];
    for (var i = 0; i < this.config.timeCardUtil.getDaysOfCurMonth(year, month); i++) {
      curMonthArray.push(this.config.timeCardUtil.dateInfo(year, month, i + 1));
    }
    return curMonthArray;
  },
  // 获取需要展示的上月信息
  getPreMonth: function(week, year, month) {
    var preYear, preMonth, days, preMonthArray = [];
    if (month > 0) {
      preYear = parseInt(year);
      preMonth = month - 1;
    } else {
      preYear = parseInt(year) - 1;
      preMonth = 11;
    }
    days = this.config.timeCardUtil.getDaysOfCurMonth(preYear, preMonth);
    for (var i = 0; i < week; i++) {
      preMonthArray.push(this.config.timeCardUtil.dateInfo(preYear, preMonth, days - i));
    }
    return preMonthArray.reverse();
  },
  // 获取需要展示的下月信息
  getAfterMonth: function(week, year, month) {
    var afterYear, afterMonth, days, afterMonthArray = [];
    if (month < 11) {
      afterYear = parseInt(year);
      afterMonth = month + 1;
    } else {
      afterYear = parseInt(year) + 1;
      afterMonth = 0;
    }
    days = this.config.timeCardUtil.getDaysOfCurMonth(afterYear, afterMonth);
    for (var i = 0; i < 6 - week; i++) {
      afterMonthArray.push(this.config.timeCardUtil.dateInfo(afterYear, afterMonth, i + 1))
    }
    return afterMonthArray;
  },
  // 画图方法
  drawCalendar: function(year, month) {
    this.date = new Date(year, month);
    this.clearOldData();
    // 获取当月第一天是星期几
    this.firstDayOfWeek = this.config.timeCardUtil.getCurMonthFirstDayOfWeek(year, month);
    // 获取当月最后一天是星期几
    this.lastDayOfWeek = this.config.timeCardUtil.getCurMonthLastDayOfWeek(year, month);
    this.firstDayOfWeek != 0 ? this.preDateInfo = this.getPreMonth(this.firstDayOfWeek, year, month) : ""
    this.lastDayOfWeek != 6 ? this.afterDateInfo = this.getAfterMonth(this.lastDayOfWeek, year, month) : ""
    this.curDateInfo = this.getCurMonth(year, month);
    this.drawHtml();
  },
  //  清空日历区DOM和日历对象当月，前一月，后一月对象信息
  clearOldData: function() {
    this.preDateInfo = [];
    this.curDateInfo = [];
    this.afterDateInfo = [];
    $("#calendar").empty();
  },
  // 拼接日历展示区HTML和添加对应央视
  drawHtml: function() {
    var _this = this;
    var totalArray = this.preDateInfo.concat(this.curDateInfo).concat(this.afterDateInfo);
    this.config.timeCardUtil.groupData(totalArray).forEach(function(everyGroup) {
      var html = "<div class = 'aWeek'>"
      everyGroup.forEach(function(date) {
        var flag = "";
        if (date.date.getMonth() != _this.date.getMonth()) {
          flag = " notCurMonth"
        }
        html += "<div class = 'aDay" + flag + " aDay" + date.week + "'><div><u>" + date.day + "</u></div><div>" + date.weekDesc + "</div></div>"
      })
      html += "</div>"
      $("#calendar").append(html);
    })
    $(".aDay0").addClass('weekend');
    $(".aDay6").addClass('weekend');
    $(".aDay0 > div").last().addClass('redColor');
    $(".aDay6 > div").last().addClass('redColor');
    $(".notCurMonth > div").last().removeClass('redColor');
  }
}

$(function() {
  // 初始化日历
  var calender = new Calendar()._init({
    timeCardUtil: new TimeCardUtil()
  })
  calender.drawCalendar(calender.date.getFullYear(), calender.date.getMonth());

  // 年份切换事件
  $(calender.config.eleYear).bind("change", function() {
    calender.drawCalendar($(calender.config.eleYear).val(), calender.config.constantMonth.indexOf($(".curMonth").text()));
  })

  // 月份点击事件
  for (var i = 0; i < 12; i++) {
    $("#month" + i).bind("click", function(el) {
      $(".curMonth").removeClass();
      $(this).addClass("curMonth");
      calender.drawCalendar($(calender.config.eleYear).val(), calender.config.constantMonth.indexOf($(".curMonth").text()));
    })
  }
});
