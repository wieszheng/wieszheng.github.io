---
title: 多 Agent 协作
description: 介绍如何构建多 Agent 协作系统，包括架构模式、实现方式等
---

# 多 Agent 协作

> 本章介绍如何构建多 Agent 协作系统，包括架构模式、实现方式等。

## 多 Agent 概述

### 为什么需要多 Agent？

```
Single Agent                           Multi-Agent
═══════════════════════════════════════════════════════════

┌─────────────┐                       ┌─────────────┐
│             │                       │  Supervisor │
│    Agent    │                       └──────┬──────┘
│             │                              │
│  单一职责    │                              ├─────────┬─────────┐
│  能力有限    │                              ▼         ▼         ▼
│             │                        ┌─────────┐ ┌─────────┐ ┌─────────┐
│  复杂任务    │                        │Research │ │ Writer  │ │Reviewer │
│  难以完成    │                        │ Agent   │ │ Agent   │ │ Agent   │
└─────────────┘                        └─────────┘ └─────────┘ └─────────┘

                                        专业化分工
                                        协作完成复杂任务
═══════════════════════════════════════════════════════════
```

### 适用场景

| 场景 | 方案 | 说明 |
|------|------|------|
| 分类路由 | Supervisor | 多个子 Agent 根据意图分配 |
| 并行查询 | Parallel | 同时查询多个数据源 |
| 流水线处理 | Sequential | A处理 → B处理 → C处理 |
| 复杂协作 | Network | Agent 间自由通信 |

## 协作模式

### 模式概览

```
Multi-Agent Patterns
══════════════════════════════════════════════════════════════

1. Supervisor 模式
   ┌──────────────┐
   │  Supervisor  │  负责协调和分配任务
   └──┬──────┬─────┘
       │      │
    ┌──┴─┐ ┌─┴──┐
    ▼       ▼
┌───────┐ ┌───────┐
│Agent A│ │Agent B│  子 Agent 专注执行
└───────┘ └───────┘

2. Parallel 模式
   ┌──────────────┐
   │  Dispatcher  │  分发任务
   └──┬──────┬─────┘
       │      │
    ┌──┴─┐ ┌─┴──┐
    ▼       ▼
┌───────┐ ┌───────┐
│Agent A│ │Agent B│  并行执行
└───┬───┘ └───┬───┘
    │         │
    └────┬────┘
         ▼
   ┌──────────────┐
   │   Aggregator │  汇总结果
   └──────────────┘

3. Sequential 模式
   ┌──────┐    ┌──────┐    ┌──────┐
   │Agent │───▶│Agent │───▶│Agent │
   │  A   │    │  B   │    │  C   │
   └──────┘    └──────┘    └──────┘
   流水线处理，每个 Agent 完成特定阶段

4. Network 模式
       ┌─────┐
      /│  A  │\
     / └─────┘ \
    ▼           ▼
   ┌─────┐     ┌─────┐
   │  B  │◀───▶│  C  │
   └─────┘     └─────┘
   Agent 间对等通信
══════════════════════════════════════════════════════════════
```

## Supervisor 模式

### 完整实现

```python
from typing import Literal
from langgraph.graph import StateGraph, MessagesState, END, START
from langchain_core.messages import HumanMessage, AIMessage
from langchain.agents import create_agent

# 研究 Agent
research_agent = create_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[search_web, summarize],
    system_prompt="""你是一个专业的研究助手。

职责：
1. 搜索相关信息
2. 阅读和理解内容
3. 总结关键发现"""
)

# 写作 Agent
writer_agent = create_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[write_document],
    system_prompt="""你是一个专业的写作助手。

职责：
1. 根据研究结果撰写内容
2. 确保文章结构清晰"""
)

class SupervisorState(TypedDict):
    messages: list
    next_agent: str
    research_result: str | None
    draft: str | None

def supervisor_router(state: SupervisorState) -> Literal["research", "write", "end"]:
    has_research = bool(state.get("research_result"))
    has_draft = bool(state.get("draft"))
    
    if not has_research:
        return "research"
    elif not has_draft:
        return "write"
    return "end"

def research_node(state: SupervisorState):
    result = research_agent.invoke({
        "messages": [HumanMessage(content=f"研究主题：{state['messages'][0]['content']}")]
    })
    return {"research_result": result["messages"][-1]["content"]}

def write_node(state: SupervisorState):
    result = writer_agent.invoke({
        "messages": [HumanMessage(content=f"基于以下研究结果撰写文章：\n\n{state.get('research_result', '')}")]
    })
    return {"draft": result["messages"][-1]["content"]}

graph = StateGraph(SupervisorState)
graph.add_node("supervisor", lambda s: s)
graph.add_node("research", research_node)
graph.add_node("write", write_node)

graph.add_edge(START, "supervisor")
graph.add_conditional_edges(
    "supervisor",
    supervisor_router,
    {"research": "research", "write": "write", "end": END}
)

graph.add_edge("research", "supervisor")
graph.add_edge("write", "supervisor")

supervisor_app = graph.compile()
```

## 并行模式

### 实现

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

def parallel_query(query: str) -> dict[str, str]:
    """并行查询多个数据源"""
    agents = {
        "weather": get_weather_agent(),
        "stock": get_stock_agent(),
        "news": get_news_agent(),
    }
    
    results = {}
    
    with ThreadPoolExecutor(max_workers=len(agents)) as executor:
        futures = {
            executor.submit(agent.invoke, {"query": query}): name
            for name, agent in agents.items()
        }
        
        for future in as_completed(futures):
            name = futures[future]
            try:
                result = future.result()
                results[name] = result["content"]
            except Exception as e:
                results[name] = f"Error: {str(e)}"
    
    return results
```

## 网络模式

### 对等通信

```python
class NetworkState(TypedDict):
    messages: list
    pending_tasks: list
    completed_tasks: list
    shared_context: dict

def manager_node(state: NetworkState) -> NetworkState:
    """管理器节点：分解任务"""
    task = state["messages"][-1]["content"]
    tasks = [
        {"id": 1, "type": "search", "desc": "搜索相关信息"},
        {"id": 2, "type": "write", "desc": "撰写内容", "depends_on": [1]},
        {"id": 3, "type": "review", "desc": "审核内容", "depends_on": [2]},
    ]
    return {"pending_tasks": tasks}
```

## 本章小结

```
多 Agent 协作要点
────────────────────────────────────────────────────────

✅ Supervisor 模式 = 中心协调，适合分类路由
✅ Parallel 模式 = 并行执行，适合多数据源查询
✅ Sequential 模式 = 流水线，适合处理流程
✅ Network 模式 = 对等通信，适合复杂协作

选择指南
────────────────────────────────────────────────────────
意图分流 → Supervisor
并行查询 → Parallel
流水线处理 → Sequential
复杂协作 → Network


