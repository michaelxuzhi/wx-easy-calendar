// components/calendar/calendar.js
import { ReDate } from './utils/utils.js';
Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  // 外部传入的数据
  properties: {
    day_lang: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    foldit: false, // 是否收起，true：收起，false：展开
    dark: 0, // 是否黑暗模式，0：否，1：是
    monthDayFinal: [],
    date_real: {}, // 被选中的日期，下面的逻辑中可以不将此变量存data
    day: [
      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      ['日', '一', '二', '三', '四', '五', '六'],
    ], // 根据day_lang来显示中文/英文
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 月份显示，获取到的月份+1 = 正常月份
    monthShow(month) {
      let month_show = (month + 1) % 12 ? month + 1 : 12;
      // 让月份呈2位数字符串返回
      return month_show >= 10 ? '' + month_show : '0' + month_show;
    },
    // 返回今天星期几
    todayDay(year, month, today_day) {
      return new Date(year, month, today_day).getDay();
    },
    // 格式化处理日期，返回:{年:x,月:x,日:x,日期字符串:xxx}
    formatDate(year, month, day) {
      let dateString = [year, month + 1, day]
        .map(i => {
          return i >= 10 ? '' + i : '0' + i;
        })
        .join('-');
      return {
        year,
        month,
        day,
        dateString,
      };
    },
    // 获取上一个月的天数，传入的是当月年、月，返回上个月年月日星期
    GetLastMonth(year, month) {
      let lastMonth = month - 1,
        lastYear = year,
        lastMonthDay = new Date(lastYear, lastMonth + 1, 0).getDate(),
        lastMonthDay_day = new Date(lastYear, lastMonth, lastMonthDay).getDay();
      // 跨度是一年了
      if (lastMonth < 0) {
        lastYear -= 1;
        lastMonth = 11;
      }
      return {
        date: lastMonthDay,
        month: lastMonth,
        year: lastYear,
        day: lastMonthDay_day,
      };
    },

    // 获取下一个月的天数，传入的是当月年、月，返回下个月年月日星期
    GetNextMonth(year, month) {
      let nextMonth = month + 1,
        nextYear = year,
        nextMonthDay = new Date(nextYear, nextMonth + 1, 0).getDate(),
        nextMonthDay_firstday = new Date(nextYear, nextMonth, 1).getDay();
      // 跨度是一年了
      if (nextMonth > 11) {
        nextYear += 1;
        nextMonth = 0;
      }
      return {
        date: nextMonthDay, // 日期
        month: nextMonth, // 下月月份
        year: nextYear, // 下月年份
        day: nextMonthDay_firstday, // 下月第一天的星期
      };
    },

    // 获取基本数据
    getBaseDate(year, month) {
      // 获取本月第一天星期几，月份用的是【正常月-1】
      let firstDay = new Date(year, month, 1).getDay(),
        // 获取本月天数，月份用的是【正常月】
        monthDay = new Date(year, month + 1, 0).getDate(),
        // 获取本月最后一天的星期
        monthDay_day = this.todayDay(year, month, monthDay),
        // 获取上一个月的天数，用作填充前补足
        lastMonth = this.GetLastMonth(year, month),
        // 获取下一个月的天数，用作填充后补足
        nextMonth = this.GetNextMonth(year, month),
        // 判断是否要更新日期，即：31日->30日
        today = this.data.today >= monthDay ? monthDay : this.data.today,
        today_day = this.todayDay(year, month, today),
        date_real = this.formatDate(year, month, today),
        month_show = this.monthShow(month); // 月份显示，return月份+1 = 正常月份
      // 这里把当日的星期和日期设置成null，是因为如果提前设置了日期，会优先选择未切换月份界面的新的日期
      // 比如：10月4日切换到11月4日，切换过程中，先将日期移动到10月界面上的11月4日，再进行concat渲染新的日历，当新的日历渲染好，11月4日会从10月界面跳跃切换至11月界面，会看到选中效果的抖动。
      // 为了避免这样的UI抖动，所以就先将这两项置为null，在渲染好新的月历后，再进行设置
      this.setData({
        month,
        year,
        today: null,
        today_day: null,
        month_show,
        firstDay,
      }); // 把firstDay存进去是fold()要前补足数据
      this.triggerEvent('change', date_real);
      this.concatArr(firstDay, monthDay, lastMonth, nextMonth, monthDay_day);
      // 重新设置当日星期和日期，避免UI抖动现象
      this.setData({
        today,
        today_day,
      });
    },

    // 上、本、下 3个月份日期数据渲染
    concatArr(firstDay, monthDay, lastMonth, nextMonth, monthDay_day) {
      let fillDate = []; // 前补足-->最终拼接
      if (firstDay) {
        for (let i = 0; i < firstDay; i++) {
          fillDate.push({
            date: lastMonth.date - lastMonth.day + i,
            month: lastMonth.month,
            year: lastMonth.year,
          });
        }
      }
      // 用前补足数组拼接
      for (let j = 1; j <= monthDay; j++) {
        fillDate.push({
          date: j,
          month: this.data.month,
          year: this.data.year,
        });
      }
      // 后补足-->最终拼接
      let length = 6 - monthDay_day;
      if (length) {
        for (let k = 1; k <= length; k++) {
          fillDate.push({
            date: k,
            month: nextMonth.month,
            year: nextMonth.year,
          });
        }
      }
      // console.log(fillDate);
      this.setData({
        monthDayFinal: fillDate,
      });
    },

    // 点击选中日期
    clickDate(e) {
      let sel_date = e.currentTarget.dataset.date,
        sel_month = e.currentTarget.dataset.month,
        sel_year = e.currentTarget.dataset.year;
      if (sel_month != this.data.month && !this.data.foldit) return;
      let today_day = this.todayDay(sel_year, sel_month, sel_date);
      // 为了不重新调用getBaseDate()，这里主动重写一个date_real
      let date_real = this.formatDate(sel_year, sel_month, sel_date);
      // getBaseDate()调用次数优化:非本月才调用
      this.setData({
        today: sel_date,
        // date_real,
      });
      if (sel_month == this.data.month) {
        this.setData({
          today_day,
        });
      } else {
        this.getBaseDate(sel_year, sel_month);
      }
      this.triggerEvent('change', date_real);
      // 打开模态栏
      // this.triggerEvent('showModal_info', {
      //   show: true,
      // });

      // 跳转到open页面
      // wx.navigateTo({
      //   url: `/pages/table/table?dateInfo=${JSON.stringify(date_real)}`
      // })
    },
    // 点击改变date-picker当前日期
    bindDateChange(e) {
      let value = e.detail.value,
        pickYear = Number(value.substr(0, 4)), // 截取年份，转换成数字
        pickMonth = Number(value.substr(-2)) - 1; // 截取月份，-1转换成计算机的月份
      // 通过getBaseDate()计算
      this.getBaseDate(pickYear, pickMonth);
    },
    // 返回当前日期
    backNow() {
      // 加个判断，避免当日的重复点击
      if (
        this.data.year == this.data.nowYear &&
        this.data.month == this.data.nowMonth &&
        this.data.today == this.data.nowDate
      ) {
        return;
      }
      this.setData({
        today: this.data.nowDate,
      });
      this.getBaseDate(this.data.nowYear, this.data.nowMonth);
    },
    // 点击显示上个月
    lastMonth(e) {
      // 获取当前月份信息
      let year = e.currentTarget.dataset.year,
        month = e.currentTarget.dataset.month,
        lastMonthInfo = this.GetLastMonth(year, month);
      // 通过getBaseDate()计算
      this.getBaseDate(lastMonthInfo.year, lastMonthInfo.month);
    },

    // 点击显示下个月
    nextMonth(e) {
      // 获取当前月份信息
      let year = e.currentTarget.dataset.year,
        month = e.currentTarget.dataset.month,
        nextMonthInfo = this.GetNextMonth(year, month);
      // 通过getBaseDate()计算
      this.getBaseDate(nextMonthInfo.year, nextMonthInfo.month);
    },

    // 点击展开/收起
    fold(e) {
      this.setData({
        foldit: !this.data.foldit,
      });
      if (this.data.foldit) {
        // 算法：计算当前选中日期在渲染的日历的第line行
        let line = (this.data.today + 6 - this.data.today_day + this.data.firstDay) / 7;
        // (this.data.today + (7 - (this.data.today_day + 1)) + this.data.firstDay) / 7;
        // 截取渲染的日历的第line行，不破坏原数组
        let week = this.data.monthDayFinal.slice((line - 1) * 7, line * 7);
        this.setData({
          monthDayFinal: week,
        });
        return;
      }
      this.getBaseDate(this.data.year, this.data.month);
    },

    // 点击切换主题
    switchCss() {
      this.setData({
        dark: !this.data.dark,
      });
    },

    // ListTouch触摸开始
    ListTouchStart(e) {
      this.setData({
        ListTouchStart: e.touches[0].pageX,
      });
    },
    // ListTouch计算方向
    ListTouchMove(e) {
      // 滑动距离
      let scrollDistance = e.touches[0].pageX - this.data.ListTouchStart;
      if (scrollDistance > 0 && scrollDistance > 50) {
        this.setData({
          ListTouchDirection: 'right',
        });
      } else if (scrollDistance < 0 && scrollDistance < -50) {
        this.setData({
          ListTouchDirection: 'left',
        });
      } else {
        return;
      }
    },
    // 滚动方向对应处理
    ListTouchEnd(e) {
      if (this.data.ListTouchDirection == 'right') {
        this.lastMonth(e);
      } else if (this.data.ListTouchDirection == 'left') {
        this.nextMonth(e);
      } else {
        return;
      }
      this.setData({
        ListTouchDirection: null,
      });
    },
  },

  // 生命周期
  lifetimes: {
    attached() {
      let year = ReDate().year, // 获取本年
        month = ReDate().month, // 获取本月是几月，mon+1 = 正常月
        today = ReDate().date_d, // 获取今日，给今日日期添加背景
        today_day = ReDate().today_day; // 获取今日星期几，给星期几添加背景

      // 存储初始数据
      this.setData({
        today,
        nowYear: year,
        nowMonth: month,
        nowDate: today,
        nowDay: today_day,
      });
      this.getBaseDate(year, month);
    },
    ready() {},
  },
  // 监听month的改变
  // 每当month发生改变，即：日历被重新渲染，必然被展开。所以重置foldit : false
  observers: {
    month: function() {
      this.setData({
        foldit: false,
      });
    },
  },
});
