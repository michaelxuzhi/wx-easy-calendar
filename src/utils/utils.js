function ReDate() {
  let date = new Date();
  let year = date.getFullYear(); // 获取年 111
  let month = date.getMonth(); // 获取正常月份-1 111
  let month_en = getMon(date.getMonth()); // 获取月份英文简写
  let date_d = date.getDate(); // 获取日期 111
  let day = date.getDay(); // 获取星期 111
  let day_cn = getWeek(date.getDay()); // 获取星期中文缩写 
  let firstDay = new Date(year, month, 1).getDay(); // 获取某月第一天星期
  let monthDay = new Date(year, month + 1, 0).getDate(); // 获取某月天数
  let today_day = new Date(year, month, date_d).getDay(); // 获取某月某日星期
  return {
    year,
    month,
    month_en,
    date_d,
    day,
    day_cn,
    firstDay,
    monthDay,
    today_day,
  };
}

function ReTime() {
  let date = new Date();
  let hour = get_0(date.getHours());
  let mins = get_0(date.getMinutes());
  let sec = get_0(date.getSeconds());
  return {
    hour,
    mins,
    sec,
  };
}

function getWeek(weeknum) {
  let week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return week[weeknum];
}

function getMon(mon) {
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

function get_0(i) {
  return i >= 10 ? '' + i : '0' + i;
}

export {
  ReDate,
  ReTime
};