# Schedule
实现定时任务
## 安装Schedule
```shell
pip install schedule
```
## Schedule的使用
```python
import schedule
from datetime import datetime
 
def task1(name):
    dosomething(name)
 
def task2(name):
    dosomething(name)

# 清空任务
schedule.clear()
# =============按时间间隔执行任务=========================
# 创建一个按3秒间隔执行任务
schedule.every(3).seconds.do(task1,name)
# 创建一个按2秒间隔执行任务
schedule.every(2).seconds.do(task2,name)

# =============运行任务到某时间为止=========================
schedule.every().second.until('23:59').do(task1,name)  
schedule.every().second.until('2023-07-17 00:00').do(task1,name) 
schedule.every().second.until(timedelta(hours=2)).do(task1,name)  
schedule.every().second.until(time(23, 59, 59)).do(task2,name)  
schedule.every().second.until(datetime(2030, 1, 1, 18, 30, 0)).do(task2,name)  
# =============到点执行任务===============================
schedule.every().wednesday.at("13:15").do(task1, name)

while True:
    schedule.run_pending()
```
## Schedule装饰器实现方式
```python
from datetime import datetime
from schedule import every, repeat, run_pending
 
 
@repeat(every(3).seconds, 'yjx')
def task1(name):
    print(name)
 
 
@repeat(every(5).seconds, '123')
def task2(name):
    print(name)
 
 
while True:
    run_pending()
```
## 多任务线程处理
```python
import threading
import time
import schedule
 
 
def task1(name):
    print(name)
 
def task2(name):
    print(name)
 
def run_threaded(job_func,arg):
    job_thread = threading.Thread(target=job_func,args = (arg,))
    job_thread.start()
 
 
schedule.every(3).seconds.do(task1, "yjx")
schedule.every(3).seconds.do(task2, "123")

while True:
    schedule.run_pending()
    time.sleep(1)
```