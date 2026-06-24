---
title: Prompt Engineering 入门指南
description: Prompt Engineering（提示词工程）是与大语言模型有效沟通的核心技能，涵盖设计原则、常用技巧和最佳实践
---

# Prompt Engineering 入门指南

> Prompt Engineering（提示词工程）是与大语言模型有效沟通的核心技能。本文档介绍 Prompt 设计的原则、技巧和最佳实践。

---

## 一、什么是 Prompt Engineering？

### 定义

Prompt Engineering 是设计和优化输入给 LLM 的文本（Prompt），以获得更准确、更符合预期输出的技术。

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Prompt    │ →  │     LLM     │ →  │   Output    │
│  (输入文本)  │     │  (大语言模型) │     │  (输出结果)  │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 为什么重要？

| 原因 | 说明 |
|------|------|
| 影响输出质量 | 同样的模型，不同的 Prompt 产生截然不同的结果 |
| 控制输出格式 | 通过 Prompt 可以指定输出的格式和结构 |
| 降低成本 | 好的 Prompt 减少重试次数，节省 Token 消耗 |
| 发挥模型潜力 | 合理的 Prompt 能让模型展现出更强的能力 |

---

## 二、Prompt 设计原则

### 核心原则

#### 1. 清晰明确（Clarity）

::: code-group
``` [❌ 差的 Prompt]
写一篇关于 AI 的文章
```

``` [✅ 好的 Prompt]
写一篇 500 字的文章，主题是 AI 在医疗领域的应用，
目标读者是普通大众，语言要通俗易懂，包含至少两个具体案例
```
:::

#### 2. 提供上下文（Context）

::: code-group
``` [❌ 差的 Prompt]
翻译这句话
```

``` [✅ 好的 Prompt]
你是一名专业的法律翻译。请将以下法律条款从中文翻译成英文，
保持法律术语的准确性：

待翻译文本：当事人应当遵循诚实信用原则。
```
:::

#### 3. 指定角色（Role）

::: code-group
``` [❌ 差的 Prompt]
解释什么是机器学习
```

``` [✅ 好的 Prompt]
你是一名资深的机器学习工程师，正在向非技术人员解释什么是机器学习。
请用通俗易懂的比喻来解释，避免使用专业术语。
```
:::

#### 4. 给出示例（Examples）

通过示例引导期望的输出格式：

```
请按照以下格式提取文本中的信息：

示例：
文本：张三，男，28岁，软件工程师，住在北京
输出：{"name": "张三", "gender": "男", "age": 28, "job": "软件工程师", "city": "北京"}

请处理：
文本：李四，女，32岁，产品经理，住在上海
输出：
```

#### 5. 分步引导（Steps）

将复杂任务分解为多个步骤：

```
请按以下步骤分析这篇文章：

1. 首先，总结文章的主要内容（不超过100字）
2. 然后，列出文章中的三个核心观点
3. 接着，找出文章中的论据和数据
4. 最后，给出你的评价和建议

文章：
[文章内容]
```

### Prompt 结构模板

```
┌──────────────────────────────────────────────────────┐
│                  Prompt 结构                          │
├──────────────────────────────────────────────────────┤
│  1. 角色设定 (Role)        "你是一名专业的..."         │
│  2. 任务描述 (Task)        "请帮我完成以下任务..."     │
│  3. 上下文信息 (Context)   "背景信息：..."             │
│  4. 输入数据 (Input)       "待处理内容：..."           │
│  5. 输出要求 (Output)       "请按以下格式输出：..."     │
│  6. 示例 (Examples) [可选]  "示例：..."                │
│  7. 约束条件 (Constraints)  "注意：不要..."            │
└──────────────────────────────────────────────────────┘
```

---

## 三、常用技巧

### Few-Shot Prompting

在 Prompt 中提供少量示例，引导模型输出。适用于格式转换、分类任务、信息提取。

```python
prompt = """
任务：将产品描述转换为结构化数据

示例1：
输入：这款手机配备6.5英寸屏幕，128GB存储，售价2999元
输出：{"screen": "6.5英寸", "storage": "128GB", "price": "2999元"}

示例2：
输入：笔记本电脑，14英寸2K屏，16GB内存，512GB固态硬盘
输出：{"screen": "14英寸2K", "memory": "16GB", "storage": "512GB SSD"}

请处理：
输入：这款平板采用10.9英寸全面屏，64GB存储空间，支持WiFi6
输出："""
```

### Chain-of-Thought (CoT)

引导模型逐步思考，展示推理过程。适用于数学推理、逻辑问题、复杂决策。

```
请一步步思考并回答以下问题：

问题：小明有 5 个苹果，他给了小红 2 个，又买了 3 个，请问小明现在有多少个苹果？

让我们一步步思考：
1. 小明最初有多少个苹果？答：5个
2. 给了小红多少个？答：2个
3. 给完小红后还剩多少个？答：5 - 2 = 3个
4. 又买了多少个？答：3个
5. 现在总共有多少个？答：3 + 3 = 6个

答案：小明现在有 6 个苹果。
```

### Self-Consistency

生成多个推理路径，选择最一致的答案：

```python
def self_consistency(prompt, n=5):
    """自洽性方法"""
    responses = []
    for _ in range(n):
        response = llm.generate(prompt, temperature=0.7)
        responses.append(extract_answer(response))

    from collections import Counter
    answer_counts = Counter(responses)
    most_common = answer_counts.most_common(1)[0]

    return {
        "answer": most_common[0],
        "confidence": most_common[1] / n,
        "all_answers": responses
    }
```

