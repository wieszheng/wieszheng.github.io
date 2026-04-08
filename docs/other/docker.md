# Docker 容器

### 1. **镜像命令**

```sh
docker images                       # 列出本地所有镜像。
docker build -t imageName:tag .     # 使用当前目录下的 Dockerfile 构建镜像，并指定名称和标签。
docker pull imageName:tag           # 从远程仓库拉取一个镜像。
docker push imageName:tag           # 将本地镜像推送到远程仓库。
docker rmi imageName:tag            # 删除指定的镜像。
docker inspect imageName            # 查看镜像或容器的详细信息。

```

### 2. **容器命令**
```sh
docker run -d --name containerName -p hostPort:containerPort imageName   # 运行一个新的容器，后台启动并映射端口。
docker ps                           # 列出正在运行的容器。
docker ps -a                        # 列出所有容器（包括已停止的）。
docker stop containerNameOrId       # 停止一个正在运行的容器。
docker start containerNameOrId      # 启动一个已停止的容器。
docker restart containerNameOrId    # 重启一个容器。
docker rm containerNameOrId         # 删除一个已停止的容器。
docker exec -it containerNameOrId bash   # 进入运行中的容器执行命令（如 bash shell）。
docker logs containerNameOrId       # 查看容器的日志输出。
```

### 3. **其他常用命令**
```sh
docker system prune                 # 清理未使用的镜像、容器、网络和构建缓存。
docker network ls                   # 列出所有网络。
docker volume ls                    # 列出所有数据卷。
docker info                         # 显示 Docker 系统范围的信息。
docker version                      # 显示 Docker 的版本信息。
```