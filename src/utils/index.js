/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
function parseTime(time, cFormat) {
    if (arguments.length === 0) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
        time = parseInt(time)
      }
      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
      const value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
      return value.toString().padStart(2, '0')
    })
    return time_str
  }

  /**
   * @param {number} time
   * @param {string} option
   * @returns {string}
   */
function formatTime(time, option) {
    if (('' + time).length === 10) {
      time = parseInt(time) * 1000
    } else {
      time = +time
    }
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d) / 1000

    if (diff < 30) {
      return '刚刚'
    } else if (diff < 3600) {
      // less 1 hour
      return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
      return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
      return '1天前'
    }
    if (option) {
      return parseTime(time, option)
    } else {
      return (
        d.getMonth() +
        1 +
        '月' +
        d.getDate() +
        '日' +
        d.getHours() +
        '时' +
        d.getMinutes() +
        '分'
      )
    }
  }

  /**
   * @param {string} url
   * @returns {Object}
   */
function param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
      return {}
    }
    return JSON.parse(
      '{"' +
        decodeURIComponent(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"')
          .replace(/\+/g, ' ') +
        '"}'
    )
  }
  function emptyText (val) {
    return isEmptyWord (val) ? '--': val
  }
  function isEmptyWord (val) {
    return val === null || val === undefined || val === ''
  }
  function sort (obj1, obj2, attr) {
    let val1 = obj1[attr];
    let val2 = obj2[attr];
    return val1 - val2;
  }
  // uuid
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  function getUuid() {
    // 用于生成uuid
    const id = (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4())
    return id;
  }
  
  /**
  * 返回倒计时
  * @param dt {Date}：目的Date对象
  * @return {Strin} ：返回倒计时：X天X时X分
  *   console.log(getDownTime(new Date('2015/06/01'))); // => 154天10时33分
  console.log(getDownTime(new Date('2014/01/01'))); // => -361天13时26分
  */
  function getDownTime(dt) {
      // 1.获取倒计时
      var intervalMsec = dt - Date.now(); // 目的时间减去现在的时间，获取两者相差的毫秒数
      var intervalSec = intervalMsec / 1000; // 转换成秒数
      var day = parseInt(intervalSec / 3600 / 24); // 天数
      var hour = parseInt((intervalSec - day * 24 * 3600) / 3600); // 小时
      var min = parseInt((intervalSec - day * 24 * 3600 - hour * 3600) / 60); // 分钟
   
      // 2.若相差的毫秒小于0 ,表示目的时间小于当前时间，这时的取的值都是负的：-X天-时-分，显示时，只显示天数前面为负的就行。
      if (intervalMsec < 0) {
          hour = 0 - hour;
          min = 0 - min;
      }
   
      // 3.拼接字符串并返回
      var rs = day + '天' + hour + '时' + min + '分';
      return rs;
  }
   
  // 当前时间：2014/12/28 13:26

  // export function debounce(func, wait, immediate) {
  //   let timeout, args, context, timestamp, result
  
  //   const later = function() {
  //     // 据上一次触发时间间隔
  //     const last = +new Date() - timestamp
  
  //     // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
  //     if (last < wait && last > 0) {
  //       timeout = setTimeout(later, wait - last)
  //     } else {
  //       timeout = null
  //       // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
  //       if (!immediate) {
  //         result = func.apply(context, args)
  //         if (!timeout) context = args = null
  //       }
  //     }
  //   }
  
  //   return function(...args) {
  //     context = this
  //     timestamp = +new Date()
  //     const callNow = immediate && !timeout
  //     // 如果延时不存在，重新设定延时
  //     if (!timeout) timeout = setTimeout(later, wait)
  //     if (callNow) {
  //       result = func.apply(context, args)
  //       context = args = null
  //     }
  //     return result
  //   }
  // }
  export function debounce(func, wait=200, immediate) {
    let timeout
    return function(...args) {
      clearTimeout(timeout)
      console.log(this.wait)
      timeout = setTimeout(() => {
        timeout = null
        if (!immediate) func.apply(this, args)
      }, wait)
      if (immediate && !timeout) func.apply(this, [...args])
    }
  }
  
  export function wait_for(func) {
    debugger
    console.log(this)
    func.apply(this, args)
  }
  export default {
    parseTime,
    formatTime,
    param2Obj,
    emptyText,
    isEmptyWord,
    sort,
    getUuid,
    debounce,
    wait_for
  }
