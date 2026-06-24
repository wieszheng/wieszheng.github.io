---
title: LLM 评测体系详解
description: 详细介绍 LLM 的评测维度、评测方法和评测工具，涵盖准确性、安全性、相关性等多维度评测体系
---

# LLM 评测体系详解

> LLM（大语言模型）评测是 AI 测试的核心内容之一。本文档详细介绍 LLM 的评测维度、评测方法和评测工具。

---

## 一、为什么需要评测 LLM？

### LLM 的特殊性

与传统的软件测试不同，LLM 的输出具有：

- **不确定性**：同样的输入可能产生不同的输出
- **开放性**：输出内容没有固定格式
- **主观性**：好坏评判有时依赖主观判断
- **上下文依赖**：输出质量受上下文影响大

### 评测的意义

| 目的 | 说明 |
|------|------|
| 模型选型 | 对比不同模型，选择最适合业务场景的 |
| 效果验证 | 验证模型是否满足业务需求 |
| 问题定位 | 找出模型的弱点和不足 |
| 持续优化 | 为 prompt 优化、模型微调提供依据 |
| 质量保障 | 建立质量基线，监控质量变化 |

---

## 二、评测维度

### 能力维度

#### 通用能力

| 能力 | 说明 | 测试方法 |
|------|------|----------|
| 语言理解 | 理解文本含义、推理关系 | 阅读理解、逻辑推理题 |
| 语言生成 | 生成流畅、连贯的文本 | 文本生成、续写 |
| 知识问答 | 回答各类知识性问题 | QA 数据集 |
| 数学推理 | 数学计算和逻辑推理 | 数学题、逻辑题 |
| 代码能力 | 编写、理解、调试代码 | 编程题 |
| 多语言 | 多语言理解与生成 | 翻译、多语言 QA |

### 质量维度

#### 准确性（Accuracy）

输出内容是否正确、符合事实：

```python
def evaluate_accuracy(response, ground_truth):
    """评估准确性"""
    # 方法1：精确匹配
    exact_match = response.strip().lower() == ground_truth.strip().lower()

    # 方法2：包含关系
    contains = ground_truth.lower() in response.lower()

    # 方法3：语义相似度
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer('all-MiniLM-L6-v2')
    emb1, emb2 = model.encode(response), model.encode(ground_truth)
    similarity = cosine_similarity([emb1], [emb2])[0][0]

    return {"exact_match": exact_match, "contains": contains, "semantic_similarity": similarity}
```

#### 相关性（Relevance）

输出是否与输入问题相关：

```python
def evaluate_relevance(question, response):
    """评估相关性"""
    question_keywords = extract_keywords(question)
    response_lower = response.lower()
    keyword_coverage = sum(1 for kw in question_keywords if kw.lower() in response_lower)
    coverage_rate = keyword_coverage / len(question_keywords) if question_keywords else 0

    # 使用 LLM 评估相关性
    prompt = f"""
问题：{question}
回答：{response}
这个回答是否与问题相关？请评分 1-5 分（1=完全不相关，5=高度相关），只返回分数。
"""
    llm_score = llm.generate(prompt)
    return {"keyword_coverage": coverage_rate, "llm_relevance_score": float(llm_score)}
```

#### 完整性（Completeness）

输出是否覆盖了所有需要的信息：

```python
def evaluate_completeness(response, expected_points):
    """评估完整性"""
    covered_points = [p for p in expected_points if is_point_covered(p, response)]
    uncovered_points = [p for p in expected_points if p not in covered_points]
    coverage_rate = len(covered_points) / len(expected_points) if expected_points else 0
    return {"coverage_rate": coverage_rate, "covered_points": covered_points}
```

#### 流畅性（Fluency）

输出语言是否自然流畅：

```python
def evaluate_fluency(response):
    """评估流畅性 - 使用困惑度和语法检查"""
    from transformers import GPT2LMHeadModel, GPT2Tokenizer
    model = GPT2LMHeadModel.from_pretrained('gpt2')
    tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
    inputs = tokenizer(response, return_tensors='pt')
    outputs = model(**inputs, labels=inputs['input_ids'])
    perplexity = torch.exp(outputs.loss).item()
    return {"perplexity": perplexity}  # 越低越好
```

### 安全维度

#### 幻觉（Hallucination）

模型生成虚假或错误的信息：

| 类型 | 说明 | 示例 |
|------|------|------|
| 事实性幻觉 | 编造不存在的事实 | "爱因斯坦发明了电话" |
| 引用幻觉 | 虚构来源或引用 | "根据《自然》杂志2024年的研究..." |
| 细节幻觉 | 添加不存在的细节 | "会议于2024年3月15日下午2点在..." |

```python
def detect_hallucination(response, context=None):
    """检测幻觉"""
    statements = extract_factual_statements(response)
    hallucinations = []
    for statement in statements:
        if context and not is_supported_by_context(statement, context):
            hallucinations.append({"statement": statement, "type": "unsupported_by_context"})
    return {
        "hallucination_count": len(hallucinations),
        "hallucination_rate": len(hallucinations) / len(statements) if statements else 0
    }
```

---

## 三、评测方法

### 自动评测

#### 基于规则的评测

```python
class RuleBasedEvaluator:
    """基于规则的评测器"""
    def __init__(self, rules):
        self.rules = rules

    def evaluate(self, question, response, reference=None):
        results = {}
        for rule_name, rule in self.rules.items():
            if rule["type"] == "contains":
                results[rule_name] = rule["value"] in response
            elif rule["type"] == "not_contains":
                results[rule_name] = rule["value"] not in response
            elif rule["type"] == "regex":
                results[rule_name] = bool(re.search(rule["pattern"], response))
            elif rule["type"] == "length":
                results[rule_name] = eval(f"len(response) {rule['operator']} {rule['value']}")
        return results
```

