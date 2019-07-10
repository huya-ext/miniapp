# 使用
### 1. 安装脚手架
`
npm i -g hyext
`

### 2. 安装对应的包

```javascript
cd ./app

hyext install

hyext run dev // app观众端
hyext run dev streamer // app助手端

```

```javascript
cd ./web

hyext install

hyext run dev
```

### 3. 打包

在打包的时候, 要切换到app/web的目录下，执行**hyext release**命令
