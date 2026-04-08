## electron打包配置

> 文章参考：[https://blog.csdn.net/duansamve/article/details/126494450](https://blog.csdn.net/duansamve/article/details/126494450)

### 安装 `electron-builder`

```bash
npm install electron-builder -g
```

### 配置 `package.json`

```json
"build": {
    "appId": "cc11001100.electron.example-001", // 程序包名
    "copyright": "CC11001100", // 版权相关信息
    "productName": "example-001", // 安装包文件名
    "directories": {
        "buildResources": "build", //指定打包需要的静态资源，默认是build
        "output": "dist" // 安装包生成目录
    },
    "nsis": {
        "oneClick": false, // 是否一键安装
        "allowElevation": true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
        "allowToChangeInstallationDirectory": true, // 允许修改安装目录
        "installerIcon": "./build/icons/aaa.ico",// 安装图标
        "uninstallerIcon": "./build/icons/bbb.ico",//卸载图标
        "installerHeaderIcon": "./build/icons/aaa.ico", // 安装时头部图标
        "createDesktopShortcut": true, // 创建桌面图标
        "createStartMenuShortcut": true,// 创建开始菜单图标
        "shortcutName": "xxxx", // 图标名称
        "include": "build/script/installer.nsh", // 包含的自定义nsis脚本 这个对于构建需求严格得安装过程相当有用。
    },
    "dmg": {
        "background": "res/background.png", // 背景图片的路径
        "icon": "build/icons/icon.icns", //安装图标
        "iconSize": 100, //图标的尺寸
        "contents": [ //安装图标在安装窗口中的坐标信息
            {
                "x": 380,
                "y": 180,
                "type": "link",
                "path": "/Applications"
            },
            {
                "x": 130,
                "y": 180,
                "type": "file"
            }
        ],
        "window": {
            // 启动后窗口左上角位置
            "x": 100,
            "y": 100,
            // 启动后窗口的大小
            "width": 500,
            "height": 300
        }
    },
    "mac": {
        "target": [
            "dmg",
            "zip"
        ], //安装包的格式，默认是"dmg"和"zip"
        "category": "public.app-category.utilities" //应用程序安装到哪个分类下，具体有哪些分类可以在苹果官网上找
    },
    "win": {
        "icon": "build/icons/food.png", // 安装包图标，必须为 256 * 256 像素图片
        "target": [
            "target": "nsis",
            "arch": [ // 这个意思是打出来32 bit + 64 bit的包，但是要注意：这样打包出来的安装包体积比较大，所以建议直接打32的安装包，默认64位。
                "x64", 
                "ia32"
            ]
        ]
    },
    "files": [
      "build/**/*",
      "main.js",
      "public/preload.js"
    ],
    "extends": null
}
```

### 源码

resources这个文件夹，这里面有个叫app.asar的文件

```bash
npm i asar -g
```

然后到这个目录直接解压这个文件：

```bash
asar e app.asar app

asar extract app.asar ./app
```

就可以看到源码了

## 源码保护

> 可以参考文章: [https://blog.csdn.net/uikoo9/article/details/123549457](https://blog.csdn.net/uikoo9/article/details/123549457)
