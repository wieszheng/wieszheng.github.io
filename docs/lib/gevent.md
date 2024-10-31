# Gevent
gevent 是一个针对 Python 的并发编程库，它在 Python 2 和 Python 3 上都可用，但请注意，Python 2 已于 2020 年停止官方支持。
gevent 基于 libev 或 libuv 这样的高性能事件循环库，提供了一个高级的 API 来实现协程（coroutines）和异步操作，
使得编写高并发的网络应用变得简单且直观。主要特点包括


1. 协程: gevent 允许你使用简单的语法来编写并发代码，看起来就像是普通的同步代码，但实际上是在后台进行非阻塞的异步执行。这得益于其对 Python 标准库中的某些阻塞操作进行了猴子补丁（monkey patching），例如 socket、os、select 等模块，使得它们变成非阻塞的
2. 轻量级线程（Greenlets）: gevent 基于 greenlet 库，greenlet 是一个轻量级的协程实现。与操作系统级别的线程相比，greenlets 更加轻量、创建和切换开销更低，特别适合处理大量并发连接。
3. 高性能网络 IO: gevent 提供了高性能的网络 I/O 操作，如基于协程的网络服务器和客户端，可以轻松处理数万个并发连接，适用于构建高并发的 Web 服务器、爬虫、聊天服务器等应用
4. 简单易用: 相比于更底层的 asyncio 库或其他事件驱动框架，gevent 提供的 API 更接近于同步编程模型，使得开发者无需深入了解复杂的异步编程概念就能编写出高性能的异步代码。
5. 集成第三方库: gevent 社区提供了对许多流行 Python 库的封装，如请求库（requests）、SQLAlchemy 等，使其能够与 gevent 的协程模型无缝协作。


## 安装 gevent
```shell
python2 -m pip install gevent

# linux中python2安装错误缺少头文件及gcc环境

sudo yum install epel-release
sudo yum install python2-devel
sudo yum update

```

## gevent的使用
**Input**
```python
import gevent
from gevent import monkey

# 在程序开始时，修补标准库，使gevent工作正常
monkey.patch_all()


# 定义一个模拟网络请求的函数
def simulate_network_request(url):
    print(f"开始请求 {url}...")
    gevent.sleep(1)  # 模拟延迟，gevent.sleep不会让出控制权
    print(f"{url} 请求完成")


# 创建一个任务列表
urls = ['https://example.com', 'https://google.com', 'https://github.com']

# 使用gevent.spawn创建协程，并将它们添加到列表
jobs = [gevent.spawn(simulate_network_request, url) for url in urls]

# 使用gevent.joinall等待所有协程完成
gevent.joinall(jobs)

print("所有请求已完成")
```