#### 基于模型的评测（LLM-as-Judge）

```python
class ModelBasedEvaluator:
    """基于模型的评测器"""
    def evaluate(self, question, response, criteria):
        prompt = f"""
你是一个专业的评估专家。请评估以下回答的质量。

问题：{question}
回答：{response}

请从以下维度评分（1-5分）：
{json.dumps(criteria, ensure_ascii=False, indent=2)}

请以 JSON 格式返回评分结果。
"""
        evaluation = self.model.generate(prompt)
        return json.loads(evaluation)
```

#### NLP 指标评测

```python
from rouge import Rouge
from nltk.translate.bleu_score import sentence_bleu
from bert_score import score

class NLPMetricEvaluator:
    def evaluate(self, response, reference):
        results = {}
        # BLEU Score
        results["bleu"] = sentence_bleu([reference.split()], response.split())
        # ROUGE Score
        rouge = Rouge()
        rouge_scores = rouge.get_scores(response, reference)[0]
        results["rouge-1"] = rouge_scores["rouge-1"]["f"]
        results["rouge-l"] = rouge_scores["rouge-l"]["f"]
        # BERT Score
        P, R, F1 = score([response], [reference], lang="zh")
        results["bert_score_f1"] = F1.item()
        return results
```

### 人工评测

#### 评测流程

```
准备评测集 → 分配任务 → 人员标注 → 质量检查 → 统计分析 → 输出报告
```

#### 评分标准示例

| 分数 | 准确性标准 | 相关性标准 |
|------|-----------|-----------|
| 5分 | 完全正确，无事实错误 | 完全切题，内容高度相关 |
| 4分 | 基本正确，有轻微瑕疵 | 基本切题，有少量偏离 |
| 3分 | 部分正确，有明显不足 | 部分相关，有较大偏离 |
| 2分 | 错误较多 | 关联性弱 |
| 1分 | 完全错误或无关 | 完全不相关 |

#### 一致性检验

```python
from sklearn.metrics import cohen_kappa_score

def calculate_inter_rater_reliability(annotations):
    """计算标注者间一致性"""
    kappa = cohen_kappa_score(annotations[0], annotations[1])
    correlation = np.corrcoef(annotations[0], annotations[1])[0, 1]
    return {"cohens_kappa": kappa, "pearson_correlation": correlation}
```

---

## 四、评测工具对比

| 工具 | 说明 | 适用场景 |
|------|------|----------|
| **Ragas** | RAG 评测框架 | RAG 应用评测 |
| **TruLens** | LLM 应用评测 | 全面的应用评测 |
| **DeepEval** | 单元测试风格评测 | 集成到测试流程 |
| **Promptfoo** | Prompt 测试 | Prompt 优化 |
| **LangSmith** | LangChain 官方平台 | LangChain 应用 |
| **HELM** | 斯坦福基准 | 模型对比研究 |

### Ragas 使用示例

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_recall, context_precision
from datasets import Dataset

result = evaluate(
    dataset,
    metrics=[faithfulness, answer_relevancy, context_recall, context_precision]
)
print(result)
```

### DeepEval 使用示例

```python
from deepeval import assert_test
from deepeval.metrics import AnswerRelevancyMetric, FaithfulnessMetric
from deepeval.test_case import LLMTestCase

def test_llm_response():
    test_case = LLMTestCase(
        input="什么是机器学习？",
        actual_output="机器学习是人工智能的一个分支...",
        expected_output="机器学习是让计算机从数据中学习的技术",
        retrieval_context=["机器学习是人工智能的核心..."]
    )
    assert_test(test_case, [
        AnswerRelevancyMetric(threshold=0.7),
        FaithfulnessMetric(threshold=0.7)
    ])
```

---

## 五、评测最佳实践

### 评测数据集构建

```python
class EvalDatasetBuilder:
    """评测数据集构建器"""
    def __init__(self):
        self.cases = []

    def add_case(self, question, ground_truth=None, difficulty="medium", tags=None):
        self.cases.append({
            "id": f"case_{len(self.cases) + 1}",
            "question": question, "ground_truth": ground_truth,
            "difficulty": difficulty, "tags": tags or []
        })

    def split(self, ratios=[0.7, 0.15, 0.15]):
        """划分训练/验证/测试集"""
        import random
        random.shuffle(self.cases)
        total = len(self.cases)
        return {
            "train": self.cases[:int(total * ratios[0])],
            "val": self.cases[int(total * ratios[0]):int(total * (ratios[0] + ratios[1]))],
            "test": self.cases[int(total * (ratios[0] + ratios[1])):]
        }
```

### 评测报告模板

| 指标 | 得分 | 目标 | 状态 |
|------|------|------|------|
| 准确性 | 0.85 | 0.80 | ✅ 达标 |
| 相关性 | 0.92 | 0.85 | ✅ 达标 |
| 完整性 | 0.78 | 0.80 | ❌ 未达标 |
| 流畅性 | 0.95 | 0.90 | ✅ 达标 |

### 持续评测流水线

```yaml
# .github/workflows/llm-eval.yml
name: LLM Evaluation
on:
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨2点
jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run evaluation
        run: python scripts/run_evaluation.py
      - name: Check quality gate
        run: python scripts/check_quality_gate.py --threshold accuracy:0.8
```

---

*文档持续更新中...*
