import {
  getDateInfo
} from './utils/utils';
Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  // 外部传入的数据
  properties: {
    day_language: {
      type: String,
      value: "CHN",
    },
  },
  // 组件的初始数据
  data: {
    // CAL_HEIGHT: 550, // 日历高度,可改变，用于适配计算
    // DATE_ITEM_BOTTOM_MARGIN : 20, // 日期item底部距离，用于适配计算
    // isFold: false, // 是否收起，true：收起，false：展开
    isDark: false, // 是否黑暗模式，true：是，false：否
    defaultDayLang: 'CHN', // 默认日期语言
    dayLang: {
      CHN: ['日', '一', '二', '三', '四', '五', '六'],
      ENG: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    }, // 根据day_language来显示中文/英文
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 月份显示，获取到的月份+1 = 正常月份
    monthIndexShow(month) {
      let monthIndex = month + 1;
      // 让月份呈2位数字符串返回
      return monthIndex >= 10 ? '' + monthIndex : '0' + monthIndex;
    },
    // 返回今天星期几
    todayDay(year, month, date) {
      return new Date(year, month, date).getDay();
    },
    // 格式化处理日期，返回:{年:yyyy,月:mm,日:dd,日期字符串:yyyy-mm-dd}
    formatDate(year, month, date) {
      let dateStr = [year, month + 1, date]
        .map(i => {
          return i >= 10 ? '' + i : '0' + i;
        })
        .join('-');
      return {
        year,
        month,
        date,
        dateStr,
      };
    },
    // 获取月份的最后一天日期
    getMonthEndDate(year, month) {
      // 月份+1 = 正常月份
      return new Date(year, month + 1, 0).getDate();
    },
    // 获取月份天数数组详细信息
    getMonthDayArr(year, month) {
      let thisMonthEndDate = this.getMonthEndDate(year, month);
      let thisMonthEndDate_day = this.todayDay(year, month, thisMonthEndDate);
      let thisMonthBeginDate_day = this.todayDay(year, month, 1); // 给高度适配接口使用
      let {lastInfo,nextInfo} = this.getMonthInfo(year, month);
      let lastMonthEndDate = this.getMonthEndDate(lastInfo.year, lastInfo.month);
      // 计算该月份会渲染的line
      let monthDay = {};
      let line = this.adaptHeight(thisMonthEndDate,thisMonthEndDate_day,thisMonthBeginDate_day,lastMonthEndDate);
      monthDay.line = line;
      monthDay.date = [];
      // 获取月份的第一天星期几,前补足
      let firstday_Day = this.todayDay(year, month,1);
      if (firstday_Day) {
        for (let i = 0; i < firstday_Day; i++) {
          monthDay.date.push({
            date: lastMonthEndDate - firstday_Day + i + 1,
            year: lastInfo.year,
            month: lastInfo.month,
          })
        }
      }
      for (let date = 1; date <= thisMonthEndDate; date++) {
        monthDay.date.push({
          date,
          year,
          month
        });
      }
      // 获取月份的最后一天星期几,后补足 
      let distance = 6 - thisMonthEndDate_day;
      if (distance) {
        for (let j = 1; j <= distance; j++) {
          monthDay.date.push({
            date: j,
            year:nextInfo.year,
            month:nextInfo.month,
          })
        }
      }
      return monthDay;
    },

    // 月份的切换
    switchMonth(year, month, offset = 0) {
      let currentMonth = month + offset;
      let currentYear = currentMonth < 0 ? year - 1 : (currentMonth > 11 ? year + 1 : year);
      currentMonth = currentMonth < 0 ? 11 : (currentMonth > 11 ? 0 : currentMonth);
      let currentMonthNum = this.getMonthEndDate(currentYear, currentMonth);
      // 判断是否要更新日期,即:31日->30日
      let currentDate = this.data.date >= currentMonthNum ? currentMonthNum : this.data.date;
      this.setData({
        year: currentYear,
        month: currentMonth,
        date: currentDate,
      })
      this.concatDateArr(currentYear, currentMonth, offset);
    },

    // 上、本、下月份的年、月信息
    getMonthInfo(year, month) {
      let thisMonth_month = month;
      let thisMonth_year = year;
      let lastMonth_month = thisMonth_month - 1 < 0 ? 11 : thisMonth_month - 1;
      let lastMonth_year = thisMonth_month - 1 < 0 ? thisMonth_year - 1 : thisMonth_year;
      let nextMonth_month = thisMonth_month + 1 > 11 ? 0 : thisMonth_month + 1;
      let nextMonth_year = thisMonth_month + 1 > 11 ? thisMonth_year + 1 : thisMonth_year;
      return {
        lastInfo: {
          month: lastMonth_month,
          year: lastMonth_year,
        },
        thisInfo: {
          month: thisMonth_month,
          year: thisMonth_year,
        },
        nextInfo: {
          month: nextMonth_month,
          year: nextMonth_year,
        },
      };
    },

    // 上、本、下月的日期数据拼接
    concatDateArr(year, month, offset = 0) {
      let monthInfo = this.getMonthInfo(year, month);
      let {line:thisMonthLine,date:thisMonthDayArr} = this.getMonthDayArr(monthInfo.thisInfo.year, monthInfo.thisInfo.month);
      let {line:lastMonthLine,date:lastMonthDayArr} = this.getMonthDayArr(monthInfo.lastInfo.year, monthInfo.lastInfo.month);
      let {line:nextMonthLine,date:nextMonthDayArr} = this.getMonthDayArr(monthInfo.nextInfo.year, monthInfo.nextInfo.month);
      let monthFinal = [];
      // debugger;
      let nowCurrent = this.data.lastCurrent;
      // 求出需要清空替换月份数据的current
      let changeCurrent = (nowCurrent - offset) < 0 ? 2 : (nowCurrent - offset) > 2 ? 0 : (nowCurrent - offset);
      if (offset == 0){
        // monthFinal.date = [thisMonthDayArr,nextMonthDayArr,lastMonthDayArr];
        monthFinal = [{date:thisMonthDayArr,line:thisMonthLine},{date:nextMonthDayArr,line:nextMonthLine},{date:lastMonthDayArr,line:lastMonthLine}];
      }else if (offset == -1){
        let oldMonthFinal = this.data.monthFinal;
        oldMonthFinal[changeCurrent].date = lastMonthDayArr;
        oldMonthFinal[changeCurrent].line = lastMonthLine;
        monthFinal = oldMonthFinal;
      }else if (offset == 1) {
        let oldMonthFinal = this.data.monthFinal;
        oldMonthFinal[changeCurrent].date = nextMonthDayArr;
        oldMonthFinal[changeCurrent].line = nextMonthLine;
        monthFinal = oldMonthFinal;
      }
      let monthShow = this.monthIndexShow(month);
      this.setData({
        monthShow,
        monthFinal
      });
    },

    // 获取swiper的current
    getSwiperCurrent(e,inNowCurrent=null,inOtherCurrent=null) {
      let lastCurrent = !!inNowCurrent ?  Number(inNowCurrent): this.data.current;
      let nowCurrent = !!inOtherCurrent ? Number(inOtherCurrent): e.detail.current;
      // 防止点击切换的时候重复触发
      if ((nowCurrent - lastCurrent) == 0)return;
      this.setData({
        lastCurrent,
        current: nowCurrent,
      })
      this.getSwiperDirection(lastCurrent, nowCurrent);
    },

    // 判断切换方向，以下的判断逻辑是固定的，不能随意改变
    getSwiperDirection(lastCurrent, current) {
      let direction = current - lastCurrent;
      if (direction == -2) {
        // console.log('向右切换');
        this.switchMonth(this.data.year, this.data.month, 1);
      } else if (direction == 2) {
        // console.log('向左切换');
        this.switchMonth(this.data.year, this.data.month, -1);
      } else if (direction > 0) {
        // console.log('向右切换');
        this.switchMonth(this.data.year, this.data.month, 1);
      } else if (direction < 0) {
        // console.log('向左切换');
        this.switchMonth(this.data.year, this.data.month, -1);
      } else {
        this.switchMonth(this.data.year, this.data.month);
      }
    },
    // 点击选中日期
    tapDate(e) {
      let clickYear = e.currentTarget.dataset.year,
        clickMonth = e.currentTarget.dataset.month,
        clickDate = e.currentTarget.dataset.date;
      console.log(clickYear, clickMonth, clickDate);
      // 调优:非当前月份不可点击,和下一个if判断意思一样，二选一
      if (clickMonth != this.data.month && !this.data.isFold) return;
      let clickDateInfo = this.formatDate(clickYear, clickMonth, clickDate);
      if (clickMonth == this.data.month) {
        this.setData({
          date: clickDate,
        });
      } else {
        // 点击到了其他月份日期，需要重刷日历,先不做操作
        // console.log(e);
      }
      this.triggerEvent('clickDateChange', clickDateInfo);
    },
    // 返回当前日期,相当于重置
    backNow() {
      // 加个判断，避免当日的重复点击
      if (
        this.data.year == this.data.nowYear &&
        this.data.month == this.data.nowMonth
      ) {
        if (this.data.date == this.data.nowDate) return;
        this.setData({
          date: this.data.nowDate,
          day: this.data.nowDay,
        })
        return;
      }
      this.setData({
        year: this.data.nowYear,
        month: this.data.nowMonth,
        date: this.data.nowDate,
        day: this.data.nowDay,
        lastCurrent:0,
        current: 0,
      })
      this.concatDateArr(this.data.nowYear, this.data.nowMonth);
    },

    // 点击切换主题
    switchCss() {
      this.setData({
        isDark: !this.data.isDark,
      });
    },

    // 点击切换上个月份
    switchLastMonth() {
      let nowCurrent = this.data.current;
      let lastCurrent = (nowCurrent - 1) < 0 ? 2 : (nowCurrent - 1);
      // swiper的current值有0,传给getSwiperCurrent()后,会被当作false处理,所以这里需要将current转成string,在接收到之后再转成number
      this.getSwiperCurrent({}, nowCurrent+"", lastCurrent+"");
    },
    // 点击切换下个月份
    switchNextMonth() {
      let nowCurrent = this.data.current;
      let nextCurrent = (nowCurrent + 1) > 2 ? 0 : (nowCurrent + 1);
      this.getSwiperCurrent({}, nowCurrent+"", nextCurrent+"");
    },

    // 日期高度适配接口，有问题，需要继续优化
    adaptHeight(endDate,endDate_Day,beginDate_Day) {
      // let calContainerHeight = this.data.CAL_HEIGHT;
      // let dateItemMargin = this.data.DATE_ITEM_BOTTOM_MARGIN; // 底部距离
       // 算法：计算当前月份最后一天在渲染的日历的第line行
      let line = (endDate + 6 - endDate_Day + beginDate_Day) / 7;
      // console.log(line);
      return line;
      // dateItemMargin = (dateItemMargin - (90 - (calContainerHeight - 100) / line));
      // dateItemMargin = (calContainerHeight - 90*line) / line;
      // dateItemMargin = line<6?(calContainerHeight - 90*line) / line : 0;
      // console.log(dateItemMargin);
      // this.setData({
      //   line
      // })
    },

    // 点击改变date-picker当前日期
    bindDateChange(e) {
      let value = e.detail.value,
        pickYear = Number(value.substr(0, 4)), // 截取年份，转换成数字
        pickMonth = Number(value.substr(-2)) - 1; // 截取月份，-1转换成计算机的月份
      this.setData({
        year: pickYear,
        month: pickMonth,
        lastCurrent:0,
        current: 0,
      })
      this.concatDateArr(pickYear, pickMonth);
    },
  },

  // 生命周期
  lifetimes: {
    attached() {
      let {
        year,
        month,
        date,
        today_day
      } = getDateInfo();
      let monthShow = this.monthIndexShow(month);
      this.setData({
        year,
        month,
        date,
        day: today_day,
        monthShow,
        nowYear: year,
        nowMonth: month,
        nowDate: date,
        nowDay: today_day,
        lastCurrent:0,
        current: 0
      });
      this.concatDateArr(year, month, 0);
    },
    ready() {},
  },
  // 监听器
  observers: {
    // 监听属性变化，定义的回调处理
    'year,month,date': function(){
      let day = this.todayDay(this.data.year, this.data.month, this.data.date);
      this.setData({
        day,
      })
    },
  },
});