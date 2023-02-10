export const getCount = (count) => {
  if(count < 0) return;
  if(count < 10000) {
    return count;
  } else if(Math.floor(count / 10000) < 10000) {
    return Math.floor(count/10000) + "万";
  } else  {
    return Math.floor(count / 10000000)/ 10 + "亿";
  }
}

// 防抖
export const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    if(timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      console.log('this', this) // undefined
      func.apply(this, args);
      clearTimeout(timer);
    }, delay);
  }
}


// 判断一个对象是否为空
export const isEmptyObject = obj => !obj || Object.keys (obj).length === 0;


//处理歌手列表拼接歌手名字
export const getName = list => {
  let str = '';
  list.map((item, index) => {
    str += index === 0 ? item.name : "/" + item.name;
    return item;
  });
  return str;
};




// 给 css3 相关属性增加浏览器前缀，处理浏览器兼容性问题
let elementStyle = document.createElement("div").style;

let vendor = (() => {
  // 首先通过 transition 属性判断是何种浏览器
  let transformNames = {
    webkit: "webkitTransform",
    Moz: "MozTransform",
    O: "OTransform",
    ms: "msTransform",
    standard: "Transform"
  };
  for (const key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }
  return false;
})();

export function prefixStyle(style) {
  if (vendor === false) {
    return false;
  }
  if (vendor === "standard") {
    return style;
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}

//转换歌曲播放时间
export const formatPlayTime = interval => {
  interval = interval | 0; // 取整
  const minute = (interval / 60) | 0; // 秒转分 取整
  const second = (interval % 60).toString().padStart(2, "0"); // 计算秒位置 填充0
  return `${minute}:${second}`;
};


//拼接出歌曲的url链接
export const getSongUrl = id => {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
};


//播放模式
export const playMode = {
  sequence: 0,
  loop: 1,
  random: 2
};

// 找到当前的歌曲索引
export const findIndex = (song, list) => {
  return list.findIndex(item => {
    return song.id === item.id;
  });
};


function getRandomInt(min, max) { // [min, max] 范围内一个随机整数
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// 随机算法
export function shuffle(arr) { // 将 arr 随机打乱
  let new_arr = [];
  arr.forEach(item => {
    new_arr.push(item);
  });
  for (let i = 0; i < new_arr.length; i++) {
    let j = getRandomInt(0, i);
    let t = new_arr[i];
    new_arr[i] = new_arr[j];
    new_arr[j] = t;
  }
  return new_arr;
}