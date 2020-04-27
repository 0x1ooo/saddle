# Saddle

Saddle 是一个使用 Electron 开发的桌面 Trojan 客户端。

![build workflow badge](https://github.com/0x1ooo/saddle/workflows/build/badge.svg)

**_🚧 WORK IN PROGRESS 🚧 👷 👋_**

## 访问静态资源

所有静态资源（图片、字体等）必须放在项目的`assets`目录下。由于 Electron 开发和打包后的文件系统不同，目前不支持在 TSX 中`import`静态资源。

要在 JSX 中使用静态资源，必须调用`asset()`函数，并传入图片的绝对路径（根路径`/`相当于`assets`目录）。

例如：

```jsx
<img src={asset('/img/logo.svg')} className="App-logo" alt="logo" />
```