### ReAct (Reasoning + Acting)

结合推理和行动的 Prompt 模式：

```
你是一个智能助手，能够通过思考和行动来解决问题。

你可以使用以下工具：
- search(query): 搜索信息
- calculator(expression): 计算数学表达式
- weather(city): 查询天气

按照以下格式回答：
思考：我需要做什么
行动：[工具名称]
行动输入：[工具参数]
观察：[工具返回结果]
...（重复直到解决问题）
思考：我现在知道最终答案了
最终答案：[答案]
```

---

## 四、Prompt 优化方法

### 迭代优化流程

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│ 设计初版 │ → │ 测试运行 │ → │ 分析结果 │
│  Prompt  │    └──────────┘    └────┬─────┘
└──────────┘                        │
                              ┌─────┴─────┐
                              ↓           ↓
                         效果不好    效果很好
                              │           │
                              ↓           ↓
                       ┌──────────┐  ┌──────────┐
                       │ 调整优化  │  │ 固化版本 │
                       │  Prompt  │  │  完成优化 │
                       └──────────┘  └──────────┘
```

### 问题诊断方法

```python
def diagnose_prompt(prompt, test_cases, expected_outputs):
    """诊断 Prompt 问题"""
    results = {"total": len(test_cases), "correct": 0, "errors": []}

    for tc, expected in zip(test_cases, expected_outputs):
        response = llm.generate(prompt.format(input=tc))
        if is_correct(response, expected):
            results["correct"] += 1
        else:
            error_type = classify_error(response, expected)
            results["errors"].append({
                "input": tc, "expected": expected,
                "actual": response, "error_type": error_type
            })

    results["accuracy"] = results["correct"] / results["total"]
    return results
```

### A/B 测试

```python
def ab_test_prompt(prompt_a, prompt_b, test_cases, sample_size=100):
    """A/B 测试两个 Prompt"""
    group_a = random.sample(test_cases, sample_size // 2)
    group_b = [tc for tc in test_cases if tc not in group_a][:sample_size // 2]

    results_a = [evaluate_response(llm.generate(prompt_a.format(input=tc)), tc) for tc in group_a]
    results_b = [evaluate_response(llm.generate(prompt_b.format(input=tc)), tc) for tc in group_b]

    return {
        "prompt_a_avg": sum(results_a) / len(results_a),
        "prompt_b_avg": sum(results_b) / len(results_b),
        "winner": "A" if sum(results_a) > sum(results_b) else "B"
    }
```

---

## 五、高级技巧

### Prompt 模板管理

```python
from string import Template

class PromptTemplate:
    """Prompt 模板管理器"""
    def __init__(self, template_str):
        self.template = Template(template_str)

    def fill(self, **kwargs):
        return self.template.safe_substitute(**kwargs)

TEMPLATES = {
    "summarize": PromptTemplate("""
请总结以下文章的主要内容。
要求：字数控制在 ${max_words} 字以内，使用 ${style} 风格。
文章：${article}
总结：
"""),
    "classify": PromptTemplate("""
请将以下文本分类到正确的类别。
类别选项：${categories}
文本：${text}
类别：
""")
}
```

### 动态 Prompt

```python
class DynamicPrompt:
    """动态 Prompt 生成 - 根据输入选择最相似的示例"""
    def __init__(self, base_prompt):
        self.base_prompt = base_prompt
        self.examples = []

    def add_example(self, input_text, output_text):
        self.examples.append({"input": input_text, "output": output_text})

    def generate(self, current_input, max_examples=3):
        similar_examples = self._find_similar_examples(current_input, max_examples)
        prompt = self.base_prompt + "\n\n"
        for ex in similar_examples:
            prompt += f"示例：\n输入：{ex['input']}\n输出：{ex['output']}\n\n"
        prompt += f"请处理：\n输入：{current_input}\n输出："
        return prompt
```

---

## 六、测试与调试

### Prompt 测试框架

```python
import pytest

class TestPrompt:
    @pytest.fixture
    def prompt_template(self):
        return """
请分析以下产品评价的情感倾向。
评价：{review}
情感：正面/负面/中性
置信度：1-5分
理由：简要说明
"""

    def test_positive_review(self, prompt_template):
        prompt = prompt_template.format(review="这款产品非常好用，强烈推荐！")
        response = llm.generate(prompt)
        assert "正面" in response

    def test_negative_review(self, prompt_template):
        prompt = prompt_template.format(review="质量太差了，用了两天就坏了")
        response = llm.generate(prompt)
        assert "负面" in response
```

---

## 七、最佳实践清单

### 设计清单

- [ ] Prompt 是否清晰明确，无歧义？
- [ ] 是否提供了足够的上下文？
- [ ] 是否指定了输出格式？
- [ ] 是否设定了角色？
- [ ] 是否提供了示例（如适用）？
- [ ] 是否设置了约束条件？
- [ ] 是否考虑了边界情况？

### 测试清单

- [ ] 是否测试了正面案例？
- [ ] 是否测试了负面案例？
- [ ] 是否测试了边界情况？
- [ ] 是否测试了异常输入？
- [ ] 是否验证了输出格式？

### 优化清单

- [ ] 是否分析失败案例？
- [ ] 是否识别了错误模式？
- [ ] 是否尝试了不同的表述？
- [ ] 是否进行了 A/B 测试？
- [ ] 是否记录了最优版本？

---

*文档持续更新中...*
