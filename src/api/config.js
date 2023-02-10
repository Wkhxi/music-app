import axios from "axios";

export const baseUrl = 'http://127.0.0.1:4000';


const axiosInstance = axios.create({
  baseURL: baseUrl
})



axiosInstance.interceptors.response.use(
  res => res.data,
  error => {
    console.log(error, '网络错误');
  }
)


export {
  axiosInstance
};



//顶部的高度
export const HEADER_HEIGHT = 45;


// 播放模式
export const playMode = {
  sequence: 0,
  loop: 1,
  random: 2
};