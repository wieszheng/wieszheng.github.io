# ADB 使用及说明

Android 调试桥 (adb) 是一个功能多样的命令行工具，可让您与设备进行通信。adb 命令可用于执行各种设备操作（例如安装和调试应用），并提供对
Unix shell（可用来在设备上运行各种命令）的访问权限。

## 常用命令

以下是一些常用的ADB命令及其说明。

### 查看连接设备

列出所有连接到电脑的安卓设备。

```bash
adb devices
```

### 进入设备Shell

进入设备的命令行界面。

```bash
adb shell
```

### 安装应用

将APK文件安装到设备上。

```bash
adb install <path_to_apk>
```

### 卸载应用

从设备卸载应用。

```bash
adb uninstall <package_name>
```

### 推送文件到设备

将电脑上的文件复制到设备。

```bash
adb push <local_path> <remote_path>
```

### 从设备拉取文件

将设备上的文件复制到电脑。

```bash
adb pull <remote_path> <local_path>
```

### 查看设备日志

实时查看设备的日志输出。

```bash
adb logcat
```

### 重启设备

重启连接的安卓设备。

```bash
adb reboot
``` 