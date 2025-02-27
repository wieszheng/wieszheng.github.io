# **0. 介绍**

内容主要基于B站狂神老师的Docker基础视频与部分网络docker博客总结,按照个人理解所整理总结。

- 视频链接:狂神说教程:https: [/www.bilibili.com/video/BV1og4y1q7M4](https://www.bilibili.com/video/BV1og4y1q7M4)
- CSDN相关笔记1:https: [/blog.csdn.net/THB66666/article/details/120856359(](https://blog.csdn.net/THB66666/article/details/120856359()只有基础, 不全)
- CSDN相关笔记2:https: [/blog.csdn.net/qq_21197507/article/details/115071715](https://blog.csdn.net/qq_21197507/article/details/115071715)(基础与 进阶都有)
- **1. 基础**
- 相对于虚拟机来说,Docker非常的轻,几百k~几十Mb
- 基于Go开发,开源项目
- 文档地址:https: [/docs.docker.com/](https://docs.docker.com/)
- 仓库地址:https: [/hub.docker.com/](https://hub.docker.com/)
- 容器化技术不是模拟一个完整的操作系统。

![](_page_2_Figure_6.jpeg)

- 左面是Docker。容器内的应用直接运行在 宿主机的内核上,容器是没有自己的内核的,也没有虚拟我们的 硬件,轻便了,每个容器都是互相隔离的,每个容器内都有一个属于自己的文件系统,互不影响。
- 右面是虚拟机,虚拟出一条硬件,运行一个完整的操作系统,然后在这个系统上安装运行软件。

# **DevOps 开发运维**

四个特点:

- 1. **更快速的交付和部署**
传统:一堆帮助文档,安装程序 Docker:打包镜像文件发布测试,一键运行

- 2. **更便捷的升级和扩缩容** 使用了Docker之后,我们部署应用就和 搭积木 一样。 项目打包为一个镜像,扩容, 服务器A 服务器B
- 3. **更简单的系统运维**

在容器化之后,我们的开发,测试环境都是高度一致的

- 4. **更高效的资源利用**
Docker是 内核级 的虚拟化,可以在一个物理机上运行很多的容器实例,服务器的性能可以被压榨 到极致。

![](_page_2_Picture_18.jpeg)

![](_page_3_Figure_0.jpeg)

- 1. 镜像(image):
docker镜像就好比是一个模板,可以通过这个模板来创建容器服务,tomcat镜像 > run >tomcat01 容器(提供服务),通过这个镜像可以创建多个容器(最终服务运行或者项目运行就是在容器中的)。

- 2. 容器(container): Docker利用容器技术可以独立运行一个或者一组应用,通过镜像来创建的,启动,停止、删除、基本命令 目前就可以把这个容器理解为一个简易的linux系统
- 3. 仓库(repository) 仓库就是存放镜像的地方!仓库分为公有和私有仓库! Docker hub(默认是国外的) 阿里云 .都有容器服务器(配置镜像加速!)

镜像就是类,容器就是实例化后的实体类,仓库就是用来存放镜像的地方

# **2 Docker配置与使用**

官网安装教程: https: [/docs.docker.com/engine/install/centos/](https://docs.docker.com/engine/install/centos/)

# **2.1 查看服务器linux系统版本**

[root@abc ~ # uname -r 3.10.0-1160.59.1.el7.x86_64

# **2.2 查看系统配置**

```
[root@abc ~ # cat /etc/os-release
NAME="CentOS Linux"
VERSION="7 (Core)"
ID="centos"
ID_LIKE="rhel fedora"
```

```
VERSION_ID="7"
PRETTY_NAME="CentOS Linux 7 (Core)"
ANSI_COLOR="0;31"
CPE_NAME="cpe:/o:centos:centos:7"
HOME_URL="https: /www.centos.org/"
BUG_REPORT_URL="https: /bugs.centos.org/"
CENTOS_MANTISBT_PROJECT="CentOS-7"
CENTOS_MANTISBT_PROJECT_VERSION="7"
REDHAT_SUPPORT_PRODUCT="centos"
REDHAT_SUPPORT_PRODUCT_VERSION="7"
```
# **2.3 安装Docker**

- 1. 卸载旧版本Docker

```
yum remove docker \
                      docker-client \
                      docker-client-latest \
                      docker-common \
                      docker-latest \
                      docker-latest-logrotate \
                      docker-logrotate \
                      docker-engine
```
- 2. 下载需要的安装包

```
1 yum install -y yum-utils
```
- 3. 设置镜像的仓库

```
4. 更新软件包索引
    国外的,慢
    yum-config-manager \
         -add-repo \
        https: /download.docker.com/linux/centos/docker-ce.repo
    国内的
    yum-config-manager\
         -add-repo \
        http: /mirrors.aliyun.com/dockerce/linux/centos/docker-ce.repo
 1
 2
 3
 4
 5
 6
 7
 8
```
1 yum makecache fast

- 5. 安装Docker引擎

```
docker-ce: 社区版 docker-ee企业版
```
1 yum install docker-ce docker-ce-cli containerd.io

- 6. 启动Docker
1 systemctl start docker

查看Docker版本 docker version

| [root@abc ~]# docker version      |                                          |  |  |  |  |  |  |  |
|-----------------------------------|------------------------------------------|--|--|--|--|--|--|--|
| Client: Docker Engine - Community |                                          |  |  |  |  |  |  |  |
| Version:                          | 20.10.16                                 |  |  |  |  |  |  |  |
| API version:                      | 1.41                                     |  |  |  |  |  |  |  |
| Go version:                       | go1.17.10                                |  |  |  |  |  |  |  |
| Git commit:                       | aa7e414                                  |  |  |  |  |  |  |  |
| Built:                            | Thu May 12 09:19:45 2022                 |  |  |  |  |  |  |  |
| OS/Arch:                          | linux/amd64                              |  |  |  |  |  |  |  |
| Context:                          | default                                  |  |  |  |  |  |  |  |
| Experimental:                     | true                                     |  |  |  |  |  |  |  |
|                                   |                                          |  |  |  |  |  |  |  |
| Server: Docker Engine - Community |                                          |  |  |  |  |  |  |  |
| Engine:                           |                                          |  |  |  |  |  |  |  |
| Version:                          | 20.10.16                                 |  |  |  |  |  |  |  |
| API version:                      | 1.41 (minimum version 1.12)              |  |  |  |  |  |  |  |
| Go version:                       | go1.17.10                                |  |  |  |  |  |  |  |
| Git commit:                       | f756502                                  |  |  |  |  |  |  |  |
| Built:                            | Thu May 12 09:18:08 2022                 |  |  |  |  |  |  |  |
| OS/Arch:                          | linux/amd64                              |  |  |  |  |  |  |  |
| Experimental:                     | false                                    |  |  |  |  |  |  |  |
| containerd:                       |                                          |  |  |  |  |  |  |  |
| Version:                          | 1.6.4                                    |  |  |  |  |  |  |  |
| GitCommit:                        | 212e8b6fa2f44b9c21b2798135fc6fb7c53efc16 |  |  |  |  |  |  |  |
| runc :                            |                                          |  |  |  |  |  |  |  |
| Version:                          | 1.1.1                                    |  |  |  |  |  |  |  |
| GitCommit:                        | v1.1.1-0-g52de29d                        |  |  |  |  |  |  |  |
| docker-init:                      |                                          |  |  |  |  |  |  |  |
| Version:                          | 0.19.0                                   |  |  |  |  |  |  |  |
| GitCommit:                        | de40ad0                                  |  |  |  |  |  |  |  |
| [root@abc ~]#                     |                                          |  |  |  |  |  |  |  |

- 7. 测试helloWorld
### 1 docker run hello-world

| 此界面仅表示docker安装成功      |  |  |  |  |  |  |  |  |
|-----------------------|--|--|--|--|--|--|--|--|
|                       |  |  |  |  |  |  |  |  |
|                       |  |  |  |  |  |  |  |  |
|                       |  |  |  |  |  |  |  |  |
| 8. 查看下载的Hello-world镜像 |  |  |  |  |  |  |  |  |
| docker images         |  |  |  |  |  |  |  |  |
|                       |  |  |  |  |  |  |  |  |
|                       |  |  |  |  |  |  |  |  |
|                       |  |  |  |  |  |  |  |  |

# **2.4 卸载Docker**

1. 卸载依赖

1 sudo yum remove docker-ce docker-ce-cli containerd.io

### 2. 删除目录(运行环境/资源)

- sudo rm -rf /var/lib/docker 1
- sudo rm -rf /var/lib/containerd 2
- #/var/lib/docker 默认工作路径 3

# **2.5 阿里云镜像加速**

#### 1. 登录阿里云,找到镜像服务

![](_page_7_Figure_2.jpeg)

#### 2. 找到镜像加速地址

|        |   |                                                               | Q 搜索                                                             | 藤用                                                                                                                                                                                                                                      | 工商 | ICP 备案 | 企业 | 支持 |  |  |  |       |
|--------|---|---------------------------------------------------------------|------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----|--------|----|----|--|--|--|-------|
| 容器镜像服务 |   | 容器镜像服务 / 镜像加速器                                                |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
|        |   | 镜像加速器                                                         |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
|        | く |                                                               |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
| 制品中心   |   |                                                               |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
| 镜像搜索   |   |                                                               |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
| 我的收藏   |   |                                                               |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
|        | く |                                                               |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
| 镜像加速器  |   | 操作文档                                                          |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
|        |   | CentOS<br>Windows<br>Ubuntu<br>Mac                            |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
|        |   | 1. 安装 / 升级Docker客户端                                           |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
|        |   |                                                               |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
|        |   | 2. 配置镜像加速器                                                    |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
|        |   | 针对Docker客户端版本大于 1.10.0 的用户                                    |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
|        |   |                                                               |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
|        |   | sudo mkdir -p /etc/docker                                     |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
|        |   | {                                                             |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
|        |   | }<br>EOF                                                      |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
|        |   | sudo systemctl daemon-reload<br>sudo systemctl restart docker |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
|        |   |                                                               |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  | ﻟﺘﻲ ﺗ |
|        |   |                                                               |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  | 日常    |
|        |   |                                                               |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
|        |   |                                                               |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
|        |   |                                                               |                                                                  |                                                                                                                                                                                                                                         |    |        |    |    |  |  |  |       |
|        |   |                                                               | 命 工作台<br>加速器<br>加速器地址<br>https://jfqibt7a.mirror.aliyuncs.com 复制 | ♀ 使用加速器可以提升获取Docker官方镜像的速度<br>推荐安装 1.10.0 以上版本的Docker客户端,参考文档docker-ce<br>您可以通过修改daemon配置文件 /etc/docker/daemon.json 来使用加速器<br>sudo tee /etc/docker/daemon.json <<-"EOF"<br>"registry-mirrors": ["https://jfqibt7a.mirror.aliyuncs.com"] |    |        |    |    |  |  |  |       |

![](_page_8_Figure_0.jpeg)

- 1. 创建文件夹哎
- 2. 设置阿里云镜像加速
- 3. 重启服务
- 4. 重启Docker

# **2.6 回顾Hello-world流程**

![](_page_9_Figure_0.jpeg)

![](_page_9_Figure_1.jpeg)

# **2.7 底层原理**

Docker Engine是一个客户端-服务器(C/S,Client/Server)应用程序,具有以下主要组件:

- 一个服务器,它是一种长期运行的程序,称为守护进程(dockerd命令),Docker的守护进程运行在主机 上,通过Socket从客户端访问。
- 一个REST API,它指定程序可以用来与守护进程对话并指示它做什么的接口。
	- Docker是一个**Client Server结构的系统**,Docker守护进程运行在主机上,然后通过Socket连接 从客户端访问,守护进程从客户端接受命令并管理运行在主机上的容器。
	- **容器,是一个运行时环境就是我们所说的集装箱。**

![](_page_9_Figure_8.jpeg)

# **2.8 为什么Docker比Vm快**

![](_page_10_Picture_1.jpeg)

- docker有着比虚拟机更少的抽象层。由于docker不需要Hypervisor实现硬件资源虚拟化,运行在 *docker*容器上的程序直接使用的都是实际物理机的硬件资源 。因此在CPU、内存利用率上docker将会在效 率上有明显优势。
- **docker利用的是宿主机的内核,而不需要Guest OS**。因此,当新建一个 容器时,docker不需要和虚拟机一 样重新加载一个操作系统内核。仍而避免引寻、加载操作系统内核返个比较费时费资源的过程,当新建一个 虚拟机时,虚拟机软件需要加载GuestOS,返个新建过程是分钟级别的。而docker由于直接利用宿主机的操 作系统,则省略了返个过程,因此新建一个docker容器只需要几秒钟。

| Bins/Libs   Bins/Libs<br>虚拟机(VM)<br>Docker容器<br>App 2 App 3<br>App 1<br>GUART OS<br>Bins/Libs   Bins/Libs<br>操作系统<br>与宿主机共享OS<br>Bins/Libs<br>宿主机OS上运行虚拟机OS<br>Docker Engine<br>镜像小,便于存储与传输<br>镜像庞大 (vmdk、vdi等)<br>存储大小<br>Hypervisor<br>Operating System<br>Host Operating System<br>操作系统额外的CPU、内存消耗<br>运行性能<br>几乎无额外性能损失<br>Infrastructure<br>Infrastructure<br>그들으<br>轻便、灵活,适应于Linux<br>笨重,与虚拟化技术耦合度高<br>移植性<br>1 = 0<br>硬件亲和性<br>面向软件开发者<br>面向硬件运维者 | Cop 1     | Ann 2 | App 3 |  |  |  |  |  |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-------|-------|--|--|--|--|--|
|                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Bins/Libs |       |       |  |  |  |  |  |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                         |           |       |       |  |  |  |  |  |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                         |           |       |       |  |  |  |  |  |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                         |           |       |       |  |  |  |  |  |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                         |           |       |       |  |  |  |  |  |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                         |           |       |       |  |  |  |  |  |

# **3 Docker 常用命令**

| ← → C ▲ 不安全   47.94.235.187:8088/#/Images |     |                                            |                                                    |                            |          |                     |  |  |
|-------------------------------------------|-----|--------------------------------------------|----------------------------------------------------|----------------------------|----------|---------------------|--|--|
| portainer.io                              | 22  | Imago list ලි<br>lmages                    |                                                    |                            |          | o Por               |  |  |
| Home<br>+ LOCAL                           | 14  | & Pull image                               |                                                    |                            |          |                     |  |  |
| Dashboard                                 | ക   | Registry                                   | DockerHub                                          |                            |          |                     |  |  |
| App Templates                             | 4   | Image                                      | docker.lo<br>e.g. mylmage:myTag                    |                            |          |                     |  |  |
| Stacks                                    | 道   |                                            |                                                    |                            |          |                     |  |  |
| Containers                                | li  | A Image name is required.                  |                                                    |                            |          |                     |  |  |
| Images                                    | 0   | @ Advanced mode                            |                                                    |                            |          |                     |  |  |
| Networks                                  | de  | Pull the image                             |                                                    |                            |          |                     |  |  |
| Volumes                                   | 4   |                                            |                                                    |                            |          |                     |  |  |
| Events                                    | 9   |                                            |                                                    |                            |          |                     |  |  |
| Host                                      | 활동  | @ Images                                   |                                                    |                            |          |                     |  |  |
| SETTINGS                                  |     | Remove ·                                   | + Build a new image   1. Import     Export         |                            |          |                     |  |  |
| Extensions                                | 4   | Q Search_                                  |                                                    |                            |          |                     |  |  |
| Users                                     | 423 | 0 14                                       |                                                    | Tags 12                    | Size     | Created             |  |  |
| Endpoints                                 | 4   | Filter T                                   |                                                    |                            |          |                     |  |  |
| Registries                                | 0   |                                            | [] sha256:0d120b6ccaa8c5e149176798b3501d. . Unused | centos-latest              | 215.1 MB | 2020-08-11 02:19:49 |  |  |
| Settings                                  | 8   | ■ zha256: f29a1cc41030e3963026369105f3be   |                                                    | elasticsearch=7.6.2        | 790,7 MB | 2020-03-26 14:39:43 |  |  |
|                                           |     |                                            | ■ zha256; 08393e824c32d456ff69aec72c84d1   Unused  | ngiroulatest               | 1325 MB  | 2020-08-05 08-27:17 |  |  |
|                                           |     | [ ] xhx256: 62771b0b9b0973x3e8e95595534x12 |                                                    | portainer/portaineniatest  | 79.1 MB  | 2020-07-23 06:47:49 |  |  |
|                                           |     |                                            | zha256:2==23eb477==82782438=429£22e55.   Unused    | tomcat/9.0   tomcatilatest | 647.5 MB | 2020-08-06 03:23:06 |  |  |

# **3.1 帮助命令**

| 1 |             | docker version | #显示docker的版本信息。           |  |
|---|-------------|----------------|---------------------------|--|
| 2 | docker info |                | #显示docker的系统信息,包括镜像和容器的数量 |  |
| 3 | docker 命令   |                | -help #帮助命令               |  |

帮助文档的地址:https: [/docs.docker.com/engine/reference/commandline/docker/](https://docs.docker.com/engine/reference/commandline/docker/)

# **3.2 镜像命令**

### **docker images 查看所有本地主机上的镜像**


| 1  | docker images [-a,-q,-aq] |            |              |              |  |  |
|----|---------------------------|------------|--------------|--------------|--|--|
| 2  |                           |            |              |              |  |  |
| 3  | 仓库                        | 标签         | ID           | 创建时间         |  |  |
|    | 大小                        |            |              |              |  |  |
| 4  |                           |            |              |              |  |  |
| 5  | REPOSITORY                | TAG        | IMAGE ID     | CREATED      |  |  |
|    | SIZE                      |            |              |              |  |  |
| 6  | hello-world               | latest     | bf756fb1ae65 | 7 months ago |  |  |
|    | 13.3kB                    |            |              |              |  |  |
| 7  |                           |            |              |              |  |  |
| 8  |                           |            |              |              |  |  |
| 9  | # 可选项                     |            |              |              |  |  |
| 10 | -all , -a                 | # 列出所有镜像   |              |              |  |  |
| 11 | -quiet , -q               | # 只显示镜像的id |              |              |  |  |

### **docker search #搜索镜像**


| 1 |       | docker search mysql [-f=AAA=BBB] |             |
|---|-------|----------------------------------|-------------|
| 2 |       |                                  |             |
| 3 |       |                                  |             |
| 4 |       |                                  |             |
| 5 | NAME  |                                  | DESCRIPTION |
|   | STARS | OFFICIAL                         | AUTOMATED   |

![](_page_12_Figure_0.jpeg)

### **docker pull 下载镜像**

| 1  | # 下载镜像,docker pull 镜像名[:tag]                                            |  |  |  |  |
|----|-------------------------------------------------------------------------|--|--|--|--|
| 2  | •<br>[root@iZ2zeg4ytp0whqtmxbsqiiZ ~]# docker pull mysql                |  |  |  |  |
| 3  | Using default tag: latest<br># 如果不写tag,默认就是latest                       |  |  |  |  |
| 4  | latest: Pulling from library/mysql                                      |  |  |  |  |
| 5  | # 分层下载,docker images 的核心,联合文件<br>bf5952930446: Pull complete            |  |  |  |  |
|    | 系统                                                                      |  |  |  |  |
| 6  | 8254623a9871: Pull complete                                             |  |  |  |  |
| 7  | 938e3e06dac4: Pull complete                                             |  |  |  |  |
| 8  | ea28ebf28884: Pull complete                                             |  |  |  |  |
| 9  | f3cef38785c2: Pull complete                                             |  |  |  |  |
| 10 | 894f9792565a: Pull complete                                             |  |  |  |  |
| 11 | 1d8a57523420: Pull complete                                             |  |  |  |  |
| 12 | 6c676912929f: Pull complete                                             |  |  |  |  |
| 13 | ff39fdb566b4: Pull complete                                             |  |  |  |  |
| 14 | fff872988aba: Pull complete                                             |  |  |  |  |
| 15 | 4d34e365ae68: Pull complete                                             |  |  |  |  |
| 16 | 7886ee20621e: Pull complete                                             |  |  |  |  |
| 17 | Digest:                                                                 |  |  |  |  |
|    | sha256:c358e72e100ab493a0304bda35e6f239db2ec8c9bb836d8a427ac34307d074ed |  |  |  |  |
|    | # 签名                                                                    |  |  |  |  |
| 18 | Status: Downloaded newer image for mysql:latest                         |  |  |  |  |
| 19 | docker.io/library/mysql:latest<br># 真实地址                                |  |  |  |  |
| 20 |                                                                         |  |  |  |  |
| 21 | # 等价于,下面两个命令是等价的。                                                       |  |  |  |  |
| 22 | •<br>docker pull mysql                                                  |  |  |  |  |
| 23 | •<br>docker pull docker.io/library/mysql:latest                         |  |  |  |  |
| 24 |                                                                         |  |  |  |  |
| 25 | ---------------------------------------------------------------------   |  |  |  |  |
| 26 | # 指定版本下载                                                                |  |  |  |  |
| 27 | •<br>docker pull mysql:5.7                                              |  |  |  |  |
| 28 | 5.7: Pulling from library/mysql                                         |  |  |  |  |
| 29 | bf5952930446: Already exists<br># 已存在,表示共用,可以极大的节省内存                    |  |  |  |  |
|    |                                                                         |  |  |  |  |

| 30 | 8254623a9871: Already exists                         |                                                                         |              |              |  |  |
|----|------------------------------------------------------|-------------------------------------------------------------------------|--------------|--------------|--|--|
| 31 | 938e3e06dac4: Already exists                         |                                                                         |              |              |  |  |
| 32 | ea28ebf28884: Already exists                         |                                                                         |              |              |  |  |
| 33 | f3cef38785c2: Already exists                         |                                                                         |              |              |  |  |
| 34 | 894f9792565a: Already exists                         |                                                                         |              |              |  |  |
| 35 | 1d8a57523420: Already exists                         |                                                                         |              |              |  |  |
| 36 | 5f09bf1d31c1: Pull complete                          | # 没有的才需要下载更新                                                            |              |              |  |  |
| 37 | 1b6ff254abe7: Pull complete                          |                                                                         |              |              |  |  |
| 38 | 74310a0bf42d: Pull complete                          |                                                                         |              |              |  |  |
| 39 | d398726627fd: Pull complete                          |                                                                         |              |              |  |  |
| 40 | Digest:                                              |                                                                         |              |              |  |  |
|    |                                                      | sha256:da58f943b94721d46e87d5de208dc07302a8b13e638cd1d24285d222376d6d84 |              |              |  |  |
| 41 | Status: Downloaded newer image for mysql:5.7         |                                                                         |              |              |  |  |
| 42 | docker.io/library/mysql:5.7                          |                                                                         |              |              |  |  |
| 43 |                                                      |                                                                         |              |              |  |  |
| 44 | # 查看本地镜像                                             |                                                                         |              |              |  |  |
| 45 | •<br>[root@iZ2zeg4ytp0whqtmxbsqiiZ ~]# docker images |                                                                         |              |              |  |  |
| 46 | REPOSITORY                                           | TAG                                                                     | IMAGE ID     | CREATED      |  |  |
|    | SIZE                                                 |                                                                         |              |              |  |  |
| 47 | mysql                                                | 5.7                                                                     | 718a6da099d8 | 6 days ago   |  |  |
|    | 448MB                                                |                                                                         |              |              |  |  |
| 48 | mysql                                                | latest                                                                  | 0d64f46acfd1 | 6 days ago   |  |  |
|    | 544MB                                                |                                                                         |              |              |  |  |
| 49 | hello-world                                          | latest                                                                  | bf756fb1ae65 | 7 months ago |  |  |
|    | 13.3kB                                               |                                                                         |              |              |  |  |
| 50 |                                                      |                                                                         |              |              |  |  |
|    |                                                      |                                                                         |              |              |  |  |

### **docker rmi 删除镜像**

-f 是全部删除,可以通过imageID来删除,也可以通过name来删除。

| 1 | [root@abc ~]# docker rmi -f 镜像ID                    | #删除指定的镜像 |
|---|-----------------------------------------------------|----------|
| 2 | • [root@abc ~]# docker rmi -f 镜像ID 镜像ID 镜像ID        | #删除多个镜像  |
| 3 | • [root@abc ~]# docker rmi -f \$(docker images -aq) | #删除所有镜像  |
| 4 |                                                     |          |

# **3.3 容器命令**

### **3.3.1 下载CentOs镜像**

```
docker pull centos
   ----------------------------
   • [root@localhost ~]# docker pull centos
   Using default tag: latest
   latest: Pulling from library/centos

```

| 7  | a1d0c7532777: Pull complete                                             |        |              |              |        |
|----|-------------------------------------------------------------------------|--------|--------------|--------------|--------|
| 8  | Digest:                                                                 |        |              |              |        |
|    | sha256:a27fd8080b517143cbbbab9dfb7c8571c40d67d534bbdee55bd6c473f432b177 |        |              |              |        |
| 9  | Status: Downloaded newer image for centos:latest                        |        |              |              |        |
| 10 | docker.io/library/centos:latest                                         |        |              |              |        |
| 11 |                                                                         |        |              |              |        |
| 12 | •<br>[root@localhost ~]# docker images                                  |        |              |              |        |
| 13 |                                                                         |        |              |              |        |
| 14 | REPOSITORY                                                              | TAG    | IMAGE ID     | CREATED      | SIZE   |
| 15 | mysql                                                                   | latest | 3218b38490ce | 5 months ago | 516MB  |
| 16 | hello-world                                                             | latest | feb5d9fea6a5 | 8 months ago | 13.3kB |
| 17 | centos                                                                  | latest | 5d0da3dc9764 | 8 months ago | 231MB  |

| 1  | docker run<br>镜像id<br>#新建容器并启动              |
|----|---------------------------------------------|
| 2  |                                             |
| 3  | • docker ps 列出所有运行的容器 docker container list |
| 4  |                                             |
| 5  | • docker rm 容器id #删除指定容器                    |
| 6  |                                             |
| 7  | • docker start 容器id #启动容器                   |
| 8  | • docker restart 容器id<br>#重启容器              |
| 9  | • docker stop 容器id<br>#停止当前正在运行的容器          |
| 10 | • docker kill 容器id<br>#强制停止当前容器             |

### **3.3.2 docker run 新建容器并启动**

```
docker run [可选参数] image | docker container run [可选参数] image
   # 参数说明
    -name="Name" 容器名字 tomcat01 tomcat02 用来区分容器
   -d 后台方式运行
   -it 使用交互方式运行,进入容器查看内容,不用这个参数进不去容器
   -p(小写) 指定容器的端口 -p 8080:8080
      1. -p ip:主机端口:容器端口
      2. -p 主机端口:容器端口(常用)(映射)
      3. -p 容器端口
      4. 容器端口
   -P(大写) 随机指定端口
    -------------------------------------------------------------
   # 测试,启动并进入容器
   • [root@localhost ~]# docker run -it centos /bin/bash
             主机名就是镜像ID
   • [root@7e77b4c56100 /]# ls # 查看容器内的centos,基础版本,很多命令是不完善的
   bin etc lib lost+found mnt proc run srv tmp var
   dev home lib64 media opt root sbin sys usr
   # 从容器中退回主机
   [root@77969f5dcbf9 /]# exit
```
## **3.3.3 docker ps 列出所有运行的容器**


| 1  | docker ps 命令                    | #列出当前正在运行的容器                                             |
|----|---------------------------------|----------------------------------------------------------|
| 2  | -a,<br>-all                     | #列出当前 正在 运行的容器 + 带出历史运行过的容器                              |
| 3  | -n=?,<br>-last int              | #列出最近创建的?个容器 ?为1则只列出最近创建的一个容器,为2则列出                      |
|    | 2个                              |                                                          |
| 4  | -q,<br>-quiet                   | #只列出容器的编号                                                |
| 5  |                                 |                                                          |
| 6  |                                 | -------------------------------------------------------- |
| 7  | [root@abc ~]# docker ps -a -n=1 |                                                          |
| 8  |                                 |                                                          |
| 9  | [root@abc ~]# docker ps #看看     |                                                          |
| 10 |                                 |                                                          |
| 11 | [root@abc ~]# docker ps -a      |                                                          |
| 12 |                                 |                                                          |
| 13 | [root@abc ~]# docker ps -aq     |                                                          |

### **3.3.4 exit 退出容器**

exit #容器直接退出 ctrl +P +Q #容器不停止退出 -注意:这个很有用的操作, 这是命令不是键盘快捷键 1 2

### **3.3.5 docker rm 删除容器**

docker rm 容器id #删除指定的容器,不能删除正在运行的容器,如果要强制 删除 rm -rf • docker rm -f \$(docker ps -aq) #删除所有的容器(后面 \${}是参数传递),历史记 录也删除了 • docker ps -a -q|xargs docker rm #删除所有的容器 1 2 3

### **3.3.6 docker start restart stop kill 启动和停止容器的操作**

| 1 | docker start 容器id<br>#启动容器         |
|---|------------------------------------|
| 2 | • docker restart 容器id<br>#重启容器     |
| 3 | • docker stop 容器id<br>#停止当前正在运行的容器 |
| 4 | • docker kill 容器id<br>#强制停止当前容器    |

# **3.4. 常用其他命令**

### **3.4.1 后台启动容器 docker run -d**


| 1 | # 命令 docker run -d 镜像名                                           |
|---|------------------------------------------------------------------|
| 2 | -----------------------------------------------------------      |
| 3 | [root@localhost ~]# docker run -d centos                         |
| 4 | 77ac366130abee70553194e77889bbc9d988859cee730aead8829efafa1ae40d |
| 5 | # 问题 docker ps, 发现centos停止了                                      |
| 6 | # 常见的坑, docker 容器使用后台运行, 就必须要有一个前台进程,docker发现没有应用,就会             |
|   | 自动停止                                                             |
| 7 | # nginx, 容器启动后,发现自己没有提供服务,就会立即停止,就是没有程序了                         |

## **3.4.2 查看日志 docker logs**

![](_page_16_Figure_3.jpeg)

### **3.4.3 查看容器中进程信息 docker top**

| 1  | #命令 docker top 容器ID                           |                |                        |                                                |                |     |            |
|----|-----------------------------------------------|----------------|------------------------|------------------------------------------------|----------------|-----|------------|
| 2  | --------------                                |                |                        |                                                |                |     |            |
| 3  | • [root@localhost ~]# docker ps               |                |                        |                                                |                |     |            |
| 4  | CONTAINER ID<br>PORTS                         | IMAGE<br>NAMES | COMMAND                |                                                | CREATED        |     | STATUS     |
| 5  | c55c1a083e2e                                  | centos         | "/bin/sh -c 'while t…" |                                                | 12 minutes ago |     | Up 12      |
|    | minutes                                       |                | fervent_beaver         |                                                |                |     |            |
| 6  | • [root@localhost ~]# docker top c55c1a083e2e |                |                        |                                                |                |     |            |
| 7  | 用户ID                                          | 进程ID           |                        | 父进程ID                                          |                |     |            |
| 8  | UID                                           | PID            |                        | PPID                                           |                | C   |            |
|    | STIME                                         |                | TTY                    | TIME                                           |                | CMD |            |
| 9  | root                                          | 11132          |                        | 11113                                          |                | 0   |            |
|    | 10:33                                         |                | ?                      | 00:00:00                                       |                |     | /bin/sh -c |
|    | while true;do echo 123YX;sleep 1;done         |                |                        |                                                |                |     |            |
| 10 | root                                          | 12498          |                        | 11132                                          |                | 0   |            |
|    | 10:47                                         |                | ?                      | 00:00:00                                       |                |     |            |
|    | /usr/bin/coreutils                            |                |                        | -coreutils-prog-shebang=sleep /usr/bin/sleep 1 |                |     |            |
| 11 |                                               |                |                        |                                                |                |     |            |

### **3.4.4 查看镜像的元数据 docker inspect**

![](_page_16_Picture_7.jpeg)

| 7  | 镜像id只是全路径id的一个缩写                                                          |  |  |
|----|---------------------------------------------------------------------------|--|--|
| 8  | "Id":                                                                     |  |  |
|    | "c55c1a083e2e5e33d6a5577e4ac9d953718f746bcf79841a7b9fa7deb643c5a2",       |  |  |
| 9  | 创建时间                                                                      |  |  |
| 10 | "Created": "2022-05-24T02:33:45.796548118Z",                              |  |  |
| 11 | 控制台                                                                       |  |  |
| 12 | "Path": "/bin/sh",                                                        |  |  |
| 13 | 传递的参数                                                                     |  |  |
| 14 | "Args": [                                                                 |  |  |
| 15 | "-c",                                                                     |  |  |
| 16 | "while true;do echo 123YX;sleep 1;done"                                   |  |  |
| 17 | ],                                                                        |  |  |
| 18 | 状态                                                                        |  |  |
| 19 | "State": {                                                                |  |  |
| 20 | "Status": "running",                                                      |  |  |
| 21 | "Running": true,                                                          |  |  |
| 22 | "Paused": false,                                                          |  |  |
| 23 | "Restarting": false,                                                      |  |  |
| 24 | "OOMKilled": false,                                                       |  |  |
| 25 | "Dead": false,                                                            |  |  |
| 26 | "Pid": 11132,                                                             |  |  |
| 27 | "ExitCode": 0,                                                            |  |  |
| 28 | "Error": "",                                                              |  |  |
| 29 | "StartedAt": "2022-05-24T02:33:46.224199282Z",                            |  |  |
| 30 | "FinishedAt": "0001-01-01T00:00:00Z"                                      |  |  |
| 31 | },                                                                        |  |  |
| 32 | "Image":                                                                  |  |  |
|    | "sha256:5d0da3dc976460b72c77d94c8a1ad043720b0416bfc16c52c45d4847e53fadb6" |  |  |
|    | ,                                                                         |  |  |
| 33 | "ResolvConfPath":                                                         |  |  |
|    | "/var/lib/docker/containers/c55c1a083e2e5e33d6a5577e4ac9d953718f746bcf798 |  |  |
|    | 41a7b9fa7deb643c5a2/resolv.conf",                                         |  |  |
| 34 | "HostnamePath":                                                           |  |  |
|    | "/var/lib/docker/containers/c55c1a083e2e5e33d6a5577e4ac9d953718f746bcf798 |  |  |
|    | 41a7b9fa7deb643c5a2/hostname",                                            |  |  |
| 35 | "HostsPath":                                                              |  |  |
|    | "/var/lib/docker/containers/c55c1a083e2e5e33d6a5577e4ac9d953718f746bcf798 |  |  |
|    | 41a7b9fa7deb643c5a2/hosts",                                               |  |  |
| 36 | "LogPath":                                                                |  |  |
|    | "/var/lib/docker/containers/c55c1a083e2e5e33d6a5577e4ac9d953718f746bcf798 |  |  |
|    | 41a7b9fa7deb643c5a2/c55c1a083e2e5e33d6a5577e4ac9d953718f746bcf79841a7b9fa |  |  |
|    | 7deb643c5a2-json.log",                                                    |  |  |
| 37 | "Name": "/fervent_beaver",                                                |  |  |
| 38 | "RestartCount": 0,                                                        |  |  |
|    |                                                                           |  |  |
| 39 | "Driver": "overlay2",                                                     |  |  |
| 40 | "Platform": "linux",                                                      |  |  |
| 41 | "MountLabel": "",                                                         |  |  |
| 42 | "ProcessLabel": "",                                                       |  |  |
| 43 | "AppArmorProfile": "",                                                    |  |  |
| 44 | "ExecIDs": null,                                                          |  |  |
| 45 | "HostConfig": {                                                           |  |  |
| 46 | "Binds": null,                                                            |  |  |
| 47 | "ContainerIDFile": "",                                                    |  |  |
| 48 | "LogConfig": {                                                            |  |  |
| 49 | "Type": "json-file",                                                      |  |  |

| 105 | "DeviceRequests": null,                                                   |  |  |  |  |  |
|-----|---------------------------------------------------------------------------|--|--|--|--|--|
| 106 | "KernelMemory": 0,                                                        |  |  |  |  |  |
| 107 | "KernelMemoryTCP": 0,                                                     |  |  |  |  |  |
| 108 | "MemoryReservation": 0,                                                   |  |  |  |  |  |
| 109 | "MemorySwap": 0,                                                          |  |  |  |  |  |
| 110 | "MemorySwappiness": null,                                                 |  |  |  |  |  |
| 111 | "OomKillDisable": false,                                                  |  |  |  |  |  |
| 112 | "PidsLimit": null,                                                        |  |  |  |  |  |
| 113 | "Ulimits": null,                                                          |  |  |  |  |  |
| 114 | "CpuCount": 0,                                                            |  |  |  |  |  |
| 115 | "CpuPercent": 0,                                                          |  |  |  |  |  |
| 116 | "IOMaximumIOps": 0,                                                       |  |  |  |  |  |
| 117 | "IOMaximumBandwidth": 0,                                                  |  |  |  |  |  |
| 118 | "MaskedPaths": [                                                          |  |  |  |  |  |
| 119 | "/proc/asound",                                                           |  |  |  |  |  |
| 120 | "/proc/acpi",                                                             |  |  |  |  |  |
| 121 | "/proc/kcore",                                                            |  |  |  |  |  |
|     |                                                                           |  |  |  |  |  |
| 122 | "/proc/keys",                                                             |  |  |  |  |  |
| 123 | "/proc/latency_stats",                                                    |  |  |  |  |  |
| 124 | "/proc/timer_list",                                                       |  |  |  |  |  |
| 125 | "/proc/timer_stats",                                                      |  |  |  |  |  |
| 126 | "/proc/sched_debug",                                                      |  |  |  |  |  |
| 127 | "/proc/scsi",                                                             |  |  |  |  |  |
| 128 | "/sys/firmware"                                                           |  |  |  |  |  |
| 129 | ],                                                                        |  |  |  |  |  |
| 130 | "ReadonlyPaths": [                                                        |  |  |  |  |  |
| 131 | "/proc/bus",                                                              |  |  |  |  |  |
| 132 | "/proc/fs",                                                               |  |  |  |  |  |
| 133 | "/proc/irq",                                                              |  |  |  |  |  |
| 134 | "/proc/sys",                                                              |  |  |  |  |  |
| 135 | "/proc/sysrq-trigger"                                                     |  |  |  |  |  |
| 136 | ]                                                                         |  |  |  |  |  |
| 137 | },                                                                        |  |  |  |  |  |
| 138 | "GraphDriver": {                                                          |  |  |  |  |  |
| 139 | "Data": {                                                                 |  |  |  |  |  |
| 140 | "LowerDir":                                                               |  |  |  |  |  |
|     | "/var/lib/docker/overlay2/0c335307a36317a110766faea36b3c7c868ae5ee9b8c27a |  |  |  |  |  |
|     | 989edacf3b6892829-                                                        |  |  |  |  |  |
|     | init/diff:/var/lib/docker/overlay2/b62e37aaada82eaec082715523ac39af7267a0 |  |  |  |  |  |
|     | 0be9af7f268d0cee3645b702e4/diff",                                         |  |  |  |  |  |
| 141 | "MergedDir":                                                              |  |  |  |  |  |
|     | "/var/lib/docker/overlay2/0c335307a36317a110766faea36b3c7c868ae5ee9b8c27a |  |  |  |  |  |
|     | 989edacf3b6892829/merged",                                                |  |  |  |  |  |
| 142 | "UpperDir":                                                               |  |  |  |  |  |
|     | "/var/lib/docker/overlay2/0c335307a36317a110766faea36b3c7c868ae5ee9b8c27a |  |  |  |  |  |
|     | 989edacf3b6892829/diff",                                                  |  |  |  |  |  |
| 143 | "WorkDir":                                                                |  |  |  |  |  |
|     | "/var/lib/docker/overlay2/0c335307a36317a110766faea36b3c7c868ae5ee9b8c27a |  |  |  |  |  |
|     | 989edacf3b6892829/work"                                                   |  |  |  |  |  |
| 144 | },                                                                        |  |  |  |  |  |
| 145 | "Name": "overlay2"                                                        |  |  |  |  |  |
| 146 | },                                                                        |  |  |  |  |  |
| 147 | 挂载                                                                        |  |  |  |  |  |
| 148 | "Mounts": [],                                                             |  |  |  |  |  |
| 149 | "Config": {                                                               |  |  |  |  |  |

| 150 | "Hostname": "c55c1a083e2e",                                         |
|-----|---------------------------------------------------------------------|
| 151 | "Domainname": "",                                                   |
| 152 | "User": "",                                                         |
| 153 | "AttachStdin": false,                                               |
| 154 | "AttachStdout": false,                                              |
| 155 | "AttachStderr": false,                                              |
| 156 | "Tty": false,                                                       |
| 157 | "OpenStdin": false,                                                 |
| 158 | "StdinOnce": false,                                                 |
| 159 | "Env": [                                                            |
| 160 |                                                                     |
|     | "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" |
| 161 | ],                                                                  |
| 162 | "Cmd": [                                                            |
| 163 | "/bin/sh",                                                          |
| 164 | "-c",                                                               |
| 165 | "while true;do echo 123YX;sleep 1;done"                             |
| 166 | ],                                                                  |
| 167 | "Image": "centos",                                                  |
| 168 | "Volumes": null,                                                    |
| 169 | "WorkingDir": "",                                                   |
| 170 | "Entrypoint": null,                                                 |
| 171 | "OnBuild": null,                                                    |
| 172 | "Labels": {                                                         |
| 173 | "org.label-schema.build-date": "20210915",                          |
| 174 | "org.label-schema.license": "GPLv2",                                |
| 175 | "org.label-schema.name": "CentOS Base Image",                       |
| 176 | "org.label-schema.schema-version": "1.0",                           |
|     |                                                                     |
|     |                                                                     |
| 177 | "org.label-schema.vendor": "CentOS"                                 |
| 178 | }                                                                   |
| 179 | },                                                                  |
| 180 | 网络命令                                                                |
| 181 | "NetworkSettings": {                                                |
| 182 | "Bridge": "",                                                       |
| 183 | "SandboxID":                                                        |
|     | "9aed795b5d2eb0a3d6b31cd48f29acabf338aa036703b40e063df5af1b564490", |
| 184 | "HairpinMode": false,                                               |
| 185 | "LinkLocalIPv6Address": "",                                         |
| 186 | "LinkLocalIPv6PrefixLen": 0,                                        |
| 187 | "Ports": {},                                                        |
| 188 | "SandboxKey": "/var/run/docker/netns/9aed795b5d2e",                 |
| 189 | "SecondaryIPAddresses": null,                                       |
| 190 | "SecondaryIPv6Addresses": null,                                     |
| 191 | "EndpointID":                                                       |
|     | "4e0e7bcc423265a62a278215bf9200d8ed34e68a8a82e95b97390915831c6ba4", |
| 192 | "Gateway": "172.17.0.1",                                            |
| 193 | "GlobalIPv6Address": "",                                            |
| 194 | "GlobalIPv6PrefixLen": 0,                                           |
| 195 | "IPAddress": "172.17.0.3",                                          |
| 196 | "IPPrefixLen": 16,                                                  |
| 197 | "IPv6Gateway": "",                                                  |
| 198 | "MacAddress": "02:42:ac:11:00:03",                                  |
| 199 | "Networks": {                                                       |
| 200 | "bridge": {                                                         |

| 202 | "Links": null,                                                      |
|-----|---------------------------------------------------------------------|
| 203 | "Aliases": null,                                                    |
| 204 | "NetworkID":                                                        |
|     | "8d26d8f19fe79975f51b98bb21730e285b04a26e21cd0b5b4cbc02c01ea370e8", |
| 205 | "EndpointID":                                                       |
|     | "4e0e7bcc423265a62a278215bf9200d8ed34e68a8a82e95b97390915831c6ba4", |
| 206 | "Gateway": "172.17.0.1",                                            |
| 207 | "IPAddress": "172.17.0.3",                                          |
| 208 | "IPPrefixLen": 16,                                                  |
| 209 | "IPv6Gateway": "",                                                  |
| 210 | "GlobalIPv6Address": "",                                            |
| 211 | "GlobalIPv6PrefixLen": 0,                                           |
| 212 | "MacAddress": "02:42:ac:11:00:03",                                  |
| 213 | "DriverOpts": null                                                  |
| 214 | }                                                                   |
| 215 | }                                                                   |
| 216 | }                                                                   |
| 217 | }                                                                   |
| 218 | ]                                                                   |
| 219 |                                                                     |
|     |                                                                     |

### **3.4.5 进入当前正在运行的容器 docker exec -it 容器id bashshell**

```
# 我们通常容器都是在后台运行,需要进入容器,修改一些配置
   # 命令
   • docker exec -it 容器id bashshell
   # 方式一
   • [root@localhost ~]# docker ps
   CONTAINER ID IMAGE COMMAND CREATED STATUS
          PORTS NAMES
   c55c1a083e2e centos "/bin/sh -c 'while t…" 53 minutes ago Up 53
   minutes fervent_beaver
   • [root@localhost ~]# docker exec -it c55c1a083e2e /bin/bash
   [root@c55c1a083e2e /]# ls
   bin dev etc home lib lib64 lost+found media mnt opt proc root
   run sbin srv sys tmp usr var
   ------------------------------------------------------
   # 方式二
   • dcoker attach 容器id
   # 测试
   Docker version 20.10.16, build aa7e414
   [root@localhost ~]# docker attach c55c1a083e2e
   123YX
   123YX
   123YX
   123YX
   123YX
   正在执行当前的代码 .
   ==================================================================
```
![](_page_22_Figure_0.jpeg)

## **3.4.6 docker cp 从容器中拷贝文件到主机**

容器之间是互相隔离状态

| 1  | #命令                                                                               |  |  |  |
|----|-----------------------------------------------------------------------------------|--|--|--|
| 2  | • docker cp 容器ID:容器内路径 目的主机路径                                                     |  |  |  |
| 3  | ----------------------------------------------------------------------            |  |  |  |
| 4  |                                                                                   |  |  |  |
| 5  | • [root@localhost /]# docker run -it centos                                       |  |  |  |
| 6  | WARNING: IPv4 forwarding is disabled. Networking will not work.                   |  |  |  |
| 7  | [root@44e56a21f70f /]# pwd                                                        |  |  |  |
| 8  | /                                                                                 |  |  |  |
| 9  | • [root@44e56a21f70f /]# touch cp.java                                            |  |  |  |
| 10 | • [root@44e56a21f70f /]# exit                                                     |  |  |  |
| 11 | exit                                                                              |  |  |  |
| 12 | • [root@localhost /]# docker ps -a                                                |  |  |  |
| 13 | CONTAINER ID<br>IMAGE<br>COMMAND<br>CREATED<br>STATUS                             |  |  |  |
|    | PORTS<br>NAMES                                                                    |  |  |  |
| 14 | 44e56a21f70f<br>centos<br>"/bin/bash"<br>57 seconds ago<br>Exited (0) 18          |  |  |  |
|    | seconds ago<br>beautiful_beaver                                                   |  |  |  |
| 15 | • [root@localhost /]# docker cp 44e56a21f70f:/cp.java /                           |  |  |  |
| 16 | • [root@localhost /]# ls                                                          |  |  |  |
| 17 | bin<br>cp.java<br>etc<br>lib<br>media<br>opt<br>root<br>sbin<br>sys<br>tmp<br>var |  |  |  |
| 18 | boot<br>dev<br>home<br>lib64<br>mnt<br>proc<br>run<br>srv<br>test.java<br>usr     |  |  |  |
| 19 | #拷贝是一个手动过程,未来我们使用 -v卷的技术,可以实现自动                                                   |  |  |  |

### **3.4.7 小结**

![](_page_23_Figure_0.jpeg)

| 1  | attach                    | Attach local standard input, output, and error streams to a |  |  |
|----|---------------------------|-------------------------------------------------------------|--|--|
|    | running container         |                                                             |  |  |
| 2  |                           | #当前shell下 attach连接指定运行的镜像                                   |  |  |
| 3  | build                     | Build an image from a Dockerfile # 通过Dockerfile定制镜像         |  |  |
| 4  | commit                    | Create a new image from a container's changes #提交当前容器为新     |  |  |
|    | 的镜像                       |                                                             |  |  |
| 5  | cp                        | Copy files/folders between a container and the local        |  |  |
|    | filesystem #拷贝文件          |                                                             |  |  |
| 6  | create                    | Create a new container #创建一个新的容器                            |  |  |
| 7  | diff                      | Inspect changes to files or directories on a container's    |  |  |
|    | filesystem #查看docker容器的变化 |                                                             |  |  |
| 8  | events                    | Get real time events from the server # 从服务获取容器实时时间          |  |  |
| 9  | exec                      | Run a command in a running container # 在运行中的容器上运行命令         |  |  |
| 10 | export                    | Export a container's filesystem as a tar archive #导出容器文件    |  |  |
|    |                           | 系统作为一个tar归档文件[对应import]                                     |  |  |
| 11 | history                   | Show the history of an image # 展示一个镜像形成历史                   |  |  |
| 12 | images                    | List images #列出系统当前的镜像                                      |  |  |
| 13 | import                    | Import the contents from a tarball to create a filesystem   |  |  |
|    |                           | image #从tar包中导入内容创建一个文件系统镜像                                 |  |  |
| 14 | info                      | Display system-wide information # 显示全系统信息                   |  |  |
| 15 | inspect                   | Return low-level information on Docker objects #查看容器详细信     |  |  |
|    | 息                         |                                                             |  |  |
| 16 | kill                      | Kill one or more running containers # kill指定docker容器        |  |  |
| 17 | load                      | Load an image from a tar archive or STDIN #从一个tar包或标准输入     |  |  |
|    | 中加载一个镜像[对应save]           |                                                             |  |  |
| 18 | login                     | Log in to a Docker registry #                               |  |  |
| 19 | logout                    | Log out from a Docker registry                              |  |  |
| 20 | logs                      | Fetch the logs of a container                               |  |  |
| 21 | pause                     | Pause all processes within one or more containers           |  |  |
| 22 | port                      | List port mappings or a specific mapping for the container  |  |  |
| 23 | ps                        | List containers                                             |  |  |
| 24 | pull                      | Pull an image or a repository from a registry               |  |  |
|    |                           |                                                             |  |  |

| 25 | push        | Push an image or a repository to a registry                  |
|----|-------------|--------------------------------------------------------------|
| 26 | rename      | Rename a container                                           |
| 27 | restart     | Restart one or more containers                               |
| 28 | rm          | Remove one or more containers                                |
| 29 | rmi         | Remove one or more images                                    |
| 30 | run         | Run a command in a new container                             |
| 31 | save        | Save one or more images to a tar archive (streamed to STDOUT |
|    | by default) |                                                              |
| 32 | search      | Search the Docker Hub for images                             |
| 33 | start       | Start one or more stopped containers                         |
| 34 | stats       | Display a live stream of container(s) resource usage         |
|    | statistics  |                                                              |
| 35 | stop        | Stop one or more running containers                          |
| 36 | tag         | Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE        |
| 37 | top         | Display the running processes of a container                 |
| 38 | unpause     | Unpause all processes within one or more containers          |
| 39 | update      | Update configuration of one or more containers               |
| 40 | version     | Show the Docker version information                          |
| 41 | wait        | Block until one or more containers stop, then print their    |
|    | exit codes  |                                                              |
|    |             |                                                              |

# **4 Docker部署软件实战**

# **4.1 Docker安装Nginx**

| 1  | # 1. 搜索镜像 search 建议去docker hub搜索,可以看到帮助文档 |        |              |              |        |
|----|-------------------------------------------|--------|--------------|--------------|--------|
| 2  | • docker search nginx                     |        |              |              |        |
| 3  | # 2. 下载镜像 pull                            |        |              |              |        |
| 4  | • docker pull nginx                       |        |              |              |        |
| 5  | # 3. 查看镜像                                 |        |              |              |        |
| 6  | • docker images                           |        |              |              |        |
| 7  | REPOSITORY                                | TAG    | IMAGE ID     | CREATED      | SIZE   |
| 8  | nginx                                     | latest | 605c77e624dd | 4 months ago | 141MB  |
| 9  | mysql                                     | latest | 3218b38490ce | 5 months ago | 516MB  |
| 10 | hello-world                               | latest | feb5d9fea6a5 | 8 months ago | 13.3kB |
| 11 | centos                                    | latest | 5d0da3dc9764 | 8 months ago | 231MB  |
| 12 | # 4. 启动                                   |        |              |              |        |
| 13 | # -d 后台运行                                 |        |              |              |        |
|    |                                           |        |              |              |        |

```
# -name 给容器命名
           # -p 宿主机端口:容器内部端口
   • docker run -d -name nginx01 -p 3344:80 nginx
   496d49e1b1d932865039b5d4436defbe91439a2c8c82ec3f551edb0aa0d5b524
           =外网访问主机3344端口时,可以访问到容器的80端口 =
   # 5. 查看运行状态
   • [root@iZ2zeg4ytp0whqtmxbsqiiZ home]# docker ps
   CONTAINER ID IMAGE COMMAND CREATED STATUS
         PORTS NAMES
   496d49e1b1d9 nginx "/docker-entrypoint.…" 2 minutes ago Up 2
   minutes 0.0.0.0:3344 >80/tcp, :3344 >80/tcp nginx01
   # 6. 本地访问测试
   • [root@localhost /]# curl localhost:3344 # 本地访问测试
   <!DOCTYPE html>
   <html>
       <head>
           <title>Welcome to nginx! /title>
           <style>
              html {
                  color-scheme: light dark;
              }
              body {
                  width: 35em;
                  margin: 0 auto;
                  font-family: Tahoma, Verdana, Arial, sans-serif;
              }
            /style>
        /head>
       <body>
           <h1>Welcome to nginx! /h1>
           <p>If you see this page, the nginx web server is successfully
   installed and
              working. Further configuration is required. /p>
           <p>For online documentation and support please refer to
              <a href="http: /nginx.org/">nginx.org /a>.<br >
              Commercial support is available at
              <a href="http: /nginx.com/">nginx.com /a>. /p>
           <p><em>Thank you for using nginx. /em> /p>
        /body>
    /html>
   # 7、进入容器,修改配置
   • [root@localhost /]# docker ps
   CONTAINER ID IMAGE COMMAND CREATED STATUS
            PORTS NAMES
   496d49e1b1d9 nginx "/docker-entrypoint.…" 55 minutes ago Up 55
   minutes 0.0.0.0:3344 >80/tcp, :3344 >80/tcp nginx01
   • [root@localhost /]# docker exec -it nginx01 /bin/bash
   • root@496d49e1b1d9:/# whereis nginx =# 找nginx =
   nginx: /usr/sbin/nginx /usr/lib/nginx /etc/nginx /usr/share/nginx

```
![](_page_26_Picture_0.jpeg)

思考问题:我们每次都需要改动nginx配置,都需要进入容器内部?十分的麻烦,我们要是可以在容器外部提供 一个映射路径,达到可以在容器外部修改文件名,容器内部就可以进行自动修改?**-数据卷**

### **端口暴露概念**

![](_page_26_Figure_3.jpeg)

# **4.2 Docker安装Tomcat**

```
# 官网下载 tomcat9.0
   • docker run -it -rm tomcat:9.0
   # 之前的启动都是后台,停止了容器,容器还是可以查到, docker run -it -rm 镜像名 一般
   是用来测试,用完就删除
   • [root@iz2zeak7sgj6i7hrb2g862z ~]# docker run -it -rm tomcat:9.0
    -rm Automatically remove the container when it exits 用完即删
   #下载 最新版
   • [root@abc ~]# docker pull tomcat:9.0
   9.0: Pulling from library/tomcat
   Digest:
   sha256:cd96d4f7d3f5fc4d3bc1622ec678207087b8215d55021a607ecaefba80b403ea
   Status: Image is up to date for tomcat:9.0
   docker.io/library/tomcat:9.0
#查看下载的镜像
   • [root@abc ~]# docker images
   REPOSITORY TAG IMAGE ID CREATED SIZE
   nginx latest 605c77e624dd 4 months ago 141MB
   tomcat 9.0 b8e65a4d736d 5 months ago 680MB
   mysql 5.7 c20987f18b13 5 months ago 448MB
   hello-world latest feb5d9fea6a5 8 months ago 13.3kB
   centos latest 5d0da3dc9764 8 months ago 231MB
   #以后台方式,暴露端口方式,启动运行
   • # docker run -d -p 3355:8080 -name tomcat02 tomcat
   #测试访问有没有问题
   curl localhost:3355
   报出404错误,说明可以访问,但是tomcat有问题,不完整
   #根据容器id进入tomcat容器
   • [root@iz2zeak7sgj6i7hrb2g862z ~]# docker exec -it 645596565d3f /bin/bash
   root@645596565d3f:/usr/local/tomcat#
   #查看tomcat容器内部内容:
   • root@645596565d3f:/usr/local/tomcat# ls -l
   total 152
   -rw-r -r - 1 root root 18982 May 5 20:40 BUILDING.txt
   -rw-r -r - 1 root root 5409 May 5 20:40 CONTRIBUTING.md
   -rw-r -r - 1 root root 57092 May 5 20:40 LICENSE
   -rw-r -r - 1 root root 2333 May 5 20:40 NOTICE
   -rw-r -r - 1 root root 3255 May 5 20:40 README.md
   -rw-r -r - 1 root root 6898 May 5 20:40 RELEASE-NOTES
   -rw-r -r - 1 root root 16262 May 5 20:40 RUNNING.txt
   drwxr-xr-x 2 root root 4096 May 16 12:05 bin
   drwxr-xr-x 1 root root 4096 May 21 11:04 conf
   drwxr-xr-x 2 root root 4096 May 16 12:05 lib
   drwxrwxrwx 1 root root 4096 May 21 11:04 logs
   drwxr-xr-x 2 root root 4096 May 16 12:05 native-jni-lib
   drwxrwxrwx 2 root root 4096 May 16 12:05 temp
   drwxr-xr-x 2 root root 4096 May 16 12:05 webapps
   drwxr-xr-x 7 root root 4096 May 5 20:37 webapps.dist
   drwxrwxrwx 2 root root 4096 May 5 20:36 work
   root@645596565d3f:/usr/local/tomcat#
   -------------------------------------------
   #进入webapps目录
   • root@645596565d3f:/usr/local/tomcat# cd webapps
   • root@645596565d3f:/usr/local/tomcat/webapps# ls
   • root@645596565d3f:/usr/local/tomcat/webapps#
   # 发现问题:1、linux命令少了。 2.webapps目录为空
   # 原因:阿里云镜像的原因,阿里云默认是最小的镜像,所以不必要的都剔除掉
   # 保证最小可运行的环境!
   # 解决方案:
   # 将webapps.dist下的文件都拷贝到webapps下即可
   • root@645596565d3f:/usr/local/tomcat# ls 找到webapps.dist
   BUILDING.txt LICENSE README.md RUNNING.txt conf logs temp
   webapps.dist

```
![](_page_28_Picture_0.jpeg)

这样tomcat就没问题了,外网访问时候直接 主机地址:3355 即可

![](_page_28_Picture_2.jpeg)

# **4.3 Docker部署es + kibana**

![](_page_28_Figure_4.jpeg)

```
"cluster_name" : "docker-cluster",
      "cluster_uuid" : "atFKgANxS8CzgIyCB8PGxA",
      "version" : {
       "number" : "7.6.2",
       "build_flavor" : "default",
       "build_type" : "docker",
       "build_hash" : "ef48eb35cf30adf4db14086e8aabd07ef6fb113f",
       "build_date" : "2020-03-26T06:34:37.794943Z",
       "build_snapshot" : false,
       "lucene_version" : "8.4.0",
       "minimum_wire_compatibility_version" : "6.8.0",
       "minimum_index_compatibility_version" : "6.0.0-beta1"
      },
      "tagline" : "You Know, for Search"
    }
    • #测试成功就关掉elasticSearch,防止耗内存
    • [root@iz2zeak7sgj6i7hrb2g862z ~]# docker stats # 查看docker容器使用内存情况
    ---------------------------------------------------------------------------
    ----------------------------
    • #测试成功就关掉elasticSearch,可以添加内存的限制,修改配置文件 -e 环境配置修改(看自
    己的容器号,这个可能也是copy别人的,所以号不一样)
    ➜ ~ docker rm -f d73ad2f22dd3 # stop命令也行
    • ➜ ~ docker run -d -name elasticsearch01 -p 9200:9200 -p 9300:9300 -e
    "discovery.type=single-node" -e ES_JAVA_OPTS="-Xms64m -Xmx512m"
    elasticsearch:7.6.2
    • docker stats
    CONTAINER ID NAME CPU % MEM USAGE / LIMIT MEM %
    NET I/O BLOCK I/O PIDS
    56d4fde935d2 elasticsearch01 0.52% 395.9MiB / 1.795GiB 21.54%
    656B / 0B 106MB / 729kB 43
    ------------------------------------------------------------
    • [root@abc ~]# curl localhost:9200
    {
      "name" : "56d4fde935d2",
      "cluster_name" : "docker-cluster",
      "cluster_uuid" : "VCzCca-fRmCpeINIBPUoTQ",
      "version" : {
       "number" : "7.6.2",
       "build_flavor" : "default",
       "build_type" : "docker",
       "build_hash" : "ef48eb35cf30adf4db14086e8aabd07ef6fb113f",
       "build_date" : "2020-03-26T06:34:37.794943Z",
       "build_snapshot" : false,
       "lucene_version" : "8.4.0",
       "minimum_wire_compatibility_version" : "6.8.0",
       "minimum_index_compatibility_version" : "6.0.0-beta1"
      },
      "tagline" : "You Know, for Search"
    }

```
![](_page_30_Figure_0.jpeg)

### **4.3.1 可视化**

- portainer(先用这个,这个不是最佳选择)
- 一个docker图形化管理工具
- # 下载,安装,测试 1
- docker run -d -p 8088:9000 \ 2
- -restart=always -v /var/run/docker.sock:/var/run/docker.sock privileged=true portainer/portainer 3
- # 这时候就可以打开外网地址访问8088接口了 4

|                                                   | portainer.io |   |
|---------------------------------------------------|--------------|---|
| Please create the initial administrator user.     |              |   |
| Username                                          | admin        |   |
| Password                                          |              |   |
| Confirm password                                  |              | × |
| X The password must be at least 8 characters long |              |   |
| & Create user                                     |              |   |

#### • curl localhost:8088 2

### 进入之后的面板

| Connect Portainer to the Docker environment you want to manage.                                                                                                                                                             |                                                   |                                                   |                                         |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------|---------------------------------------------------|-----------------------------------------|
| Local<br>Manage the local Docker<br>environment                                                                                                                                                                             | & Remote<br>Manage a remote Docker<br>environment | 4 Agent<br>Connect to a Portainer agent           | Azure<br>Connect to Microsoft Azure ACI |
| Information<br>Connect Portainer to a remote Docker environment using the Docker API over TCP.<br>· The Docker API must be exposed over TCP. You can find more information about how to expose the Docker<br>documentation. |                                                   |                                                   |                                         |
| Environment                                                                                                                                                                                                                 |                                                   |                                                   |                                         |
|                                                                                                                                                                                                                             | e.g. docker-prod01                                |                                                   |                                         |
| Name                                                                                                                                                                                                                        |                                                   |                                                   |                                         |
| Endpoint URL 0                                                                                                                                                                                                              |                                                   | e.g. 10.0.0.10.2375 or mydocker.mydomain.com:2375 |                                         |
| TLS @                                                                                                                                                                                                                       |                                                   |                                                   |                                         |

![](_page_32_Picture_0.jpeg)

- 平时不会用,自己看看就可以
# **5 Docker镜像xz**

# **5.1 镜像是什么**

镜像是一种轻量级、可执行的独立软件包,用来打包软件运行环境和基于运行环境开发的软件,它 包含运行某 个软件所需的所有内容,包括代码、运行时、库、环境变量和配置文件 。

所有的应用,直接打包docker镜像,就可以直接跑起来,不需要运维部署环境了

如何得到镜像:

- 从远处仓库下载
- 朋友拷贝给你

自己制作一个镜像DockerFile

# **5.2 Docker镜像加载原理**

### **5.2.1 UnionFS(联合文件系统)**

UnionFS(联合文件系统):Union文件系统(UnionFS)是一种分层、轻量级并且高性能的文件系统,它 支 持对文件系统的修改作为一次提交来一层层的叠加 ,同时可以将不同目录挂载到同一个虚拟文件系统下(unite several directories into a single virtual filesystem)。**Union 文件系统是 Docker 镜像的 基础**。镜像可以通过分层来进行继承,基于基础镜像(没有父镜像),可以制作各种具体的应用镜像。

**特性**:一次同时加载多个文件系统,但从外面看起来,只能看到一个文件系统,联合加载会把各层文件系统叠加 起来,这样最终的文件系统会包含所有底层的文件和目录。

git每次操作都有记录,docker pull 下载时候看到一层一层的就是这个 A软件有的部分,B软件需要的话就不用重新下载了

### **5.2.2 镜像加载原理**

**bootfs(boot file system)**主要包含bootloader和kernel, bootloader主要是引导加载kernel , Linux刚启动时会加载bootfs文件系统,在Docker镜像的最底层是bootfs。这一层与我们典型的 Linux/Unix系统是一样的,包含boot加载器和内核。当boot加载完成之后整个内核就都在内存中了,此时内 存的使用权已由bootfs转交给内核,此时系统也会卸载bootfs。

**rootfs (root file system)**,在bootfs之上。包含的就是典型 Linux 系统中的 /dev,/proc,/bin,/etc 等标准目录和文件。 rootfs就是各种不同的操作系统发行版 ,比如Ubuntu, Centos等等。

平时我们安装虚拟机的centos都是好几个G,为什么Docker这里才200M?因为是精简过的,引导没了,只有文 件,效率最大化。

| [root@localhost ~]# docker images centos |        |          |                                     |      |
|------------------------------------------|--------|----------|-------------------------------------|------|
| REPOSITORY TAG                           |        | IMAGE ID | CREATED                             | SIZE |
| centos                                   | latest |          | 300e315adb2f   4 months ago   209MB |      |

对于一个精简的OS,rootfs 可以很小,只需要包含最基本的命令,工具和程序库就可以了,因为底层直接用 Host的kernel,自己只需要提供rootfs就可以了。由此可见对于不同的linux发行版, **bootfs基本是一致 的,rootfs会有差别,因此 不同的发行版可以公用bootfs。**

虚拟机是分钟级别的,容器是秒级别的。

任何系统安装需要引导加载,所以Bootfs

黑屏-开机-系统 这过程就是种加载

容器就是小的虚拟机环境

底层的内核是不变的

# **5.3分层理解**

我们去下载一个镜像,注意观察下载的日志输出,可以看到是一层一层的在下载!

| [root@localhost ~]# docker pull redis                                           |  |  |  |  |
|---------------------------------------------------------------------------------|--|--|--|--|
| Using default tag: latest                                                       |  |  |  |  |
| latest: Pulling from library/redis                                              |  |  |  |  |
| f7ec5a41d630: Already exists                                                    |  |  |  |  |
| a36224ca8bbd: Pull complete                                                     |  |  |  |  |
| 7630ad34dcb2: Pull complete                                                     |  |  |  |  |
| e74b2f747260: Pull complete                                                     |  |  |  |  |
| ebc61c7bf222: Pull complete                                                     |  |  |  |  |
| laafd9c07208: Pull complete                                                     |  |  |  |  |
| Digest: sha256:eff56acc5fc7b909183da93236ba09d3b8cb7d6db31d5b25e9a46dac9b5e699b |  |  |  |  |
| Status: Downloaded newer image for redis:latest                                 |  |  |  |  |
| docker.io/library/redis:latest                                                  |  |  |  |  |
|                                                                                 |  |  |  |  |

思考:为什么要采用这种分层的结构呢?

最大的好处,我觉得莫过于是**资源共享**了,比如有多个镜像都从相同的Base镜像构建而来,那么宿主机只需要在 磁盘上保留一份base镜像,同时内存中只需要加载一份base镜像,这样就可以为多有的容器服务了,而且每一 层都可以被共享

查看镜像分层的方式可以通过**docker image inspect** 命令

| 1  |                                                                           |        |              |               |        |  |
|----|---------------------------------------------------------------------------|--------|--------------|---------------|--------|--|
| 2  | [root@abc ~]# clear                                                       |        |              |               |        |  |
| 3  | • [root@abc ~]# docker pull redis                                         |        |              |               |        |  |
| 4  | Using default tag: latest                                                 |        |              |               |        |  |
| 5  | latest: Pulling from library/redis                                        |        |              |               |        |  |
| 6  | a2abf6c4d29d: Already exists                                              |        |              |               |        |  |
| 7  | c7a4e4382001: Pull complete                                               |        |              |               |        |  |
| 8  | 4044b9ba67c9: Pull complete                                               |        |              |               |        |  |
| 9  | c8388a79482f: Pull complete                                               |        |              |               |        |  |
| 10 | 413c8bb60be2: Pull complete                                               |        |              |               |        |  |
| 11 | 1abfd3011519: Pull complete                                               |        |              |               |        |  |
| 12 | Digest:                                                                   |        |              |               |        |  |
|    | sha256:db485f2e245b5b3329fdc7eff4eb00f913e09d8feb9ca720788059fdc2ed8339   |        |              |               |        |  |
| 13 | Status: Downloaded newer image for redis:latest                           |        |              |               |        |  |
| 14 | docker.io/library/redis:latest                                            |        |              |               |        |  |
| 15 | • [root@abc ~]# docker images                                             |        |              |               |        |  |
| 16 | REPOSITORY                                                                | TAG    | IMAGE ID     | CREATED       | SIZE   |  |
| 17 | nginx                                                                     | latest | 605c77e624dd | 4 months ago  | 141MB  |  |
| 18 | tomcat                                                                    | 9.0    | b8e65a4d736d | 5 months ago  | 680MB  |  |
| 19 | tomcat                                                                    | latest | fb5657adc892 | 5 months ago  | 680MB  |  |
| 20 | redis                                                                     | latest | 7614ae9453d1 | 5 months ago  | 113MB  |  |
| 21 | mysql                                                                     | 5.7    | c20987f18b13 | 5 months ago  | 448MB  |  |
| 22 | hello-world                                                               | latest | feb5d9fea6a5 | 8 months ago  | 13.3kB |  |
| 23 | centos                                                                    | latest | 5d0da3dc9764 | 8 months ago  | 231MB  |  |
| 24 | portainer/portainer                                                       | latest | 580c0e4e98b0 | 14 months ago | 79.1MB |  |
| 25 | elasticsearch                                                             | 7.6.2  | f29a1ee41030 | 2 years ago   | 791MB  |  |
| 26 | • [root@abc ~]# docker image inspect redis:latest                         |        |              |               |        |  |
| 27 | [                                                                         |        |              |               |        |  |
| 28 | {                                                                         |        |              |               |        |  |
| 29 | "Id":                                                                     |        |              |               |        |  |
|    | "sha256:7614ae9453d1d87e740a2056257a6de7135c84037c367e1fffa92ae922784631" |        |              |               |        |  |
|    | ,                                                                         |        |              |               |        |  |
| 30 | "RepoTags": [                                                             |        |              |               |        |  |
|    |                                                                           |        |              |               |        |  |

```
"redis:latest"
            ],
            "RepoDigests": [
     "redis@sha256:db485f2e245b5b3329fdc7eff4eb00f913e09d8feb9ca720788059fdc2
    ed8339"
            ],
            "Parent": "",
            "Comment": "",
            "Created": "2021-12-21T12:42:49.755107412Z",
            "Container":
    "13d25f53410417c5220c8dfe8bd49f06abdbcd69faa62a9b877de02464bb04a3",
            "ContainerConfig": {
                 "Hostname": "13d25f534104",
                 "Domainname": "",
                 "User": "",
                 "AttachStdin": false,
                 "AttachStdout": false,
                 "AttachStderr": false,
                 "ExposedPorts": {
                     "6379/tcp": {}
                 },
                 "Tty": false,
                 "OpenStdin": false,
                 "StdinOnce": false,
                 "Env": [
     "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                     "GOSU_VERSION=1.12",
                     "REDIS_VERSION=6.2.6",
     "REDIS_DOWNLOAD_URL=http: /download.redis.io/releases/redis-
    6.2.6.tar.gz",
     "REDIS_DOWNLOAD_SHA=5b2b8b7a50111ef395bf1c1d5be11e6e167ac018125055daa8b5
    c2317ae131ab"
                 ],
                 "Cmd": [
                     "/bin/sh",
                     "-c",
                     " (nop) ",
                     "CMD [\"redis-server\"]"
                 ],
                 "Image":
    "sha256:e093f59d716c95cfce82c676f099b960cc700432ab531388fcedf79932fc81ec"
    ,
                 "Volumes": {
                     "/data": {}
                 },
                 "WorkingDir": "/data",
                 "Entrypoint": [
                     "docker-entrypoint.sh"
                 ],
                 "OnBuild": null,
                 "Labels": {}
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
```

```
},
              "DockerVersion": "20.10.7",
              "Author": "",
              "Config": {
                  "Hostname": "",
                  "Domainname": "",
                  "User": "",
                  "AttachStdin": false,
                  "AttachStdout": false,
                  "AttachStderr": false,
                  "ExposedPorts": {
                      "6379/tcp": {}
                  },
                  "Tty": false,
                  "OpenStdin": false,
                  "StdinOnce": false,
                  "Env": [
      "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
                      "GOSU_VERSION=1.12",
                      "REDIS_VERSION=6.2.6",
      "REDIS_DOWNLOAD_URL=http: /download.redis.io/releases/redis-
     6.2.6.tar.gz",
      "REDIS_DOWNLOAD_SHA=5b2b8b7a50111ef395bf1c1d5be11e6e167ac018125055daa8b5
     c2317ae131ab"
                  ],
                  "Cmd": [
                      "redis-server"
                  ],
                  "Image":
     "sha256:e093f59d716c95cfce82c676f099b960cc700432ab531388fcedf79932fc81ec"
     ,
                  "Volumes": {
                      "/data": {}
                  },
                  "WorkingDir": "/data",
                  "Entrypoint": [
                      "docker-entrypoint.sh"
                  ],
                  "OnBuild": null,
                  "Labels": null
              },
              "Architecture": "amd64",
              "Os": "linux",
              "Size": 112691373,
              "VirtualSize": 112691373,
              "GraphDriver": {
                  "Data": {
 76
 77
 78
 79
 80
 81
 82
 83
 84
 85
 86
 87
 88
 89
 90
 91
 92
 93
 94
 95
 96
 97
 98
 99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
```

| 119 | "LowerDir":                                                                                          |
|-----|------------------------------------------------------------------------------------------------------|
|     | "/var/lib/docker/overlay2/814f9dba4508a65e32865be3b4c39a6b12e613c3bd0e51f                            |
|     | b7df567751a56451e/diff:/var/lib/docker/overlay2/0c50d6f9f9c40df1432392427                            |
|     | 4be9f9454cee6887bc010be48aa335bfa4401dc/diff:/var/lib/docker/overlay2/e14                            |
|     | 651278e9e761c7a453b05f9a710f82297609d3cee6648e5eb162a05672255/diff:/var/l                            |
|     | ib/docker/overlay2/0ff367cff8b761e37cc58b1e730e22a07b30a41d02b9c6cdc6c595                            |
|     | 7d3120590f/diff:/var/lib/docker/overlay2/a7649e0248b14af93e37d6a86a45cdab                            |
|     |                                                                                                      |
|     | f34ee586ad27f33615784d61978ec2d0/diff",                                                              |
| 120 | "MergedDir":                                                                                         |
|     | "/var/lib/docker/overlay2/dd53d8aa6067c0ccf4f7d7695b7a66faf778db164fe126e                            |
|     | 9ccf7350ef97c4435/merged",                                                                           |
| 121 | "UpperDir":                                                                                          |
|     | "/var/lib/docker/overlay2/dd53d8aa6067c0ccf4f7d7695b7a66faf778db164fe126e                            |
|     | 9ccf7350ef97c4435/diff",                                                                             |
| 122 | "WorkDir":                                                                                           |
|     | "/var/lib/docker/overlay2/dd53d8aa6067c0ccf4f7d7695b7a66faf778db164fe126e<br>9ccf7350ef97c4435/work" |
| 123 | },                                                                                                   |
| 124 | "Name": "overlay2"                                                                                   |
| 125 | },                                                                                                   |
| 126 | "RootFS": {                                                                                          |
| 127 | "Type": "layers",                                                                                    |
| 128 | "Layers": [                                                                                          |
| 129 |                                                                                                      |
|     | "sha256:2edcec3590a4ec7f40cf0743c15d78fb39d8326bc029073b41ef9727da6c851f                             |
|     | ",                                                                                                   |
| 130 |                                                                                                      |
|     | "sha256:9b24afeb7c2f21e50a686ead025823cd2c6e9730c013ca77ad5f115c079b57cb                             |
|     | ",                                                                                                   |
| 131 |                                                                                                      |
|     | "sha256:4b8e2801e0f956a4220c32e2c8b0a590e6f9bd2420ec65453685246b82766ea1                             |
|     | ",                                                                                                   |
| 132 |                                                                                                      |
|     | "sha256:529cdb636f61e95ab91a62a51526a84fd7314d6aab0d414040796150b4522372                             |
|     | ",                                                                                                   |
| 133 |                                                                                                      |
|     | "sha256:9975392591f2777d6bf4d9919ad1b2c9afa12f9a9b4d260f45025ec3cc9b18ed                             |
|     | ",                                                                                                   |
| 134 |                                                                                                      |
|     | "sha256:8e5669d8329116b8444b9bbb1663dda568ede12d3dbcce950199b582f6e94952                             |
|     | "                                                                                                    |
| 135 | ]                                                                                                    |
| 136 | },                                                                                                   |
| 137 | "Metadata": {                                                                                        |
| 138 | "LastTagTime": "0001-01-01T00:00:00Z"                                                                |
| 139 | }                                                                                                    |
| 140 | }                                                                                                    |
| 141 | ]                                                                                                    |
|     |                                                                                                      |

![](_page_38_Figure_0.jpeg)

**理解 :**

- 所有的 Docker|镜像都起始于一个基础镜像层,当进行修改或增加新的内容时,就会在当前镜像层之上, 创建新的镜像层。
- 举一个简单的例子,假如基于 Ubuntu Linux 16.04 创建一个新的镜像,这就是新镜像的第一层;如果 在该镜像中添加 Python包,就会在基础镜像层之上创建第二个镜像层;如果继续添加一个安全补丁,就会 创建第三个镜像层。

在添加额外的镜像层的同时,镜像始终是保持当前所有镜像的组合,理解这一点是非常重要的。下图距举了一个 简单的例子,每个镜像包含三个文件,而镜像包含了来自两个镜像层的6个文件。

![](_page_38_Figure_5.jpeg)

上图中的镜像层和之前的图中略有区别,主要目的是便于展示文件

下图中展示了一个稍微复杂的三层镜像,在外部看来整个镜像只有6个文件,这是因为最上层的文件7是文件5的 一个更新版

![](_page_39_Figure_0.jpeg)

这种情况下,上层镜像层中的文件覆盖了底层镜像层中的文件。这样就使得文件的更新版本作为一个新镜像层添 加到镜像当中。 **Docker 通过存储引擎(新版本采用快照机制)的方式来实现镜像层堆栈**,并保证多镜像层对 外展示为统一的文件系統。 Linux 上可用的存储引擎有 AUFS、Overlay2、Device Mapper、Btrfs 以及 ZFS。顾名思义,每种存储引擎都基于 Linux 中对应的文件系统或者块设备技术,并且每种存储引擎都有其独 有的性能特点。

- Docker 在 Windows 上仅支持 windowsfiter一种存储引擎,该引擎基于 NTFS 文件系统之上实现了 分层和 CoW[1]。
下图展示了与系统显示相同的三层镜像。所有镜像层堆叠并合井,对外提供统一的视图。

![](_page_39_Figure_4.jpeg)

### **特点**

Docker镜像都是只读的,当容器启动时,一个新的可写层被加载到镜像顶部!

**这一层就是我们通常说的容器层,容器之下的都叫镜像层**

![](_page_40_Figure_0.jpeg)

# **5.4 提交镜像 commit**

如果你想要保存当前的状态,就通过commit提交,获得一个镜像,就好比我们以前学习VM时候,快照

| 1  | # docker commit 提交容器成为一个新的副本<br># 命令和git原理类似                              |
|----|---------------------------------------------------------------------------|
| 2  | • docker commit                                                           |
| 3  | -m="提交的描述信息"                                                              |
| 4  | -a="作者"                                                                   |
| 5  | 容器id 目标镜像名:[tag]                                                          |
| 6  | ------------------------------------------------------------              |
| 7  | # 启动一个默认的tomcat                                                           |
| 8  | # 发现这个默认的tomcat是没有webapps应用的,                                             |
| 9  | # 镜像的原因:官方镜像默认webapps下面没有文件的!# 我自己拷贝进去了基本的文件                              |
| 10 | # 将我们自己操作过后的容器通过commit提交为一个镜像,我们以后就可以使用自己修改过的镜像,                          |
| 11 | # 这就是我们自己的一个修改过的镜像[root@localhost ~]                                      |
| 12 | ------------------------------------------------------------              |
| 13 | # 实战测试                                                                    |
| 14 | • [root@abc ~]# docker ps                                                 |
| 15 | CONTAINER ID<br>IMAGE<br>COMMAND<br>CREATED<br>STATUS<br>PORTS<br>NAMES   |
| 16 | • [root@abc ~]# docker run -it -p 8080:8080<br>tomcat                     |
| 17 | Using CATALINA_BASE:<br>/usr/local/tomcat                                 |
| 18 | Using CATALINA_HOME:<br>/usr/local/tomcat                                 |
| 19 | Using CATALINA_TMPDIR: /usr/local/tomcat/temp                             |
| 20 | Using JRE_HOME:<br>/usr/local/openjdk-11                                  |
| 21 | Using CLASSPATH:                                                          |
|    | /usr/local/tomcat/bin/bootstrap.jar:/usr/local/tomcat/bin/tomcat-juli.jar |
| 22 | …………省略tomcat日志                                                            |
| 23 | ••••••••••••••••=同时新建另一个访问窗口=••••••••••••••••••••                         |
| 24 | • [root@abc ~]# docker ps                                                 |
| 25 | CONTAINER ID<br>IMAGE<br>COMMAND<br>CREATED<br>STATUS<br>PORTS<br>NAMES   |
| 26 | 33b2b22d068c<br>tomcat<br>"catalina.sh run"<br>37 seconds ago<br>Up 36    |
|    | seconds<br>0.0.0.0:8080 >8080/tcp,<br>:8080 >8080/tcp<br>awesome_lamarr   |
| 27 | • [root@abc ~]# docker exec -it 33b2b22d068c /bin/bash                    |
| 28 | • root@33b2b22d068c:/usr/local/tomcat# cp -r<br>webapps.dist * webapps    |
| 29 | • root@33b2b22d068c:/usr/local/tomcat# cd webapps                         |
| 30 | • root@33b2b22d068c:/usr/local/tomcat/webapps# ls                         |
|    |                                                                           |

ROOT docs examples host-manager manager • root@33b2b22d068c:/usr/local/tomcat# exit exit • [root@abc ~]# docker ps CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES 33b2b22d068c tomcat "catalina.sh run" 8 minutes ago Up 8 minutes 0.0.0.0:8080 >8080/tcp, :8080 >8080/tcp awesome_lamarr 同时外网测试,可用,可以访问 • • • • # 开始提交镜像• • • • • • docker commit -a="yi_xia" -m="miao_shu" 33b2b22d068c tomcat02 • [root@abc ~]# docker images REPOSITORY TAG IMAGE ID CREATED SIZE tomcat02 latest a2f142e3d016 18 seconds ago 684MB nginx latest 605c77e624dd 4 months ago 141MB tomcat 9.0 b8e65a4d736d 5 months ago 680MB tomcat latest fb5657adc892 5 months ago 680MB redis latest 7614ae9453d1 5 months ago 113MB mysql 5.7 c20987f18b13 5 months ago 448MB hello-world latest feb5d9fea6a5 8 months ago 13.3kB centos latest 5d0da3dc9764 8 months ago 231MB portainer/portainer latest 580c0e4e98b0 14 months ago 79.1MB elasticsearch 7.6.2 f29a1ee41030 2 years ago 791MB --------------------------------------------------------------------------- -# 例子2: [root@abc ~]# docker commit -a="yi_xia" -m="miao_shu" 33b2b22d068c my_tomcat_1.0 sha256:5bc7ddad0d13316199754a1ccaf59f395996a19424bd7a3361c487c08d12d89c [root@abc ~]# docker images REPOSITORY TAG IMAGE ID CREATED SIZE my_tomcat_1.0 latest 5bc7ddad0d13 16 seconds ago 684MB # 我 的自定义tomcat镜像 tomcat02 latest a2f142e3d016 2 minutes ago 684MB nginx latest 605c77e624dd 4 months ago 141MB tomcat 9.0 b8e65a4d736d 5 months ago 680MB tomcat latest fb5657adc892 5 months ago 680MB redis latest 7614ae9453d1 5 months ago 113MB mysql 5.7 c20987f18b13 5 months ago 448MB hello-world latest feb5d9fea6a5 8 months ago 13.3kB centos latest 5d0da3dc9764 8 months ago 231MB portainer/portainer latest 580c0e4e98b0 14 months ago 79.1MB elasticsearch 7.6.2 f29a1ee41030 2 years ago 791MB 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71

# **6 容器数据卷**

# **6.1 什么是容器数据卷**

将应用环境打包成一个镜像!

数据?如果数据都在容器中,那么我们容器删除,数据就会丢失! 需求:数据可以持久化

MySQL,容器删除了,删库跑路!需求:MySQL的数据可以存储在本地

容器之间可以有一个数据共享的技术 ! docker容器中产生的数据,同步到本地

**这就是卷技术,目录的挂载,将容器内的目录挂载在Linux上面**

总结一句话:容器的持久化和同步操作,容器间也是可以数据共享的

![](_page_42_Figure_8.jpeg)

# **6.2 使用数据卷**

### **6.2.1 直接使用命令挂载 -v**

![](_page_42_Picture_11.jpeg)

![](_page_43_Picture_0.jpeg)

| 1 | # 第二个测试    |  |
|---|------------|--|
| 2 |            |  |
|   |            |  |
| 3 | 1.停止容器     |  |
| 4 | 2、宿主机上修改文件 |  |

- 、启动容器
- 、容器内的数据依旧是同步的

| ● 1阿里云服务器<br>× +                                                                                                                                                                                                      | く♪ ▼ ● ● 1 阿里云服务器<br>× +                                                                                                                                                                                                                                                                                                                                    |                                                         |             |                                             | < > > |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------|-------------|---------------------------------------------|-------|
| [root@abc ceshi]# docker ps<br>CONTAINER ID IMAGE<br>COMMAND<br>CREATED<br>STATUS<br>PORTS<br>NAMES<br>a0c66f548d9f centos<br>ago   Up 14 minutes<br>charming zhukovsky<br>[root@abc ceshi]# decker stop a0c66f548d9f | [root@abc ~]# docker ps<br>CONTAINER ID IMAGE<br>[root@abc ~]# docke ps =- a<br>-bash: docke: command not found<br>[root@abc ~]# docke ps -a<br>-bash: docke: command not found                                                                                                                                                                             | COMMAND CREATED STATUS PORTS                            | NAMES       |                                             |       |
| -bash: decker: command not found<br>[root@abc ceshi]# docker ps                                                                                                                                                       | [root@abc ~]# docker ps -a<br>CONTAINER ID IMAGE                                                                                                                                                                                                                                                                                                            | COMMAND                                                 | CREATED     | STATUS                                      | PORTS |
| CONTAINER ID IMAGE<br>COMMAND<br>CREATED<br>STATUS<br>PORTS<br>NAMES<br>a0c66f548d9f centos<br>"/bin/bash"   14 minutes ago   Up 14 minutes<br>charming zhukovsky<br>[root@abc ceshi]# docker stop a0c66f548d9f       | NAMES<br>a0c66f548d9f centos<br>charming zhukovsky                                                                                                                                                                                                                                                                                                          | "/bin/bash"                                             |             | 20 minutes ago   Exited (127) 5 minutes ago |       |
| a0c66f548d9f<br>[root@abc ceshi]# clear                                                                                                                                                                               | 33b2b22d068c tomcat<br>awesome lamarr                                                                                                                                                                                                                                                                                                                       | "catalina.sh run"                                       | 2 hours ago | Exited (129) 27 minutes ago                 |       |
| [root@abc ceshi]# docker ps<br>CONTAINER ID IMAGE<br>COMMAND CREATED STATUS<br>PORTS<br>NAMES                                                                                                                         | 23626a17e948 tomcat<br>ecstatic_shamir                                                                                                                                                                                                                                                                                                                      | "catalina.sh run"                                       | 2 hours ago | Created                                     |       |
| [root@abc ceshi]# cls                                                                                                                                                                                                 | f7fe19ee78e5 tomcat                                                                                                                                                                                                                                                                                                                                         | "catalina.sh run"                                       | 2 hours ago | Exited (129) 2 hours ago                    |       |
| - bash: cls: command not found<br>[root@abc ceshi]# ls<br>test. 1ava                                                                                                                                                  | brave shirley<br>a7cd9e8790fa portainer/portainer<br>optimistic meclintock                                                                                                                                                                                                                                                                                  | "/portainer"                                            | S hours ago | Exited (2) 2 hours ago                      |       |
| [root@abc ceshi]# cat test. java<br>[root@abc ceshi]# clear                                                                                                                                                           | 56d4fde935d2<br>elasticsearch01                                                                                                                                                                                                                                                                                                                             | elasticsearch: 7.6.2 "/usr/local/bin/dock " 5 hours ago |             | Exited (143) 2 hours ago                    |       |
| [root@abc ceshi]# ls<br>test. java                                                                                                                                                                                    | 544947b59c86 elasticsearch: 7.6.2 "/usr/local/bin/dock  " 6 hours ago<br>elasticsearch                                                                                                                                                                                                                                                                      |                                                         |             | Exited (143) 5 hours ago                    |       |
| [root@abc ceshil# vim test. java                                                                                                                                                                                      | 4889e06078b4 tomcat<br>tomcat02                                                                                                                                                                                                                                                                                                                             | "catalina.sh run"                                       | 6 hours ago | Exited (137) 5 hours ago                    |       |
| [root@abc ceshi]#   <br>左面是主机,右面是主载的容器<br>日元exit 容品                                                                                                                                                                   | e1808bae7301 tomcat<br>tomcat01                                                                                                                                                                                                                                                                                                                             | "catalina.sh run"                                       | 6 hours ago | Exited (137) 6 hours ago                    |       |
| 切换主机:在test.java里添加了这一<br>切换容器界面,start容器,童看同步的test.java里的文字也同步了                                                                                                                                                        | [root@abc ~]# docke start a0c66f548d9f<br>-bash: docke: command not found<br>[root@abc ~]# docker start a0c66f548d9f<br>a0c66f548d9f<br>[root@abc ~]# docker attach a8c66f548d9f<br>[root@a0c66f548d9f /]# cd /home<br>[root@a0c66f548d9f home]# ls<br>test. Java<br>[root@a0c66f548d9f home]# cat test. java<br>hello world<br>[root@a0c66f548d9f home]#[] |                                                         |             |                                             |       |
|                                                                                                                                                                                                                       |                                                                                                                                                                                                                                                                                                                                                             |                                                         | e 9 60      |                                             |       |
|                                                                                                                                                                                                                       |                                                                                                                                                                                                                                                                                                                                                             |                                                         | 3           | H                                           |       |

好处 :我们以后修改只需要在本地进行修改即可,容器内部会自动进行同步!

# **6.3 安装MySql**

| 1  | # 下载MySql                                                                |  |  |  |  |
|----|--------------------------------------------------------------------------|--|--|--|--|
| 2  | • docker pull mysql:5.7                                                  |  |  |  |  |
| 3  | # 运行MySql,需要做数据挂载,安装MySQL需要配置密码                                          |  |  |  |  |
| 4  | -v 挂载                                                                    |  |  |  |  |
| 5  | -d 后台                                                                    |  |  |  |  |
| 6  | -p 端口映射                                                                  |  |  |  |  |
| 7  | -e MYSQL_ROOT_PASSWORD=AAA 密码                                            |  |  |  |  |
| 8  | # 在启动成功后,我们在本地使用sqlyog来测试连接一下# sqlyog -连接到服务器3310<br>-3310               |  |  |  |  |
|    | 和容器内部的3306进行映射,这个时候我们就可以连接上了# 在本地测试新建一个数据库,查看一下                          |  |  |  |  |
|    | 我们映射的路径是否ok                                                              |  |  |  |  |
| 9  | ---------------------------------------------------------------          |  |  |  |  |
| 10 | # 测试                                                                     |  |  |  |  |
| 11 | • [root@abc ceshi]# docker run -d -p 3310:3306 -v                        |  |  |  |  |
|    | /home/mysql/conf:/etc/mysql/conf.d -v /home/mysql/data:/var/lib/mysql -e |  |  |  |  |
|    | MYSQL_ROOT_PASSWORD=123456<br>-name mysql01 mysql:5.7                    |  |  |  |  |
| 12 | 728013542f3addfd2cd289e2e3636f599621ec5d18f78d908b8a02fa6216089c         |  |  |  |  |
| 13 |                                                                          |  |  |  |  |
| 14 | 使用本地第三方数据库连接工具进行测试:navicat                                               |  |  |  |  |
| 15 | navicat 连接到服务器的3310,3310与容器内3306映射 所以可以访问                                |  |  |  |  |

| ◎ 阿里云服务器 - root@abc .~ - Xshell 7 (Free for Home/School)<br>-<br>×                                                                                                            | T Docker.md - Typora                                                               | ×      |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|--------|
| 文件(F) 编辑(E) 查看(V) 工具(T) 选项卡(B) 窗口(W) 帮助(H)                                                                                                                                    | 文件(F) 编辑(E) 段落(P) 格式(O) 视图(V) 主题(T) 帮助(H)                                          |        |
| 中国·除名 · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · | 文件<br>大纲<br>好处 );我们以后修改只需要在本地进行修改即可,容器内部会自动进行同步!                                   |        |
| → 要添加当前会活,点击左侧的箭头按钮,                                                                                                                                                          |                                                                                    |        |
| = ssh://root:*********@182.92.185.165:22                                                                                                                                      | >最甜                                                                                |        |
| 郎 ◎ 1阿里云服务器<br>-<br>DH                                                                                                                                                        | Navicat Premium<br>MySQL - 新建连接                                                    |        |
| 同<br>370 cat test. Java<br>理<br>371 clear                                                                                                                                     | 119<br>200<br>2008 100<br>117.4<br>STORES<br>常观<br>2008<br>数据库 SSL<br>SSH<br>HITTP |        |
| ាន<br>372<br>ાજ<br>373 vim test. lava                                                                                                                                         | 1<br>0                                                                             |        |
| 374 dacker ps<br>375 docker images                                                                                                                                            | R<br>新发 发言问问<br>加拿法                                                                |        |
| 376 clear<br>377 history                                                                                                                                                      | 19-191.22.17<br>Navicat<br>数据库                                                     |        |
| [root@abc ceshi]# clear<br>[root@abc ceshi]# docker ps                                                                                                                        | bishe<br>docker test                                                               | ರ      |
| PORTS<br>NAMES<br>CONTAINER ID<br>IMAGE<br>COMMAND<br>CREATED<br>STATUS<br>33 minutes ago<br>a0c66f548d9f<br>centos<br>"/bin/bash"<br>Up 12 minutes<br>charming_zhukovsky     | 连接名:<br>docker test<br>information schema                                          |        |
| [root@abc ceshi]# docker images<br>REPOSITORY<br>TAG<br>IMAGE ID<br>CREATED<br>SIZE                                                                                           | mysql                                                                              |        |
| 5bc7ddad0d13<br>my tomcat 1.0<br>atest<br>2 hours ago<br>684MB<br>a2f142e3d016<br>latest<br>2 hours ago<br>tomcat02<br>684MB                                                  | 182.92.185.165<br>= performance schema<br>主机:<br>ું રહ્યુદ                         |        |
| latest<br>605c77e624dd<br>nginx<br>4 months ago<br>141MB<br>tomcat<br>9.0<br>b8e65a4d736d<br>5 months ago<br>680MB                                                            | 端口:<br>3310                                                                        |        |
| tomcat<br>latest<br>fb5657adc892<br>5 months ago<br>680M<br>redis<br>latest<br>7614ae9453d1<br>5 months ago<br>113MB                                                          | FFF 13<br>root                                                                     |        |
| c20987f18b13<br>mysql<br>5.7<br>5 months ago<br>448MB<br>hello-world<br>latest<br>feb5d9fea6a5<br>8 months ago<br>13.3kB                                                      | <br>Artist                                                                         |        |
| centos<br>latest<br>5d0da3dc9764<br>8 months ago<br>231MB<br>portainer/portainer<br>580c0e4e98b0<br>atest<br>14 months ago<br>79 110                                          | v 保存密码                                                                             |        |
| elasticsearch<br>7.6.2<br>f29alee41030<br>2 years ago<br>791MB<br>[root@abc ceshi]# docker run -d -p13310:3306 +v /home/mysql/conf.d -v /home/mysq1/data                      |                                                                                    |        |
| :/var/lib/mysql -e  MYSQL ROOT PASSWORD=123456] -- name mysql01 mysql:5.7<br>728013542f3addfd2cd289e2e3636f599621ec5d18f78d908b8a02fa6216089c                                 |                                                                                    |        |
| [root@abc ceshi]#<br>Socket error Event: 32 Error: 10053                                                                                                                      |                                                                                    |        |
| Connection closing  Socket close.                                                                                                                                             |                                                                                    |        |
| Connection closed by foreign host.                                                                                                                                            |                                                                                    |        |
| Disconnected from remote host(阿里云服务器) at 16:34:05.<br>Type `help' to learn how to use Xshell prompt.                                                                          |                                                                                    |        |
| Ic:\~]\$                                                                                                                                                                      |                                                                                    |        |
| Connecting to 182.92.185.165:22<br>Connection established.                                                                                                                    |                                                                                    |        |
| To escape to local shell, press Ctrl+Alt+].                                                                                                                                   |                                                                                    |        |
| WARNING I The remote SSH server rejected XII forwarding request.<br>Last login: Thu May 26 16:15:07 2022 from 117.136.81.34                                                   |                                                                                    |        |
| Welcome to Alibaba Cloud Elastic Compute Service !                                                                                                                            |                                                                                    |        |
| [root@abc -]# []                                                                                                                                                              | 4 数据库<br>A docker test                                                             |        |
|                                                                                                                                                                               |                                                                                    |        |
|                                                                                                                                                                               | <                                                                                  | 9238 词 |
|                                                                                                                                                                               |                                                                                    |        |

新建数据库,本地的/home/mysql/data 里面就会出现新的数据库

![](_page_45_Picture_0.jpeg)

如果容器没了,只要挂载在本地,数据还是会出现在本机的。 这就是容器数据持久化功能。


# **6.4 具名挂载 & 匿名挂载**

### **6.4.1 匿名挂载**

| 1  | # ••匿名挂载••,                                                      |                                                                             |  |  |  |  |
|----|------------------------------------------------------------------|-----------------------------------------------------------------------------|--|--|--|--|
| 2  |                                                                  |                                                                             |  |  |  |  |
| 3  | 注意这里使用-P表示的指定随机的端口号,没有指定主机的位置信息<br>-v 容器内路径                      |                                                                             |  |  |  |  |
| 4  | • docker run<br>-d -P<br>-name nginx01 -v /etc/nginx nginx       |                                                                             |  |  |  |  |
| 5  | # 查看所有卷的情况                                                       |                                                                             |  |  |  |  |
| 6  | • [root@abc _data]# docker volume ls                             |                                                                             |  |  |  |  |
| 7  | DRIVER                                                           | VOLUME NAME                                                                 |  |  |  |  |
| 8  | local                                                            | 0fc82f426afafb02f2a6809628ceedfddfed2ceea939899840f4d2979a3bf331            |  |  |  |  |
| 9  | local                                                            | 05d862915f42c1d1858214838e44d9ab8fffd105e8c20bfe442b7a01b54c2f64            |  |  |  |  |
| 10 | local                                                            | 49c862d44de94dfcb8ddc5d0e5f16f82c777eedc2d2f699d2e1c85c764e2adb6            |  |  |  |  |
| 11 | local                                                            | 068897006a4793fb993836602acc606ace9f0abc4ef94f7a345a07d8ef9c2f64            |  |  |  |  |
| 12 | local                                                            | c6dab0a9dff5152873c8e5351f5101495c2e5ffc6fe523e64f70bf8c0de36712            |  |  |  |  |
| 13 | local                                                            | ccd2589cb34192b3cafa4011addba789eba2709da2d06181a7db28f2897410bc            |  |  |  |  |
| 14 | local                                                            | d52122937d35957bef4138c05c00b4f4dc88a343d6de3030fa52a54bebc2470d            |  |  |  |  |
| 15 | local                                                            | juming-nginx                                                                |  |  |  |  |
| 16 |                                                                  |                                                                             |  |  |  |  |
| 17 |                                                                  | # 这里发现,这种就是匿名挂载,我们在-v只写了容器内的路径,没有写容器外的路径                                    |  |  |  |  |
| 18 |                                                                  | --------------------------------------------------------------------------- |  |  |  |  |
|    |                                                                  |                                                                             |  |  |  |  |
| 19 | # 查看卷的具体信息                                                       |                                                                             |  |  |  |  |
| 20 | • [root@abc _data]# docker inspect                               |                                                                             |  |  |  |  |
|    | 0fc82f426afafb02f2a6809628ceedfddfed2ceea939899840f4d2979a3bf331 |                                                                             |  |  |  |  |
| 21 | [                                                                |                                                                             |  |  |  |  |
| 22 | {                                                                |                                                                             |  |  |  |  |
| 23 |                                                                  | "CreatedAt": "2022-05-26T10:03:48+08:00",                                   |  |  |  |  |
|    |                                                                  |                                                                             |  |  |  |  |

| 24 | "Driver": "local",                                                          |
|----|-----------------------------------------------------------------------------|
| 25 | "Labels": null,                                                             |
| 26 | "Mountpoint":                                                               |
|    | "/var/lib/docker/volumes/0fc82f426afafb02f2a6809628ceedfddfed2ceea939899840 |
|    | f4d2979a3bf331/_data",                                                      |
| 27 | "Name":                                                                     |
|    | "0fc82f426afafb02f2a6809628ceedfddfed2ceea939899840f4d2979a3bf331",         |
| 28 | "Options": null,                                                            |
| 29 | "Scope": "local"                                                            |
| 30 | }                                                                           |
| 31 | ]                                                                           |
|    |                                                                             |

## **6.4.2 具名挂载**


| 1      | # ••具名挂载••                                                                                                                                            |  |  |  |  |  |
|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------|--|--|--|--|--|
| 2      |                                                                                                                                                       |  |  |  |  |  |
| 3      | • docker run -d -P<br>-name nginx02 -v juming-nginx:/etc/nginx<br>nginx                                                                               |  |  |  |  |  |
| 4<br>5 | ---------------------------------------------------------------------<br>• [root@abc ~]# docker run -d -P<br>-name nginx02 -v juming-nginx:/etc/nginx |  |  |  |  |  |
| 6      | nginx<br>086e88b4858f6cca43c9d1237effb543d1e94749046665739bf8039c49d203e3                                                                             |  |  |  |  |  |
| 7      | • [root@abc ~]# docker volume ls                                                                                                                      |  |  |  |  |  |
| 8      | DRIVER<br>VOLUME NAME                                                                                                                                 |  |  |  |  |  |
| 9      | local<br>0fc82f426afafb02f2a6809628ceedfddfed2ceea939899840f4d2979a3bf331                                                                             |  |  |  |  |  |
| 10     | local<br>05d862915f42c1d1858214838e44d9ab8fffd105e8c20bfe442b7a01b54c2f64                                                                             |  |  |  |  |  |
| 11     | local<br>49c862d44de94dfcb8ddc5d0e5f16f82c777eedc2d2f699d2e1c85c764e2adb6                                                                             |  |  |  |  |  |
| 12     | local<br>068897006a4793fb993836602acc606ace9f0abc4ef94f7a345a07d8ef9c2f64                                                                             |  |  |  |  |  |
| 13     | local<br>c6dab0a9dff5152873c8e5351f5101495c2e5ffc6fe523e64f70bf8c0de36712                                                                             |  |  |  |  |  |
| 14     | local<br>ccd2589cb34192b3cafa4011addba789eba2709da2d06181a7db28f2897410bc                                                                             |  |  |  |  |  |
| 15     | local<br>d52122937d35957bef4138c05c00b4f4dc88a343d6de3030fa52a54bebc2470d                                                                             |  |  |  |  |  |
| 16     | local<br>juming001-nginx                                                                                                                              |  |  |  |  |  |
| 17     | local<br>juming-nginx                                                                                                                                 |  |  |  |  |  |
| 18     |                                                                                                                                                       |  |  |  |  |  |
| 19     | 与上面相比,多了个倒数第二行。也就是自己新加的卷                                                                                                                              |  |  |  |  |  |
| 20     |                                                                                                                                                       |  |  |  |  |  |
| 21     |                                                                                                                                                       |  |  |  |  |  |
| 22     | -------------------------------------------------------------------                                                                                   |  |  |  |  |  |
| 23     | # 查看具名nginx信息                                                                                                                                         |  |  |  |  |  |
| 24     | • [root@abc ~]# docker volume inspect juming-nginx                                                                                                    |  |  |  |  |  |
| 25     | [                                                                                                                                                     |  |  |  |  |  |
| 26     | {                                                                                                                                                     |  |  |  |  |  |
| 27     | "CreatedAt": "2022-05-26T19:14:50+08:00",                                                                                                             |  |  |  |  |  |
| 28     | "Driver": "local",                                                                                                                                    |  |  |  |  |  |
| 29     | "Labels": null,                                                                                                                                       |  |  |  |  |  |
| 30     | "Mountpoint": "/var/lib/docker/volumes/juming-nginx/_data",挂载的具                                                                                       |  |  |  |  |  |
|        | 体目录的地址                                                                                                                                                |  |  |  |  |  |
| 31     | "Name": "juming-nginx",                                                                                                                               |  |  |  |  |  |
| 32     | "Options": null,                                                                                                                                      |  |  |  |  |  |
| 33     | "Scope": "local"                                                                                                                                      |  |  |  |  |  |
| 34     | }                                                                                                                                                     |  |  |  |  |  |
| 35     | ]                                                                                                                                                     |  |  |  |  |  |
| 36     | Docker容器内的卷,没有指定目录情况下都是在 /var/lib/docker/volumes/XXXX/-data                                                                                           |  |  |  |  |  |
| 37     | ---------------------------------------------------------------------------                                                                           |  |  |  |  |  |
|        |                                                                                                                                                       |  |  |  |  |  |

| 38 | # 进入目录查看dicker卷信息                                                                      |  |  |  |  |  |  |  |
|----|----------------------------------------------------------------------------------------|--|--|--|--|--|--|--|
| 39 |                                                                                        |  |  |  |  |  |  |  |
| 40 | • [root@abc ~]# cd /var/lib/docker                                                     |  |  |  |  |  |  |  |
| 41 | • [root@abc docker]# ls                                                                |  |  |  |  |  |  |  |
| 42 | buildkit<br>containers<br>image<br>network<br>overlay2<br>plugins<br>runtimes<br>swarm |  |  |  |  |  |  |  |
|    | tmp<br>trust<br>volumes                                                                |  |  |  |  |  |  |  |
| 43 | • [root@abc docker]# cd volumes                                                        |  |  |  |  |  |  |  |
| 44 | • [root@abc volumes]# ls                                                               |  |  |  |  |  |  |  |
| 45 | 068897006a4793fb993836602acc606ace9f0abc4ef94f7a345a07d8ef9c2f64                       |  |  |  |  |  |  |  |
| 46 | 0fc82f426afafb02f2a6809628ceedfddfed2ceea939899840f4d2979a3bf331                       |  |  |  |  |  |  |  |
| 47 | 49c862d44de94dfcb8ddc5d0e5f16f82c777eedc2d2f699d2e1c85c764e2adb6                       |  |  |  |  |  |  |  |
| 48 | backingFsBlockDev                                                                      |  |  |  |  |  |  |  |
| 49 | c6dab0a9dff5152873c8e5351f5101495c2e5ffc6fe523e64f70bf8c0de36712                       |  |  |  |  |  |  |  |
| 50 | ccd2589cb34192b3cafa4011addba789eba2709da2d06181a7db28f2897410bc                       |  |  |  |  |  |  |  |
| 51 | d52122937d35957bef4138c05c00b4f4dc88a343d6de3030fa52a54bebc2470d                       |  |  |  |  |  |  |  |
| 52 | juming-nginx                                                                           |  |  |  |  |  |  |  |
| 53 | metadata.db                                                                            |  |  |  |  |  |  |  |
| 54 | • [root@abc volumes]# pwd                                                              |  |  |  |  |  |  |  |
| 55 | /var/lib/docker/volumes                                                                |  |  |  |  |  |  |  |
| 56 | • [root@abc volumes]# cd juming-nginx                                                  |  |  |  |  |  |  |  |
| 57 | • [root@abc juming-nginx]# ls                                                          |  |  |  |  |  |  |  |
| 58 | _data                                                                                  |  |  |  |  |  |  |  |
| 59 | • [root@abc juming-nginx]# cd _data                                                    |  |  |  |  |  |  |  |
| 60 | • [root@abc _data]# ls                                                                 |  |  |  |  |  |  |  |
| 61 | conf.d<br>fastcgi_params<br>mime.types<br>modules<br>nginx.conf<br>scgi_params         |  |  |  |  |  |  |  |
|    | uwsgi_params                                                                           |  |  |  |  |  |  |  |
|    |                                                                                        |  |  |  |  |  |  |  |

- Docker容器内的卷,没有指定目录情况下都是在 /var/lib/docker/volumes/XXXX/-data
- 我们通过具名挂载可以方便找到我们的一个卷,大多数情况下都是使用具名挂载

## **6.4.3 判断具名与匿名挂载**

```
# 如何确定是匿名挂载还是具名挂载,还是指定路径挂载 •
  -v 容器内路径 # 匿名挂载
  -v 卷名:容器内路径 # 具名挂载,卷名没有路径/
  -v 宿主机路径:容器内路径 # 指定路径挂载,一般/开头
  1234
1
2
3
4
5
```
## **6.4.4 拓展**

![](_page_47_Picture_6.jpeg)

# **6.5 数据卷容器;DockerFile**


| 1  | [root@abc home]# pwd                                                        |               |                     |                       |        |  |  |
|----|-----------------------------------------------------------------------------|---------------|---------------------|-----------------------|--------|--|--|
| 2  | /home                                                                       |               |                     |                       |        |  |  |
| 3  | • [root@abc home]# ls                                                       |               |                     |                       |        |  |  |
| 4  | ceshi<br>dockerfile                                                         | docker-test   | mysql<br>test1.java | test.java             |        |  |  |
| 5  | [root@abc home]# cd docker-test                                             |               |                     |                       |        |  |  |
| 6  | • [root@abc docker-test]# vim testdf                                        |               |                     | # 创建dockerfile文件并编写命令 |        |  |  |
| 7  | • [root@abc docker-test]# cat testdf                                        |               | # 打印编写的命令           |                       |        |  |  |
| 8  | FROM centos:7                                                               |               |                     |                       |        |  |  |
| 9  |                                                                             |               |                     |                       |        |  |  |
|    |                                                                             |               |                     |                       |        |  |  |
| 10 | VOLUME ["volume01","volume02"]                                              |               |                     |                       |        |  |  |
| 11 |                                                                             |               |                     |                       |        |  |  |
| 12 | CMD echo "-----------end-------------"                                      |               |                     |                       |        |  |  |
| 13 | CMD /bin/bash                                                               |               |                     |                       |        |  |  |
| 14 |                                                                             |               |                     |                       |        |  |  |
| 15 | ----------------------------------------------------------                  |               |                     |                       |        |  |  |
| 16 | • [root@abc docker-test]# docker build -f testdf -t centos-test20220527:0.2 |               |                     |                       |        |  |  |
|    |                                                                             |               |                     |                       |        |  |  |
| 17 | Sending build context to Docker daemon                                      |               | 2.048kB             |                       |        |  |  |
| 18 | Step 1/4 : FROM centos:7                                                    |               |                     |                       |        |  |  |
| 19 | -> eeb6ee3f44bd                                                             |               |                     |                       |        |  |  |
| 20 | Step 2/4 : VOLUME ["volume01","volume02"]                                   |               |                     |                       |        |  |  |
| 21 | -> Running in 0fa0f5afa14b                                                  |               |                     |                       |        |  |  |
| 22 | Removing intermediate container 0fa0f5afa14b                                |               |                     |                       |        |  |  |
| 23 | -> ba32b5f9e5ad                                                             |               |                     |                       |        |  |  |
| 24 | Step 3/4 : CMD echo "-----------end-------------"                           |               |                     |                       |        |  |  |
| 25 | -> Running in 9dc06ce9febb                                                  |               |                     |                       |        |  |  |
| 26 | Removing intermediate container 9dc06ce9febb                                |               |                     |                       |        |  |  |
| 27 | -> 28c6848d9ed0                                                             |               |                     |                       |        |  |  |
| 28 | Step 4/4 : CMD /bin/bash                                                    |               |                     |                       |        |  |  |
| 29 | -> Running in dc3f99a148df                                                  |               |                     |                       |        |  |  |
| 30 | Removing intermediate container dc3f99a148df                                |               |                     |                       |        |  |  |
| 31 | -> 3bb636778c29                                                             |               |                     |                       |        |  |  |
| 32 | Successfully built 3bb636778c29                                             |               |                     | # 运行成功                |        |  |  |
| 33 | Successfully tagged centos-test20220527:0.2                                 |               |                     |                       |        |  |  |
| 34 | • [root@abc docker-test]# docker images                                     |               |                     |                       |        |  |  |
| 35 | REPOSITORY                                                                  | TAG           | IMAGE ID            | CREATED               | SIZE   |  |  |
| 36 | centos-test20220527                                                         | 0.2           | 3bb636778c29        | 5 seconds ago         | 204MB  |  |  |
| 37 | mycentos20220527                                                            | 0.1           | 32a73d064967        | 37 minutes ago        | 601MB  |  |  |
| 38 | <none></none>                                                               | <none></none> | cf1d4afcc58a        | 57 minutes ago        | 231MB  |  |  |
| 39 | my_tomcat_1.0                                                               | latest        | 5bc7ddad0d13        | 20 hours ago          | 684MB  |  |  |
| 40 | tomcat02                                                                    | latest        | a2f142e3d016        | 20 hours ago          | 684MB  |  |  |
| 41 | nginx                                                                       | latest        | 605c77e624dd        | 4 months ago          | 141MB  |  |  |
| 42 | tomcat                                                                      | 9.0           | b8e65a4d736d        | 5 months ago          | 680MB  |  |  |
| 43 | tomcat                                                                      | latest        | fb5657adc892        | 5 months ago          | 680MB  |  |  |
| 44 | redis                                                                       | latest        | 7614ae9453d1        | 5 months ago          | 113MB  |  |  |
|    |                                                                             |               |                     |                       |        |  |  |
| 45 | mysql                                                                       | 5.7           | c20987f18b13        | 5 months ago          | 448MB  |  |  |
| 46 | docker                                                                      | latest        | 15a9bc7c6340        | 5 months ago          | 216MB  |  |  |
| 47 | hello-world                                                                 | latest        | feb5d9fea6a5        | 8 months ago          | 13.3kB |  |  |
| 48 | centos                                                                      | 7             | eeb6ee3f44bd        | 8 months ago          | 204MB  |  |  |
| 49 | centos                                                                      | latest        | 5d0da3dc9764        | 8 months ago          | 231MB  |  |  |
| 50 | portainer/portainer                                                         | latest        | 580c0e4e98b0        | 14 months ago         | 79.1MB |  |  |
| 51 | elasticsearch                                                               | 7.6.2         | f29a1ee41030        | 2 years ago           | 791MB  |  |  |

```
---------------------------------------------------------
   • [root@abc docker-test]# docker run -it 3bb636778c29 /bin/bash
   • [root@fa0c7a431276 /]# ls
   anaconda-post.log dev home lib64 mnt proc run srv tmp var
   •volume02•
   bin etc lib media opt root sbin sys usr •volume01•
   这两个目录就是生成镜像时候自动挂载的目录,外界一定有同步的目录
   ----------------------------------------------------------------
   • #回到主机,查看卷挂载目录路径
   • exit
   • [root@abc ~]# docker ps
   CONTAINER ID IMAGE COMMAND CREATED STATUS
            PORTS NAMES
   21556eceea04 3bb636778c29 "/bin/bash" About a minute ago Up About a
   minute eloquent_raman
   • [root@abc ~]# docker inspect 21556eceea04
           "Mounts": [
               {
                  "Type": "volume",
                  "Name":
   "8415d45427f1ec84c95008dd303fbb7ce49006a6aa780d730786b58971592b78",
                  "Source":
   "/var/lib/docker/volumes/8415d45427f1ec84c95008dd303fbb7ce49006a6aa780d7307
   86b58971592b78/_data",
                  "Destination": "volume02",
                  "Driver": "local",
                  "Mode": "",
                  "RW": true,
                  "Propagation": ""
               },
               {
                  "Type": "volume",
                  "Name":
   "316156f28050bc03f6539b009dbee43a316578fb3262965f1d6fea09200d59c1",
                  "Source":
   "/var/lib/docker/volumes/316156f28050bc03f6539b009dbee43a316578fb3262965f1d
   6fea09200d59c1/_data",
                  "Destination": "volume01",
                  "Driver": "local",
                  "Mode": "",
                  "RW": true,
                  "Propagation": ""
               }
           ],
   这种方式未来的使用非常多,因为我们自己通常会构建自己的镜像
   假设构建镜像的时候没有挂载,需要自己手动挂载镜像 -v 卷名:容器内路径
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
```
![](_page_50_Figure_0.jpeg)

6.6 # 数据卷容器

多个MySQL同步数据

![](_page_50_Figure_3.jpeg)

### 启动3个上面的测试容器

docker01是父容器

![](_page_50_Picture_7.jpeg)

CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES 90038b87d58f centos-test20220527:0.2 "/bin/sh -c /bin/bash" About a minute ago Up About a minute docker01 • [root@abc ~]# docker run -it -name docker02 -volumes-from docker1 centos-test20220527:0.2 • [root@b180d1e0df2d /]# ls anaconda-post.log dev home lib64 mnt proc run srv tmp var volume02 bin etc lib media opt root sbin sys usr volume01 • [root@af6e6b4a9e97 volume01]# ls 啥都没有,空 # 等待docker1的创建命令执行后 • [root@5710c55ca265 volume01]# ls 1.java 这时候就可以查询到了 docker1就是数据卷容器,被挂载 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16

![](_page_51_Figure_1.jpeg)

docker2,3都挂载在docker1上,删除docker1时候,docker2,3数据都有,且同步

这是因为docker1,2,3本质都是挂载在主机上某个目录的

### **6.6.1 多个MySql数据共享**

```
docker run -d -p 3310:3306
    -v /etc/mysql/conf.d
    -v /var/lib/mysql
    -e MYSQL_ROOT_PASSWORD=338218
     -name mysql01 mysql:5.7
    docker run -d -p 3311:3306
    -e MYSQL_ROOT_PASSWORD=338218
     -name mysql02
     -volumes-from mysql01 mysql:5.7
    # 这个时候可以实现两个容器数据同步
 1
 2
 3
 4
 5
 6
 7
 8
 9
10
11
12
13
```
### 结论:

- 容器之间配置信息的传递,数据卷容器的生命周期这一直持续到没有容器使用为止
- 但是一旦持久化到了本地,这个时候,本地的数据不会被删除

# **7 DockerFile**

dockerfile是用来构建docker镜像的文件,命令参数脚本

# **7.1 构建步骤:**

| 1. 编写一个dockerfile文件<br>1 |
|--------------------------|
|--------------------------|

- 2. docker build构建为一个镜像 2
- 3. docker run 运行镜像 3
- 4. docker push发布镜像(DockerHub、阿里云镜像仓库) 4
- 很多官方的镜像都是基础包,很多功能都没有,(基础包)。我们通常会自己搭建自己的镜像

# **7.2 基础知识:**

- 1、每个保留关键字(指令)都是必须是**大写字母** 2、执行从上到下顺序执行 3、#表示注释 4、每一个指令都会创建提交一个新的镜像层,并提交 1 2 3 4
![](_page_53_Figure_0.jpeg)

- dockerfile是面向开发 的,我们以后要发布项目,做镜像,就需要编写dockerfile文件,这个文件十 分简单!
- Docker镜像逐渐成为了企业交付的标准,必须要掌握
- 步骤:开发,部署,运维…缺一不可
	- DockerFile:构建文件,定义了一切的步骤,源代码
	- DockerImages:通过DockerFile构建生成的镜像,最终发布和运行的产品
	- Docker容器:容器就是镜像运行起来提供服务的

前面教的是使用Docker,现在学习的是如何创建Docker,先回用,后会制造

## **举例:ker File指令**

![](_page_54_Figure_0.jpeg)

| 1  | FROM         | # 基础镜像,一切从这里开始                              |
|----|--------------|---------------------------------------------|
| 2  | • MAINTAINER | # 镜像是谁写的,姓名+邮箱                              |
| 3  | • RUN        | # 镜像构建的时候需要运行的命令                            |
| 4  | • ADD        | # 步骤:往里面加东西:tomcat镜像,这个tomcat压缩包,添加内容       |
| 5  | • WORKDIR    | # 镜像的工作目录                                   |
| 6  | • VOLUME     | # 挂载的目录                                     |
| 7  | • EXPOSE     | # 暴露端口配置                                    |
| 8  | • CMD        | # 指定容器运行时的shell命令,只有最后一个生效,可被替代             |
| 9  | • ENTRYPOINT | # 指定容器运行时的shell命令,可以追加命令                    |
| 10 | • ONBUILD    | # 当构建一个被继承DockerFile这个时候就会运行ONBUILD的指令,触发指令 |
| 11 | • COPY       | # 类似ADD,将我们文件拷贝到镜像中                         |
| 12 | • ENV        | # 构建的时候设置环境变量                               |

| 指令         | 说明                                   |
|------------|--------------------------------------|
| FROM       | 设置镜像使用的基础镜像                          |
| MAINTAINER | 设置镜像的作者                              |
| RUN        | 编译镜像时运行的脚本                           |
| CMD        | 设置容器的启动命令                            |
| LABEL      | 设置镜像的标签                              |
| EXPOESE    | 设置镜像暴露的端口                            |
| ENV        | 设置容器的环境变量                            |
| ADD        | 编译镜像时复制文件到镜像中                        |
| COPY       | 编译镜像时复制文件到镜像中                        |
| ENTRYPOINT | 设置容器的入口程序                            |
| VOLUME     | 设置容器的挂载卷                             |
| USER       | 设置运行RUN CMD ENTRYPOINT的用户名           |
| WORKDIR    | 设置RUN CMD ENTRYPOINT COPY ADD指令的工作目录 |
| ARG        | 设置编译镜像时加入的参数                         |
| ONBUILD    | 设置镜像的ONBUILD指令                       |
| STOPSIGNAL | 设置容器的退出信号量 dn.net/q@gffor            |

| 指令             | 描述                                                                                                                                                                                             | 指令                    | 描述                                                                                                                                   |
|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| FROM           | 构建的新镜像是基于哪个镜像<br>例如: FROM centos:7                                                                                                                                                             | COPY                  | 拷贝文件或目录到镜像,用法同上<br>例如: COPY ./start.sh /start.sh                                                                                     |
| MAINTAINE<br>R | 镜像维护者姓名或邮箱地址<br>例如: MAINTAINER test                                                                                                                                                            | ENTRYPOINT            | 运行容器时执行的Shell命令<br>例如:<br>ENTRYPOINT ["/bin/bash", "-c", "/start.sh"]<br>ENTRYPOINT /bin/bash -c '/start.sh'                         |
| RUN            | 构建镜像时运行的Shell命令<br>例如:<br>RUN ["yum", "install", "nginx"]<br>RUN yum install nginx                                                                                                             | VOLUME                | 指定容器挂载点到宿主机自动生成的目录或其他容器<br>例如:<br>VOLUME ["/var/lib/mysql"]                                                                          |
| CMD            | 运行容器时执行的Shell命令<br>例如:<br>CMD ["-c", "/start.sh"]<br>CMD ["/usr/sbin/sshd", "-D"]<br>CMD /usr/sbin/sshd -D                                                                                     | USER                  | 为RUN、CMD和ENTRYPOINT执行命令指定运行用户<br>USER <user>{:<group>] or USER <uid>[:<gid>]<br/>例如:USER ops</gid></uid></group></user>              |
| EXPOSE         | 声明容器运行的服务端口<br>例如: EXPOSE 80 443                                                                                                                                                               | WORKDIR               | 为RUN、CMD、ENTRYPOINT、COPY和ADD设置工作目录<br>例如: WORKDIR /data                                                                              |
| ENV            | 设置容器内环境变量<br>例如: ENV MYSQL_ROOT_PASSWORD 123456                                                                                                                                                | HEALTHCHEC  健康检查<br>K | HEALTHCHECK -- interval=5m -- timeout=3s -- retries=3 \<br>CMD curl -f http://localhost/ II exit 1                                   |
| ADD            | 拷贝文件或目录到镜像,如果是URL或压缩包会自动下载或自动解压<br>ADD <src>  &lt; dest&gt;<br/>ADD ["<src>"  "<dest>"]<br/>ADD https://xxx.com/html.tar.gz /var/www/html<br/>ADD html.tar.gz /var/www/html</dest></src></src> | ARG                   | 在构建镜像时指定一些参数<br>例如:<br>FROM centos:7<br>ARG user # ARG user=root<br>USER \$user<br># docker build -- build-arg user=ops Dockerfile . |

# **7.3 实战训练**

Docker Hub中99%的镜像都是从这个基础镜像过来的FROM scratch,然后配置需要的软件和配置来进行构建 的

```
# 主机根目录下/home 创建dockerfile文件夹
    [root@abc ~]# cd /home
    [root@abc home]# ls
    ceshi mysql test1.java test.java
    • [root@abc home]# mkdir dockerfile
    [root@abc home]# ls
    ceshi dockerfile mysql test1.java test.java
    • [root@abc home]# cd dockerfile
    [root@abc dockerfile]#
    :7
    1. ••编写DockerFile文件••
    # • • • 官方的centos没有 vim,i'f'con'fig ,自定义镜像的目标就是加上vim• • •
    # 开始编写自定义DockerFile文件
    • [root@abc dockerfile]# vim mydf
    • [root@abc dockerfile]# cat mydf
    FROM centos:7
    MAINTAINER YiXia20220527<yxmiaoyu@163.com>
    ENV MYPATH /usr/local
    WORKDIR $MYPATH
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
```

| 24       |                                                                                        |               |              |                |          |   |
|----------|----------------------------------------------------------------------------------------|---------------|--------------|----------------|----------|---|
| 25       | RUN yum -y install vim                                                                 |               |              |                |          |   |
| 26       | RUN yum -y install net-tools                                                           |               |              |                |          |   |
| 27       |                                                                                        |               |              |                |          |   |
| 28       | EXPOSE 80                                                                              |               |              |                |          |   |
| 29       |                                                                                        |               |              |                |          |   |
| 30       | CMD echo \$MYPATH                                                                      |               |              |                |          |   |
| 31       | CMD echo "<br>-end-----"                                                               |               |              |                |          |   |
| 32       | CMD /bin/bash                                                                          |               |              |                |          |   |
| 33       |                                                                                        |               |              |                |          |   |
| 34       | [root@abc dockerfile]#                                                                 |               |              |                |          |   |
| 35       |                                                                                        |               |              |                |          |   |
| 36       |                                                                                        |               |              |                |          |   |
| 37       |                                                                                        |               |              |                |          |   |
| 38       |                                                                                        |               |              |                |          |   |
| 39       |                                                                                        |               |              |                |          |   |
| 40       |                                                                                        |               |              |                |          |   |
| 41<br>42 | 2. ••构建镜像••<br>• [root@abc dockerfile]# docker build -f mydf -t mycentos20220527:0.1 . |               |              |                |          |   |
| 43       | Sending build context to Docker daemon                                                 |               | 27.65kB      |                |          |   |
| 44       | …………                                                                                   |               |              |                |          |   |
| 45       | Step 10/10 : CMD /bin/bash                                                             |               |              |                |          |   |
| 46       | -> Running in 3c823cdde8d3                                                             |               |              |                |          |   |
| 47       | Removing intermediate container 3c823cdde8d3                                           |               |              |                |          |   |
| 48       | -> 32a73d064967                                                                        |               |              |                |          |   |
| 49       | Successfully built 32a73d064967                                                        |               |              | # 运行成功了        |          |   |
| 50       | Successfully tagged mycentos20220527:0.1                                               |               |              |                |          |   |
| 51       | • [root@abc dockerfile]# docker images                                                 |               |              |                |          |   |
| 52       | REPOSITORY                                                                             | TAG           | IMAGE ID     | CREATED        | SIZE     |   |
| 53       | mycentos20220527<br>我的自定义镜像                                                            | 0.1           | 32a73d064967 | 13 minutes ago | 601MB    | # |
| 54       | <none></none>                                                                          | <none></none> | cf1d4afcc58a | 33 minutes ago | 231MB    |   |
| 55       | my_tomcat_1.0                                                                          | latest        | 5bc7ddad0d13 | 19 hours ago   | 684MB    |   |
| 56       | tomcat02                                                                               | latest        | a2f142e3d016 | 19 hours ago   | 684MB    |   |
| 57       | nginx                                                                                  | latest        | 605c77e624dd | 4 months ago   | 141MB    |   |
| 58       | tomcat                                                                                 | 9.0           | b8e65a4d736d | 5 months ago   | 680MB    |   |
| 59       | tomcat                                                                                 | latest        | fb5657adc892 | 5 months ago   | 680MB    |   |
| 60       | redis                                                                                  | latest        | 7614ae9453d1 | 5 months ago   | 113MB    |   |
| 61       | mysql                                                                                  | 5.7           | c20987f18b13 | 5 months ago   | 448MB    |   |
| 62       | docker                                                                                 | latest        | 15a9bc7c6340 | 5 months ago   | 216MB    |   |
| 63       | hello-world                                                                            | latest        | feb5d9fea6a5 | 8 months ago   | 13.3kB   |   |
| 64       | centos                                                                                 | 7             | eeb6ee3f44bd | 8 months ago   | 204MB    |   |
| 65       | centos                                                                                 | latest        | 5d0da3dc9764 | 8 months ago   | 231MB    |   |
| 66       | portainer/portainer                                                                    | latest        | 580c0e4e98b0 | 14 months ago  | 79.1MB   |   |
| 67       | elasticsearch                                                                          | 7.6.2         | f29a1ee41030 | 2 years ago    | 791MB    |   |
| 68       |                                                                                        |               |              |                |          |   |
| 69       |                                                                                        |               |              |                |          |   |
| 70       |                                                                                        |               |              |                |          |   |
| 71       |                                                                                        |               |              |                |          |   |
| 72       |                                                                                        |               |              |                |          |   |
| 73<br>74 | 3.••运行镜像••                                                                             |               |              |                |          |   |
|          |                                                                                        |               |              |                |          |   |
|          | • [root@abc dockerfile]# docker run -it mycentos20220527:0.1<br>话会默认去找最新的              |               |              |                | # 不带版本号的 |   |
| 75       | • [root@ffe933c501d4 local]# pwd                                                       |               |              |                |          |   |

```
• [root@ffe933c501d4 local]# ifconfig
    eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST> mtu 1500
            inet 172.17.0.2 netmask 255.255.0.0 broadcast 172.17.255.255
            ether 02:42:ac:11:00:02 txqueuelen 0 (Ethernet)
            RX packets 8 bytes 656 (656.0 B)
            RX errors 0 dropped 0 overruns 0 frame 0
            TX packets 0 bytes 0 (0.0 B)
            TX errors 0 dropped 0 overruns 0 carrier 0 collisions 0
    lo: flags=73<UP,LOOPBACK,RUNNING> mtu 65536
            inet 127.0.0.1 netmask 255.0.0.0
            loop txqueuelen 1000 (Local Loopback)
            RX packets 0 bytes 0 (0.0 B)
            RX errors 0 dropped 0 overruns 0 frame 0
            TX packets 0 bytes 0 (0.0 B)
            TX errors 0 dropped 0 overruns 0 carrier 0 collisions 0
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
```
### **7.3.1 查看images历史 docker images images的ID**


| 1  |                          |              | [root@abc dockerfile]# docker history c20987f18b13 |
|----|--------------------------|--------------|----------------------------------------------------|
| 2  | IMAGE                    | CREATED      | CREATED BY                                         |
|    | SIZE                     | COMMENT      |                                                    |
| 3  | c20987f18b13             | 5 months ago | /bin/sh -c #(nop)<br>CMD ["mysqld"]                |
|    | 0B                       |              |                                                    |
| 4  | <missing></missing>      | 5 months ago | /bin/sh -c #(nop)<br>EXPOSE 3306 33060             |
|    | 0B                       |              |                                                    |
| 5  | <missing></missing>      | 5 months ago | /bin/sh -c #(nop)<br>ENTRYPOINT ["docker           |
|    | entry…<br>0B             |              |                                                    |
| 6  | <missing></missing>      | 5 months ago | /bin/sh -c ln -s usr/local/bin/docker              |
|    | entryp…<br>34B           |              |                                                    |
| 7  | <missing></missing>      | 5 months ago | /bin/sh -c #(nop) COPY                             |
|    | file:345a22fe55d3e678…   |              | 14.5kB                                             |
| 8  | <missing></missing>      | 5 months ago | /bin/sh -c #(nop)<br>VOLUME [/var/lib/mysql]       |
|    | 0B                       |              |                                                    |
| 9  | <missing></missing>      | 5 months ago | /bin/sh -c {<br>echo mysql-community-server        |
|    | m…<br>313MB              |              |                                                    |
| 10 | <missing></missing>      | 5 months ago | /bin/sh -c echo 'deb                               |
|    | http: /repo.mysql.com/a… |              | 55B                                                |
| 11 | <missing></missing>      | 5 months ago | /bin/sh -c #(nop)<br>ENV                           |
|    | MYSQL_VERSION=5.7.36-…   | 0B           |                                                    |
| 12 | <missing></missing>      | 5 months ago | /bin/sh -c #(nop)<br>ENV MYSQL_MAJOR=5.7           |
|    | 0B                       |              |                                                    |
| 13 | <missing></missing>      | 5 months ago | /bin/sh -c set -ex;                                |
|    | key='A4A9406876FCBD3C45… |              | 1.84kB                                             |
| 14 | <missing></missing>      | 5 months ago | /bin/sh -c apt-get update<br>& apt-get             |
|    | install…<br>52.2MB       |              |                                                    |
| 15 | <missing></missing>      | 5 months ago | /bin/sh -c mkdir /docker-entrypoint-initdb.d       |
|    | 0B                       |              |                                                    |
| 16 | <missing></missing>      | 5 months ago | /bin/sh -c set -eux;<br>savedAptMark="\$(apt       |
|    | ma…<br>4.17MB            |              |                                                    |

| 17 | <missing></missing> | 5 months ago            | /bin/sh -c #(nop)<br>ENV GOSU_VERSION=1.12   |
|----|---------------------|-------------------------|----------------------------------------------|
|    | 0B                  |                         |                                              |
| 18 | <missing></missing> | 5 months ago            | /bin/sh -c apt-get update<br>& apt-get       |
|    | install…            | 9.34MB                  |                                              |
| 19 | <missing></missing> | 5 months ago            | /bin/sh -c groupadd -r mysql<br>& useradd -r |
|    | -…<br>329kB         |                         |                                              |
| 20 | <missing></missing> | 5 months ago            | /bin/sh -c #(nop)<br>CMD ["bash"]            |
|    | 0B                  |                         |                                              |
| 21 | <missing></missing> | 5 months ago            | /bin/sh -c #(nop) ADD                        |
|    |                     | file:bd5c9e0e0145fe33b… | 69.3MB                                       |

### **7.3.2 拓展:Vim文本编辑器**

# **Vim**

- Vim 是从 vi 发展出来的一个文本编辑器。代码补全、编译及错误跳转等方便编程的功能特别丰 富,在程序员中被广泛使用。
- 简单的来说, vi 是老式的字处理器,不过功能已经很齐全了,但是还是有可以进步的地方。 vim 则可以说是程序开发者的一项很好用的工具。
- 连 vim 的官方网站 (https: [/www.vim.org/](https://www.vim.org/)) 自己也说 vim 是一个程序开发工具而不是文字 处理软件。

![](_page_59_Figure_6.jpeg)

# **vi/vim 的使用**

基本上 vi/vim 共分为三种模式,分别是**命令模式(Command mode)**,**输入模式(Insert mode)**和**底线命令模式(Last line mode)**。 这三种模式的作用分别是:

### **命令模式:**

用户刚刚启动 vi/vim,便进入了命令模式。

此状态下敲击键盘动作会被Vim识别为命令,而非输入字符。比如我们此时按下i,并不会输入一个字 符,i被当作了一个命令。

以下是常用的几个命令:

- **i** 切换到输入模式,以输入字符。
- **x** 删除当前光标所在处的字符。
- **:** 切换到底线命令模式,以在最底一行输入命令。

若想要编辑文本:启动Vim,进入了命令模式,按下i,切换到输入模式。

命令模式只有一些最基本的命令,因此仍要依靠底线命令模式输入更多命令。

### **输入模式**

在命令模式下按下i就进入了输入模式。

在输入模式中,可以使用以下按键:

- **字符按键以及Shift组合**,输入字符
- **ENTER**,回车键,换行
- **BACK SPACE**,退格键,删除光标前一个字符
- **DEL**,删除键,删除光标后一个字符
- **方向键**,在文本中移动光标
- **HOME**/**END**,移动光标到行首/行尾
- **Page Up**/**Page Down**,上/下翻页
- **Insert**,切换光标为输入/替换模式,光标将变成竖线/下划线
- **ESC**,退出输入模式,切换到命令模式

### **底线命令模式**

在命令模式下按下:(英文冒号)就进入了底线命令模式。 底线命令模式可以输入单个或多个字符的命令,可用的命令非常多。 在底线命令模式中,基本的命令有(已经省略了冒号):

- q 退出程序
- w 保存文件

按ESC键可随时退出底线命令模式。

# **7.4 CMD 与 ENTRYPOINT 区别**

还是按照上面的新建dockerFile一样,同样操作流程,新建自定义的dockerfile文件。

![](_page_60_Picture_28.jpeg)

```
• [root@abc dockerfile]# vim mydf1
    • [root@abc dockerfile]# cat mydf1
    FROM centos
    CMD ["ls","-a"]
    • [root@abc dockerfile]# docker build -f mydf1 -t mydf1 .
    Sending build context to Docker daemon 28.67kB
    Step 1/2 : FROM centos
       -> 5d0da3dc9764
    Step 2/2 : CMD ["ls","-a"]
       -> Running in 06bab16405d8
    Removing intermediate container 06bab16405d8
       -> 184d81c40f1b
    Successfully built 184d81c40f1b
    Successfully tagged mydf1:latest
    # 构建镜像成功后直接执行
    • [root@abc dockerfile]# docker run 184d81c40f1b
    .
     .
    .dockerenv
    bin
    dev
    etc
    home
    lib
    lib64
    lost+found
    media
    mnt
    opt
    proc
    root
    run
    sbin
    srv
    sys
    tmp
    usr
    var
    # 发现ls -a命令生效了
    • [root@abc dockerfile]# docker run 184d81c40f1b -l
    docker: Error response from daemon: failed to create shim task: OCI runtime
    create failed: runc create failed: unable to start container process: exec:
    "-l": executable file not found in $PATH: unknown.
    报错了,无法追加-l命令,用CMD情况下,-l替换了CMD命令,所以报错
    -l换成 ls -al才可以执行


FROM centos:7
    • ENTRYPOINT ["ls","-a"]
    • [root@abc dockerfile]# docker build -f mydf2 -t mydf2 .
    Sending build context to Docker daemon 42.5kB
    Step 1/2 : FROM centos:7
       -> eeb6ee3f44bd
    Step 2/2 : ENTRYPOINT ["ls","-a"]
       -> Running in 0684641436cf
    Removing intermediate container 0684641436cf
       -> 529e9267c719
    Successfully built 529e9267c719
    Successfully tagged mydf2:latest
    • [root@abc dockerfile]# docker run mydf2
    .
     .
    .dockerenv
    anaconda-post.log
    bin
    dev
    etc
    home
    lib
    lib64
    media
    mnt
    opt
    proc
    root
    run
    sbin
    srv
    sys
    tmp
    usr
    var
    • [root@abc dockerfile]# docker run mydf2 -l
    total 64
    drwxr-xr-x 1 root root 4096 May 27 07:43 .
    drwxr-xr-x 1 root root 4096 May 27 07:43 .
    -rwxr-xr-x 1 root root 0 May 27 07:43 .dockerenv
    -rw-r -r - 1 root root 12114 Nov 13 2020 anaconda-post.log
    lrwxrwxrwx 1 root root 7 Nov 13 2020 bin -> usr/bin
    drwxr-xr-x 5 root root 340 May 27 07:43 dev
    drwxr-xr-x 1 root root 4096 May 27 07:43 etc
    drwxr-xr-x 2 root root 4096 Apr 11 2018 home
    lrwxrwxrwx 1 root root 7 Nov 13 2020 lib -> usr/lib
    lrwxrwxrwx 1 root root 9 Nov 13 2020 lib64 -> usr/lib64
    drwxr-xr-x 2 root root 4096 Apr 11 2018 media
    drwxr-xr-x 2 root root 4096 Apr 11 2018 mnt
    drwxr-xr-x 2 root root 4096 Apr 11 2018 opt
    dr-xr-xr-x 94 root root 0 May 27 07:43 proc
    dr-xr-x - 2 root root 4096 Nov 13 2020 root
    drwxr-xr-x 11 root root 4096 Nov 13 2020 run
```

| 58 | lrwxrwxrwx                            | 1 root root |             | 8 Nov 13 |                    | 2020 sbin -> usr/sbin |
|----|---------------------------------------|-------------|-------------|----------|--------------------|-----------------------|
| 59 | drwxr-xr-x                            | 2 root root | 4096 Apr 11 |          | 2018 srv           |                       |
| 60 | dr-xr-xr-x 13 root root               |             |             |          | 0 May 26 02:23 sys |                       |
| 61 | drwxrwxrwt                            | 7 root root | 4096 Nov 13 |          | 2020 tmp           |                       |
| 62 | drwxr-xr-x 13 root root               |             | 4096 Nov 13 |          | 2020 usr           |                       |
| 63 | drwxr-xr-x 18 root root               |             | 4096 Nov 13 |          | 2020 var           |                       |
| 64 |                                       |             |             |          |                    |                       |
| 65 |                                       |             |             |          |                    |                       |
| 66 | 对比最后两次命令效果,就可以发现 ENTRYPOINT 不覆盖,CMD覆盖 |             |             |          |                    |                       |
| 67 |                                       |             |             |          |                    |                       |
| 68 |                                       |             |             |          |                    |                       |

# **7.5 实战 TomCat镜像**

要求:tomcat压缩包 , jdk的压缩包

### **7.5.1 准备 tomcat 与 jdk 安装包**

[root@abc:~/tomcat镜像]# ls apache-tomcat-9.0.8-fulldocs.tar.gz jdk-8u333-linux-x64.tar.gz 1 2

### **7.5.2 编写Dockerfile文件,这个名字官方默认名字,build时候会自动寻 找这个文件**

![](_page_63_Picture_6.jpeg)

```
ENV CATALINA_BASH /usr/local/apache-tomcat-9.0.8
    ENV PATH $PATH:$JAVA_HOME/bin:$CATALINA_HOME/lib:$CATALINA_HOME/bin
    # 暴露端口
    EXPOSE 8080
    CMD /usr/local/apache-tomcat-9.0.8/bin/startup.sh & tail -F
    /usr/local/apache-tomcat-9.0.8/bin/logs/catalina.out
    --------------------------------------------------------------------------
    -
    • [root@abc:~/tomcat镜像]# ll
    total 145564
    -rw-r -r - 1 root root 1048576 Jun 5 16:53 apache-tomcat-9.0.8-
    fulldocs.tar.gz
    -rw-r -r - 1 root root 637 Jun 5 17:13 Dockerfile
    -rw-r -r - 1 root root 148003421 Jun 5 16:56 jdk-8u333-linux-x64.tar.gz
    -rw-r -r - 1 root root 0 Jun 5 16:58 readme.txt
```
### **7.5.3 构建镜像**

1 docker build -t diytomcat .

### **7.5.4 启动镜像**

| 1  | [root@abc:~/mytomcatimage]# docker images                                   |               |                        |                   |        |  |  |  |
|----|-----------------------------------------------------------------------------|---------------|------------------------|-------------------|--------|--|--|--|
| 2  | REPOSITORY                                                                  | TAG           | IMAGE ID               | CREATED           | SIZE   |  |  |  |
| 3  | diytomcat                                                                   | latest        | ce1984715920           | 6 minutes ago     | 859MB  |  |  |  |
| 4  | <none></none>                                                               | <none></none> | 96e677b452df           | 19 minutes ago    | 660MB  |  |  |  |
| 5  | tomcat04                                                                    | latest        | c03fb94df78b           | About an hour ago | 684MB  |  |  |  |
| 6  | tomcat_image_01                                                             | latest        | ab3d09873dfe           | 6 days ago        | 684MB  |  |  |  |
| 7  | grafana/grafana-oss                                                         | 8.3.5         | 12ec1c89101f           | 4 months ago      | 274MB  |  |  |  |
| 8  | nginx                                                                       | latest        | 605c77e624dd           | 5 months ago      | 141MB  |  |  |  |
| 9  | tomcat                                                                      | 9.0           | b8e65a4d736d           | 5 months ago      | 680MB  |  |  |  |
| 10 | tomcat                                                                      | latest        | fb5657adc892           | 5 months ago      | 680MB  |  |  |  |
| 11 | redis                                                                       | latest        | 7614ae9453d1           | 5 months ago      | 113MB  |  |  |  |
| 12 | mysql                                                                       | 5.7           | c20987f18b13           | 5 months ago      | 448MB  |  |  |  |
| 13 | mysql                                                                       | latest        | 3218b38490ce           | 5 months ago      | 516MB  |  |  |  |
| 14 | hello-world                                                                 | latest        | feb5d9fea6a5           | 8 months ago      | 13.3kB |  |  |  |
| 15 | centos                                                                      | 7             | eeb6ee3f44bd           | 8 months ago      | 204MB  |  |  |  |
| 16 | centos                                                                      | 8             | 5d0da3dc9764           | 8 months ago      | 231MB  |  |  |  |
| 17 | centos                                                                      | latest        | 5d0da3dc9764           | 8 months ago      | 231MB  |  |  |  |
| 18 | • docker run -d -p 9090:8080                                                |               | -name diytomcat0605 -v |                   |        |  |  |  |
|    | /home/eric/build/tomcat/test:/usr/local/apache-tomcat-9.0.8/webapps/test -v |               |                        |                   |        |  |  |  |
|    | /home/eric/build/tomcat/tomcatlogs/:/usr/local/apache-tomcat-9.0.8/logs     |               |                        |                   |        |  |  |  |
|    | diytomcat                                                                   |               |                        |                   |        |  |  |  |
| 19 |                                                                             |               |                        |                   |        |  |  |  |
| 20 | ----------------                                                            |               |                        |                   |        |  |  |  |
| 21 | # 解释,第一个挂载是将webapps下的test映射到本地tomcat下的test                                  |               |                        |                   |        |  |  |  |
| 22 | -v /home/eric/build/tomcat/test:/usr/local/apache-tomcat-9.0.8/webapps/test |               |                        |                   |        |  |  |  |

![](_page_65_Picture_0.jpeg)

#### 挂载成功

| hello-world                                                                          | latest | feb5d9fea6a5 | 8 months ago | 13.3kB |                                                                                                 |  |  |
|--------------------------------------------------------------------------------------|--------|--------------|--------------|--------|-------------------------------------------------------------------------------------------------|--|--|
| centos                                                                               | 7      | eeb6ee3f44bd | 8 months ago | 204MB  |                                                                                                 |  |  |
| centos                                                                               | 8      | 5d0da3dc9764 | 8 months ago | 231MB  |                                                                                                 |  |  |
| centos                                                                               | latest | 5d0da3dc9764 | 8 months ago | 231MB  |                                                                                                 |  |  |
|                                                                                      |        |              |              |        | [rot(abc:~/mytomatimage]# docker run -d -p 9090:8080 --name dytomcat0605 -v /home/eric/burlocal |  |  |
|                                                                                      |        |              |              |        | /apache-tomcat-9.8/webapps/test -v /home/eric/build/tomcat/tomcat/oncat-9.0.8/logs-divioncat    |  |  |
| c5855d8757b3e100ace6ef0dcfc853599ae77a2c2766c80f03c462e53fbedb0d                     |        |              |              |        |                                                                                                 |  |  |
| [root@abc:~/mytomcatimage]# ls                                                       |        |              |              |        |                                                                                                 |  |  |
| apache-tomcat-9.0.8-fulldocs.tar.qz Dockerfile jdk-8u333-linux-x64.tar.qz readme.txt |        |              |              |        |                                                                                                 |  |  |
| [root@abc:~/mytomcatimage]# cd /home                                                 |        |              |              |        |                                                                                                 |  |  |
| [root@abc:/home]# cd eric                                                            |        |              |              |        |                                                                                                 |  |  |
| [root@abc:/home/eric]# ls                                                            |        |              |              |        |                                                                                                 |  |  |
| build                                                                                |        |              |              |        |                                                                                                 |  |  |
| [root@abc:/home/eric]# cd build                                                      |        |              |              |        |                                                                                                 |  |  |
| [root@abc:/home/eric/build]# ls                                                      |        |              |              |        |                                                                                                 |  |  |
| tomcat                                                                               |        |              |              |        |                                                                                                 |  |  |
| [root@abc:/home/eric/build]# cd tomcat                                               |        |              |              |        |                                                                                                 |  |  |
| [root@abc:/home/eric/build/tomcat]# ls                                               |        |              |              |        |                                                                                                 |  |  |
| test tomcatlogs                                                                      |        |              |              |        |                                                                                                 |  |  |
| [root@abc:/home/eric/build/tomcat]#                                                  |        |              |              |        |                                                                                                 |  |  |
|                                                                                      |        |              |              |        |                                                                                                 |  |  |

| [root@abc.~/@ytomatimage/#docker run -d -p 9090:3080 -> /home/erc/buld/tomat/test/usr/loc<br>al/apache-tomat-9.0.8/webapps/test -v /home/erc/build/tomcat/tomcal/apache-tomcat-9.0.8/logs divtomc<br>at<br>c097506fcfcc5d5b7fb13c4be7dd09ead49c635e1a9f524c6e45597ea348ad49 |                                                                                   |                                                                                                                                                                                                                                |                        |              |                                       |  |           |  |  |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------|--------------|---------------------------------------|--|-----------|--|--|
| [root@abc:~/mytomcatimage]# docker ps<br>CONTAINER ID   IMAGE<br>NAMES                                                                                                                                                                                                      | COMMAND                                                                           | CREATED                                                                                                                                                                                                                        | STATUS                 |              | PORTS                                 |  |           |  |  |
| c097506fcfcc   diytomcat   "/bin/sh -c '/usr/lo…"   3 seconds ago<br>diytomcat060501<br>80/tcp<br>[root@abc:~/mytomcatimage]# curl localhost:9090                                                                                                                           |                                                                                   |                                                                                                                                                                                                                                |                        | Up 2 seconds | 0.0.0.0:9090->8080/tcp, :::9090->80   |  |           |  |  |
| ∨           Docker惠础笔记 (狂神说) 这个 ×                                                                                                                                                                                                                                           | Apache Tomcat/9.0.8<br>×                                                          | 〔-〕 云服务器管理控制台                                                                                                                                                                                                                  | × +                    |              |                                       |  | D<br>×    |  |  |
| ← → C<br>▲ 不安全   182.92.185.165:9090                                                                                                                                                                                                                                        |                                                                                   |                                                                                                                                                                                                                                |                        |              |                                       |  | * □ (x) : |  |  |
|                                                                                                                                                                                                                                                                             |                                                                                   |                                                                                                                                                                                                                                |                        |              | Find Help                             |  |           |  |  |
|                                                                                                                                                                                                                                                                             | Apache Tomcat/9.0.8                                                               |                                                                                                                                                                                                                                |                        |              |                                       |  |           |  |  |
|                                                                                                                                                                                                                                                                             | Developer Quick Start<br>Managing Tomcat<br>For security, access to the manager w | If you're seeing this, you've successfully installed Tomcat. Congratulations!<br>Recommended Reading<br>Security Considerations HOW-TO<br>Manager Application HOW-TC<br>Clustering/Session Replication HOW-TO<br>Documentation |                        |              | Getting Help<br>FAQ and Mailing Lists |  |           |  |  |
|                                                                                                                                                                                                                                                                             | restricted. Ilsers are defined it                                                 |                                                                                                                                                                                                                                | Tomcat 9.0 Configurati |              |                                       |  |           |  |  |
|                                                                                                                                                                                                                                                                             | into MADOO 2020 Amages Callunen Easyndelian, All Divisha Da                       |                                                                                                                                                                                                                                |                        |              |                                       |  |           |  |  |

### **7.5.5 发布项目**

(由于做了**卷挂载**,我们直接在本地编写项目就可以发布了)

| 1 | # 首先进入主机同步的那个文件夹                                      |
|---|-------------------------------------------------------|
| 2 | # 在本地tomcat/test文件夹下创建WEB-INF文件夹,在WEB-INF下编写web.xml文, |
| 3 | # 在/test 下编写index.jsp文件,                              |
| 4 | # 再访问http: /192.168.58.129:9090/test/                 |
| 5 | • [root@abc:/home/eric/build/tomcat/test]# pwd        |
|   |                                                       |

