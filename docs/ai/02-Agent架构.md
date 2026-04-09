---
title: Agent 架构
description: 深入解析 LangChain Agent 的系统架构，包括核心模块、数据流、状态管理等
---

# Agent 架构

> 本章深入解析 LangChain Agent 的系统架构，包括核心模块、数据流、状态管理等。

## 整体架构

### 三层架构模型

```
LangChain Agent Architecture
────────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────┐
│                   Presentation Layer                        │
│                      (表现层)                                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Stream    │  │   Batch     │  │   Async             │ │
│  │   Interface │  │   Invoke    │  │   Interface         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Agent Core Layer                          │
│                      (核心层)                                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   LLM       │  │   Tools     │  │     Memory          │ │
│  │   Engine    │  │   Binder    │  │     Manager         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 模块职责

| 层级 | 模块 | 职责 |
|------|------|------|
| 表现层 | Stream/Batch/Async | 对外接口，处理请求 |
| 核心层 | LLM Engine | 模型调用、推理 |
| 核心层 | Tools Binder | 工具绑定、函数调用 |
| 核心层 | Memory Manager | 状态持久化 |
| 核心层 | Executor | 执行调度、循环控制 |

## 数据流

### 消息构建流程

```python
def build_messages(
    system_prompt: str,
    history: list[Message],
    user_input: str,
    tool_schemas: list[dict]
) -> list[Message]:
    """构建完整的消息列表"""
    messages = []
    
    # 1. 系统消息（包含工具描述）
    system_content = f"""{system_prompt}
    
    你可以使用以下工具：
    {format_tools(tool_schemas)}
    """
    messages.append(SystemMessage(content=system_content))
    
    # 2. 历史消息
    messages.extend(history)
    
    # 3. 当前用户输入
    messages.append(HumanMessage(content=user_input))
    
    return messages
```

## 状态管理

### State 结构

```python
from typing import TypedDict, Annotated
from langgraph.graph import add_messages
from langchain_core.messages import BaseMessage

class AgentState(TypedDict):
    """Agent 状态定义"""
    
    # 消息历史（自动合并）
    messages: Annotated[list[BaseMessage], add_messages]
    
    # 可选：自定义状态字段
    intent: str | None
    tools_used: list[str]
    context: dict
    iteration: int
    result: str | None
```

### 状态持久化

```python
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.checkpoint.postgres import PostgresSaver

# 内存检查点（开发用）
memory_checkpointer = InMemorySaver()

# PostgreSQL 检查点（生产用）
prod_checkpointer = PostgresSaver.from_conn_string(
    "postgresql://user:pass@localhost/db"
)

# 使用检查点
agent = create_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[...],
    checkpointer=memory_checkpointer
)

config = {"configurable": {"thread_id": "session_123"}}
```

## 消息系统

### 消息类型

```python
from langchain_core.messages import (
    SystemMessage,
    HumanMessage,
    AIMessage,
    ToolMessage,
)

# 1. SystemMessage - 系统指令
system = SystemMessage(content="你是一个专业的旅行助手")

# 2. HumanMessage - 用户输入
human = HumanMessage(content="帮我查一下明天北京到上海的航班")

# 3. AIMessage - AI 回复
ai = AIMessage(content="好的，我来帮您查询。")

# 4. ToolMessage - 工具执行结果
tool = ToolMessage(
    content="找到3个航班",
    tool_call_id="call_abc123"
)
```

## 工具绑定机制

### Schema 生成

```python
def get_weather(city: str, country: str = "CN") -> str:
    """获取指定城市的天气预报"""
    return "晴朗，25°C"

# 自动生成的 Schema
tool_schema = {
    "name": "get_weather",
    "description": "获取指定城市的天气预报",
    "parameters": {
        "type": "object",
        "properties": {
            "city": {"type": "string", "description": "城市名称"},
        },
        "required": ["city"]
    }
}
```

## 执行引擎

### 执行配置

```python
agent = create_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[...],
    system_prompt="...",
    checkpointer=InMemorySaver(),
    interrupt_before=[],
    interrupt_after=["tools"],
    max_tokens=4096,
    timeout=120,
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "..."}]},
    config={"configurable": {"thread_id": "123"}},
    debug=True
)
```

## 本章小结

```
关键要点
────────────────────────────────────────────────────────

✅ 三层架构：表现层 → 核心层 → 基础设施层
✅ 数据流：Input → Build → LLM → Parse → Tool → Output
✅ 状态管理：TypedDict + Checkpointer
✅ 消息系统：System/Human/AI/Tool Message


