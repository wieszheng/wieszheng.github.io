---
title: RAG 测试详解
description: RAG（检索增强生成）的测试方法、评测指标和实战技巧，涵盖检索质量、生成质量和幻觉检测
---

# RAG 测试详解

> RAG（Retrieval-Augmented Generation，检索增强生成）是当前 AI 应用最主流的架构之一。本文档详细介绍 RAG 的测试方法、评测指标和实战技巧。

---

## 一、RAG 原理回顾

### 什么是 RAG？

RAG 将**信息检索**与**文本生成**结合：

```
用户提问 → 检索相关文档 → 将文档作为上下文 → LLM 生成回答
```

**为什么需要 RAG？**
- LLM 的知识有截止日期，无法获取最新信息
- LLM 可能产生幻觉，编造不存在的信息
- 企业有私有知识库，LLM 无法直接访问
- 通过 RAG 可以让 LLM 基于真实文档回答，减少幻觉

### RAG 架构组成

```
┌───────────────────────────────────────────────┐
│                RAG 系统架构                     │
├───────────────────────────────────────────────┤
│  ┌──────────┐   ┌──────────┐   ┌──────────┐  │
│  │  文档库  │ → │ 向量存储 │ → │  检索器  │  │
│  └──────────┘   └──────────┘   └──────────┘  │
│       ↑                             ↓         │
│  ┌──────────┐                 ┌──────────┐   │
│  │ 文档处理 │                 │ 重排序   │   │
│  │ 分块+向量│                 │ (可选)   │   │
│  └──────────┘                 └──────────┘   │
│                                    ↓         │
│  ┌──────────┐                 ┌──────────┐   │
│  │ 用户问题 │ ────────────→  │   LLM    │   │
│  └──────────┘                 │  生成器  │   │
│                               └──────────┘   │
│                                    ↓         │
│                               ┌──────────┐   │
│                               │   回答   │   │
│                               └──────────┘   │
└───────────────────────────────────────────────┘
```

---

## 二、RAG 测试维度

### 测试维度总览

| 维度 | 测试目标 | 关键指标 |
|------|----------|----------|
| 检索质量 | 能否找到正确的文档 | Recall@K, MRR, NDCG |
| 生成质量 | 回答是否准确、相关 | 准确率, 相关性, 完整性 |
| 幻觉检测 | 是否编造信息 | 幻觉率, 事实一致性 |
| 端到端性能 | 整体响应质量 | 延迟, 吞吐量, 用户满意度 |
| 鲁棒性 | 异常输入处理 | 错误恢复率, 降级策略 |

### 检索质量测试

#### 检索指标计算

```python
def calculate_retrieval_metrics(retrieved_docs, relevant_docs, k=5):
    """
    计算检索指标
    Args:
        retrieved_docs: 检索返回的文档列表
        relevant_docs: 实际相关的文档列表
        k: 考虑前 k 个结果
    """
    retrieved_set = set(retrieved_docs[:k])
    relevant_set = set(relevant_docs)

    # Precision@K: 前 K 个结果中相关的比例
    precision_k = len(retrieved_set & relevant_set) / k

    # Recall@K: 相关文档被检索到的比例
    recall_k = len(retrieved_set & relevant_set) / len(relevant_set) if relevant_set else 0

    # MRR (Mean Reciprocal Rank): 第一个相关文档的位置
    mrr = 0
    for i, doc in enumerate(retrieved_docs[:k]):
        if doc in relevant_set:
            mrr = 1 / (i + 1)
            break

    return {f"precision@{k}": precision_k, f"recall@{k}": recall_k, "mrr": mrr}
```

#### 测试场景设计

| 场景 | 测试内容 | 预期结果 |
|------|----------|----------|
| 精确匹配 | 问题包含文档中的关键词 | 检索到包含该关键词的文档 |
| 语义相似 | 问题与文档表述不同但语义相同 | 检索到语义相关的文档 |
| 多文档关联 | 问题需要多个文档才能回答 | 检索到所有相关文档 |
| 边界情况 | 问题模糊或歧义 | 返回最可能相关的文档 |
| 空结果 | 问题与所有文档都不相关 | 返回空或低相关性提示 |

### 生成质量测试

#### 评测方法对比

| 维度 | 说明 | 评测方法 |
|------|------|----------|
| 准确性 | 回答是否正确 | 人工标注 / LLM-as-Judge |
| 相关性 | 回答是否切题 | 相关性评分 |
| 完整性 | 是否覆盖所有要点 | 要点覆盖率 |
| 流畅性 | 语言是否自然流畅 | 困惑度 / 人工评分 |
| 引用准确性 | 引用的文档是否正确 | 引用验证 |

#### LLM-as-Judge 评测

```python
def llm_as_judge(question, answer, reference, retrieved_docs):
    """使用 LLM 作为评判者评估回答质量"""
    prompt = f"""
你是一个专业的问答评估专家。请评估以下回答的质量。

问题：{question}
回答：{answer}
参考答案：{reference}
检索到的文档：{chr(10).join(retrieved_docs)}

请从以下维度评分（1-5分）：
1. 准确性：回答是否正确，是否有事实错误
2. 相关性：回答是否紧扣问题
3. 完整性：回答是否覆盖所有关键信息
4. 引用准确性：回答是否正确引用了文档内容

请以 JSON 格式返回评分。
"""
    return llm.generate(prompt)
```

### 幻觉检测测试

#### 幻觉类型

