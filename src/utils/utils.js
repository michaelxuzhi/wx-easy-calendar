const DateContruct = new Date();

function getDateInfo() {
  let year = DateContruct.getFullYear(); // 获取年
  let month = DateContruct.getMonth(); // 获取正常月份-1
  let month_en = getENMon(DateContruct.getMonth()); // 获取月份英文简写
  let date = DateContruct.getDate(); // 获取日期
  let day = DateContruct.getDay(); // 获取星期
  let day_cn = getWeek(DateContruct.getDay()); // 获取星期中文缩写
  let firstDay_day = new Date(year, month, 1).getDay(); // 获取某月第一天星期
  let monthDay = new Date(year, month + 1, 0).getDate(); // 获取某月天数
  let today_day = new Date(year, month, date).getDay(); // 获取某月某日星期
  return {
    year,
    month,
    month_en,
    date,
    day,
    day_cn,
    firstDay_day,
    monthDay,
    today_day,
  };
}

function getTimeInfo() {
  let hour = formatTime(DateContruct.getHours());
  let mins = formatTime(DateContruct.getMinutes());
  let sec = formatTime(DateContruct.getSeconds());
  return {
    hour,
    mins,
    sec,
  };
}

function getWeek(weekNum) {
  let week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return week[weekNum];
}

function getENMon(mon) {
  let _mon = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  return _mon[mon];
}

function formatTime(i) {
  return i >= 10 ? '' + i : '0' + i;
}

export {
  getDateInfo,
  getTimeInfo
};