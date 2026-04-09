---
title: LangGraph 进阶
description: 介绍 LangGraph 的高级用法，包括 StateGraph、条件边、子图等
---

# LangGraph 进阶

> 本章介绍 LangGraph 的高级用法，包括 StateGraph、条件边、子图等。

## LangGraph 概述

### 什么是 LangGraph？

LangGraph 是 LangChain 的底层编排框架，用于构建**有状态、多步骤、多 Agent** 的复杂应用。

```
LangGraph vs LangChain
────────────────────────────────────────────────────────

LangChain (高级)
┌─────────────────────────────────────────┐
│  create_agent(model, tools, prompt)      │
│  • 简单易用                             │
│  • 功能完整                             │
└─────────────────────────────────────────┘
              │
              ▼
LangGraph (底层)
┌─────────────────────────────────────────┐
│  StateGraph(State)                      │
│    .add_node("name", func)             │
│    .add_edge("a", "b")                 │
│    .compile()                          │
│  • 完全可控                             │
│  • 状态管理                             │
└─────────────────────────────────────────┘
```

### 核心概念

```
LangGraph Core Concepts
────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────┐
│                     LangGraph                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Node (节点)                                                │
│   • 执行单元，函数形式                                       │
│   • 接收状态，返回更新                                       │
│                                                              │
│   Edge (边)                                                 │
│   • 执行流程                                                 │
│   • 普通边：固定跳转                                         │
│   • 条件边：根据状态选择                                      │
│                                                              │
│   State (状态)                                              │
│   • 贯穿整个图的数据                                         │
│   • TypedDict 定义                                           │
│                                                              │
│   Graph (图)                                                │
│   • 节点 + 边的组合                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## StateGraph 基础

### 最小示例

```python
from langgraph.graph import StateGraph, MessagesState, START, END

# 1. 定义状态
graph = StateGraph(MessagesState)

# 2. 定义节点
def model_node(state: MessagesState):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

# 3. 添加节点
graph.add_node("model", model_node)

# 4. 添加边
graph.add_edge(START, "model")
graph.add_edge("model", END)

# 5. 编译
app = graph.compile()

# 6. 执行
result = app.invoke({
    "messages": [{"role": "user", "content": "你好"}]
})
```

### 自定义状态

```python
from typing import TypedDict, Annotated
from langgraph.graph import add_messages

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    intent: str | None
    next_action: str
    iteration: int

graph = StateGraph(AgentState)
```

## 节点定义

### 完整节点示例

```python
from typing import TypedDict, Literal
from langgraph.graph import MessagesState, END, START
from langchain_core.messages import AIMessage

class RouterState(TypedDict):
    messages: list
    intent: str
    result: str | None

def route_intent(state: RouterState) -> RouterState:
    """路由节点"""
    user_msg = state["messages"][-1]["content"].lower()
    
    if "天气" in user_msg:
        intent = "weather"
    elif "股票" in user_msg:
        intent = "finance"
    else:
        intent = "general"
    
    return {"intent": intent}

def handle_weather(state: RouterState) -> RouterState:
    """天气处理"""
    return {
        "result": "今天天气晴朗",
        "messages": state["messages"] + [
            AIMessage(content="今天天气晴朗")
        ]
    }

graph = StateGraph(RouterState)
graph.add_node("route", route_intent)
graph.add_node("weather", handle_weather)
graph.add_edge(START, "route")
```

## 边的控制

### 普通边

```python
# 顺序执行
graph.add_edge(START, "node_a")
graph.add_edge("node_a", "node_b")
graph.add_edge("node_b", END)

# 等价于: START → node_a → node_b → END
```

### 条件边

```python
# 根据状态返回值决定下一个节点
graph.add_conditional_edges(
    "decision_node",
    routing_function,  # 返回下一个节点名称
    {
        "path_a": "node_a",
        "path_b": "node_b",
        "path_c": END
    }
)
```

## 条件边

### 多条件路由

```python
from enum import Enum

class Route(str, Enum):
    WEATHER = "weather"
    STOCK = "stock"
    UNKNOWN = "unknown"

def classify_and_route(state: AgentState) -> Route:
    content = state["messages"][-1]["content"]
    
    if "天气" in content:
        return Route.WEATHER
    elif "股票" in content:
        return Route.STOCK
    return Route.UNKNOWN

graph.add_conditional_edges(
    "classify",
    classify_and_route,
    {
        Route.WEATHER: "weather_handler",
        Route.STOCK: "stock_handler",
        Route.UNKNOWN: "unknown_handler"
    }
)
```

## 子图

### 子图概念

```
Subgraph Architecture
────────────────────────────────────────────────────────────

Main Graph                              Subgraph
─────────────────                       ──────────────────

┌─────────────┐
│    START    │
└──────┬──────┘
       │
       ▼
┌─────────────┐        ┌─────────────────────────────┐
│   Subgraph  │───────▶│  Subgraph内部               │
│     Node    │        │  ┌─────┐ ┌─────┐ ┌─────┐  │
└─────────────┘◀───────│  │  A  │→│  B  │→│  C  │  │
       │        └──────│  └─────┘ └─────┘ └─────┘  │
       ▼               └─────────────────────────────┘
┌─────────────┐
│    END      │
└─────────────┘
```

### 子图实现

```python
from langgraph.graph import StateGraph as SubGraph

class SubgraphState(TypedDict):
    sub_messages: list
    search_results: list

subgraph = StateGraph(SubgraphState)
subgraph.add_node("search", search_node)
subgraph.add_node("format", format_results)
subgraph.add_edge(START, "search")
subgraph.add_edge("search", "format")
subgraph.add_edge("format", END)
research_graph = subgraph.compile()

# 在主图中使用
main_graph = StateGraph(MessagesState)
main_graph.add_node("research", research_graph)
```

## 本章小结

```
LangGraph 要点
────────────────────────────────────────────────────────

✅ StateGraph = 状态机构建器
✅ add_node() = 添加执行节点
✅ add_edge() = 普通边（固定跳转）
✅ add_conditional_edges() = 条件边（动态路由）
✅ subgraph = 嵌套图

核心模式
────────────────────────────────────────────────────────
1. START → Nodes → END (顺序)
2. conditional_edges (多路由)
3. subgraph (嵌套图)
4. interrupt (人工介入)