| 类型 | 说明 | 示例 |
|------|------|------|
| 事实性幻觉 | 编造不存在的事实 | "公司成立于 2020 年"（实际是 2015 年） |
| 引用幻觉 | 引用不存在的信息 | "根据文档 3..."（但文档 3 没有这个内容） |
| 推理幻觉 | 错误的逻辑推理 | A 和 B 推出 C（但逻辑错误） |
| 细节幻觉 | 添加不存在的细节 | "年假可以累积到下一年"（实际不可累积） |

#### 检测方法

```python
def detect_hallucination(answer, retrieved_docs):
    """检测回答中的幻觉内容"""
    statements = extract_statements(answer)
    hallucinations = []

    for statement in statements:
        supported = any(is_supported_by(statement, doc) for doc in retrieved_docs)
        if not supported:
            hallucinations.append(statement)

    return {
        "hallucination_count": len(hallucinations),
        "hallucination_rate": len(hallucinations) / len(statements) if statements else 0,
        "hallucinated_statements": hallucinations
    }
```

### 端到端性能测试

```python
import time, asyncio
from statistics import mean, median

async def performance_test(rag_system, test_questions, concurrency=10):
    """RAG 系统性能测试"""
    results = {"total_requests": len(test_questions), "latencies": []}
    semaphore = asyncio.Semaphore(concurrency)

    async def single_request(question):
        start = time.time()
        try:
            result = await rag_system.query(question)
            return {"success": True, "latency": time.time() - start}
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def bounded_request(q):
        async with semaphore:
            return await single_request(q)

    responses = await asyncio.gather(*[bounded_request(q) for q in test_questions])

    # 计算统计数据
    latencies = [r["latency"] for r in responses if r["success"]]
    return {
        "avg_latency": mean(latencies),
        "p50_latency": median(latencies),
        "p95_latency": sorted(latencies)[int(len(latencies) * 0.95)]
    }
```

---

## 三、RAG 评测工具

### Ragas（推荐）

Ragas 是专门用于 RAG 评测的开源框架。

```bash
pip install ragas
```

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_recall, context_precision
from datasets import Dataset

test_data = {
    "question": ["公司的年假政策是什么？"],
    "answer": ["员工入职满一年后享有5天年假。"],
    "contexts": [["根据公司规定，员工入职满一年后享有5天年假..."]],
    "ground_truth": ["入职满一年后有5天年假"]
}

dataset = Dataset.from_dict(test_data)
result = evaluate(dataset, metrics=[
    faithfulness, answer_relevancy, context_recall, context_precision
])
print(result)
```

#### Ragas 指标详解

| 指标 | 说明 | 计算方式 |
|------|------|----------|
| faithfulness | 回答是否忠实于检索文档 | 提取回答中的陈述，检查是否有文档支持 |
| answer_relevancy | 回答与问题的相关性 | LLM 生成可能的问题，计算相似度 |
| context_recall | 检索覆盖了多少 ground truth | 检查 ground truth 是否在检索文档中 |
| context_precision | 检索文档中有多少相关 | 检查每个检索文档的相关性 |

### TruLens

```bash
pip install trulens-eval
```

```python
from trulens_eval import Feedback, TruChain
from trulens_eval.feedback import Groundedness

grounded = Groundedness(groundedness_provider=OpenAI())
f_groundedness = Feedback(grounded.groundedness_measure, name="Groundedness")
f_relevance = Feedback(grounded.relevance, name="Relevance")

tru_recorder = TruChain(rag_chain, app_id="My_RAG_App",
                         feedbacks=[f_groundedness, f_relevance])

with tru_recorder as recording:
    response = rag_chain.invoke("公司的年假政策是什么？")
```

---

## 四、RAG 测试最佳实践

### 测试场景覆盖

| 场景类型 | 测试内容 | 用例占比 |
|----------|----------|----------|
| 正常查询 | 常见问题，预期有准确答案 | 50% |
| 多文档关联 | 需要综合多个文档回答 | 15% |
| 语义相似 | 问题与文档表述不同但语义相同 | 10% |
| 边界情况 | 问题模糊、歧义、不完整 | 10% |
| 无答案查询 | 问题与文档库无关 | 10% |
| 对抗性测试 | 试图诱导错误回答的问题 | 5% |

### 测试数据标注

```python
annotated_test_case = {
    "question": "公司报销的时间限制是什么？",
    "relevant_chunks": ["chunk_001", "chunk_005"],
    "ground_truth_answer": "费用发生后30天内需提交报销申请",
    "difficulty": "medium",
    "category": "policy",
    "expected_retrieval_count": 2,
    "edge_case": False
}
```

### 持续评测流水线

```yaml
# .github/workflows/rag-eval.yml
name: RAG Evaluation
on:
  push:
    branches: [main]
jobs:
  evaluate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run evaluation
        run: |
          python scripts/eval_retrieval.py
          python scripts/eval_generation.py
          python scripts/eval_hallucination.py
```

---

## 五、常见问题与解决方案

### Q1：检索不到相关文档怎么办？

**可能原因**：文档分块粒度不合适、向量模型理解不足、问题表述差异大

**解决方案**：
1. 调整分块策略（按语义分块而非固定长度）
2. 使用领域微调的向量模型
3. 增加重排序步骤
4. 添加关键词检索作为补充

### Q2：回答质量不稳定怎么办？

**解决方案**：
1. 设置较低的 temperature
2. 优化 prompt，增加输出格式要求
3. 添加后处理验证
4. 使用多轮对话澄清问题

### Q3：如何评估真实用户满意度？

**方法**：
1. 埋点收集用户反馈（点赞/踩）
2. 用户访谈
3. A/B 测试
4. 监控后续行为（是否重新提问、是否转人工）

---

*文档持续更新中...*
