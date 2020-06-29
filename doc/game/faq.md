
# 小游戏开发常见问题

---

Q: 游戏中如何获得显示区域的高度和宽度
> A: `width = window.innerWidth, height = window.innerHeight`

Q: 游戏在PC主播端运行出现滚动条怎么解决
> A: 在html中增加: `<style> body { margin: 0px; overflow: hidden; } </style>`

Q: PixiJS 测试及正式版在PC主播端运行出现错误控制台出现错误:"Current environment does not allow unsafe-eval, please use @pixi/unsafe-eval module to enable support."
> A: 使用插件: `@pixi/unsafe-eval` 解决, 参考: https://github.com/pixijs/pixi.js/blob/dev/packages/unsafe-eval/README.md
