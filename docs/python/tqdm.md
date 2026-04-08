# tqdm

`tqdm` 是一个快速，可扩展的Python进度条库，它可以轻松的在终端和 `notebook` 中显示进度条。

---

### 1. **安装 `tqdm`**

```bash
pip install tqdm
```

---

### 2. **基本用法**

```python
from tqdm import tqdm, trange
import time

for i in tqdm(range(100)):
    time.sleep(.01)
```

---

### 3. **参数介绍**

- `iterable`: 可迭代对象。
- `total`: 刻度总大小。
- `desc`: 进度条标题。
- `unit`: 进度条单位。
- `colour`: 进度条的颜色。
- `delay`: 进度条出现的延迟时间。

---

### 4. **官方文档**

> Pypi Reference: [tqdm](https://pypi.org/project/tqdm/)
>
> Official Reference：[tqdm](https://tqdm.github.io/)