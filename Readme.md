# wx-easy-calendar

## 简介 Introduction

- 这是一个面向广大微信小程序开发者提供的开源日历组件；
- This is an open-source calendar component for all  WeiXin miniprogram developers;
- 集成了基本的日历显示、日期选择、日期切换；提供暗黑模式选择和日历折叠的功能；
- Including functions like basic calendar display, date selection, date switching, it also provides a dark mode selection and calendar folding functions;

---

## 上手 Prepare

- 准备工作：初始化项目

  ```js
  npm init -y
  ```

- npm 包的安装

  ```js
  npm install wx-easy-calendar -S --production
  ```

- 允许项目使用npm模块
  ![image-20220222001345197](wx-easy-calendar.readme.assets/image-20220222001345197.png)

- 开始构建
  ![image-20220222001414041](wx-easy-calendar.readme.assets/image-20220222001414041.png)

- 等待构建完成，项目根目录下会出现`miniprogram_npm`文件夹，包含`wx-easy-calendar`的一切

---

## 使用配置 Config

- 局部使用
  - 在需要使用的页面的 `json` 文件中，配置组件
    ![image-20220222001657743](wx-easy-calendar.readme.assets/image-20220222001657743.png)
  - key：`easy-calendar` 为自定义组件标签
  - value：指向npm文件夹下`wx-easy-calendar`组件的`js`文件
- 全局使用
  - 同上，只需要在全局的`app.json`中配置即可

---

## 正式使用 Render

- 在页面的 `wxml` 中，使用配置好的`自定义标签`
  ![image-20220222002644310](wx-easy-calendar.readme.assets/image-20220222002644310.png)

- 页面的渲染

  ![image-20220222002939341](wx-easy-calendar.readme.assets/image-20220222002939341.png)

  ![image-20220222002846113](wx-easy-calendar.readme.assets/image-20220222002846113.png)

  ---

  ## 用法介绍 Usage

  - 正常显示当前日历
  - tap选中日期
  - 左右滑动切换月份
  - 点击顶部左右箭头切换月份
  - 点击顶部年份/月份，精确选择日期
  - 点击[Now]，回到当前日期
  - 点击[暗]，折叠日历
  - 长按[按]，切换显示模式（light/dark）