# PrettyErrors
代码量很大时，异常输出通常会占满整个屏幕，让定位错误变得更加困难。但是，不要抓狂！有一种简单的方法可以让你告别杂乱的Python错误输出，只需一行代码就可以让bug更加清晰易懂
## 安装PrettyErrors
```shell
python -m pip install pretty_errors
```
## PrettyErrors的使用
**Input**
```python
import pretty_errors

def func():
    print(1/0)
func()
```
**Output**
```python
common.py 63 <module>
func()

common.py 62 func
print(1/0)

ZeroDivisionError:
division by zero
```
