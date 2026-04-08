# Python + FastAPI 开发规范

> 面向团队协作，可直接落地。少说虚的，多给示例。

---

## 一、项目结构

标准项目目录：

```
project_name/
├── app/
│   ├── __init__.py
│   ├── main.py              # 应用入口
│   ├── config.py            # 配置管理
│   ├── dependencies.py      # 依赖注入
│   ├── models/              # 数据模型
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── order.py
│   ├── schemas/             # Pydantic 模型
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── order.py
│   ├── routers/             # 路由模块
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── order.py
│   ├── services/            # 业务逻辑
│   │   ├── __init__.py
│   │   ├── user_service.py
│   │   └── order_service.py
│   ├── repositories/        # 数据访问层
│   │   ├── __init__.py
│   │   └── user_repo.py
│   ├── utils/               # 工具函数
│   │   ├── __init__.py
│   │   └── security.py
│   └── exceptions.py        # 自定义异常
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # pytest 配置
│   ├── test_user.py
│   └── test_order.py
├── alembic/                 # 数据库迁移
│   └── versions/
├── .env.example
├── .gitignore
├── pyproject.toml           # 项目配置（推荐）
├── requirements.txt         # 依赖清单
└── README.md
```

**原则：**

- **分层清晰：** Router → Service → Repository → Model，单向依赖
- **模块化：** 每个业务领域一个目录，避免单个文件超过 300 行
- **配置分离：** 环境变量通过 `.env` 管理，代码中不硬编码敏感信息

---

## 二、代码风格

### 2.1 格式化工具

使用 `black` + `isort` + `ruff` 组合：

```toml
# pyproject.toml
[tool.black]
line-length = 100
target-version = ['py39', 'py310', 'py311']

[tool.isort]
profile = "black"
line_length = 100

[tool.ruff]
line-length = 100

[tool.ruff.lint]
select = ["E", "F", "I", "N", "W", "UP"]
ignore = ["E501"]  # black 已处理
```

### 2.2 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件名 | 小写下划线 | `user_service.py` |
| 类名 | 大驼峰 | `UserService` |
| 函数/方法 | 小写下划线 | `get_user_by_id` |
| 常量 | 全大写下划线 | `MAX_RETRY_COUNT` |
| 变量 | 小写下划线 | `user_list` |

### 2.3 类型注解

**强制使用类型注解：**

```python
# ✅ 正确
def get_user(user_id: int) -> User | None:
    return db.query(User).filter(User.id == user_id).first()

# ❌ 错误
def get_user(user_id):
    return db.query(User).filter(User.id == user_id).first()
```

### 2.4 文档字符串

使用 Google 风格：

```python
def create_user(user_data: UserCreate) -> User:
    """创建新用户。

    Args:
        user_data: 用户创建数据模型。

    Returns:
        创建的用户对象。

    Raises:
        DuplicateEmailError: 邮箱已存在时抛出。
    """
    if user_exists(user_data.email):
        raise DuplicateEmailError(f"邮箱 {user_data.email} 已注册")
    
    user = User(**user_data.dict())
    db.add(user)
    db.commit()
    return user
```

---

## 三、依赖管理

### 3.1 使用 Poetry（推荐）

```bash
# 初始化项目
poetry init

# 添加依赖
poetry add fastapi uvicorn sqlalchemy pydantic

# 添加开发依赖
poetry add --group dev pytest black ruff

# 安装所有依赖
poetry install
```

### 3.2 requirements.txt（备选）

分离生产和开发依赖：

```
# requirements.txt
fastapi==0.115.0
uvicorn[standard]==0.30.0
sqlalchemy==2.0.36
pydantic==2.10.0
pydantic-settings==2.6.0

# requirements-dev.txt
-r requirements.txt
pytest==7.4.3
black==24.10.0
ruff==0.8.0
httpx==0.27.0
```

### 3.3 版本锁定

- 生产环境必须锁定具体版本（`==`）
- 开发依赖可使用范围版本（`^` 或 `~=`）
- 定期更新依赖，不要超过 3 个月不更新

---

## 四、路由设计

### 4.1 路由模块化

每个业务领域独立路由文件：

```python
# app/routers/user.py
from fastapi import APIRouter, Depends
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import UserService, get_user_service

router = APIRouter(prefix="/users", tags=["用户管理"])

@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(
    user_data: UserCreate,
    service: UserService = Depends(get_user_service)
) -> UserResponse:
    """创建用户。"""
    return await service.create(user_data)

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    service: UserService = Depends(get_user_service)
) -> UserResponse:
    """获取用户详情。"""
    return await service.get_by_id(user_id)
```

### 4.2 主应用注册

```python
# app/main.py
from fastapi import FastAPI
from app.routers import user, order
from app.exceptions import register_exception_handlers

app = FastAPI(
    title="项目名称",
    description="项目描述",
    version="1.0.0"
)

# 注册路由
app.include_router(user.router)
app.include_router(order.router)

# 注册异常处理器
register_exception_handlers(app)
```

### 4.3 路由命名规范

- RESTful 风格，资源用复数：`/users`、`/orders`
- 动词由 HTTP 方法表达，不写在路径中
- 路径参数用蛇形命名：`/users/{user_id}`

**示例：**

```
GET    /users           # 获取用户列表
POST   /users           # 创建用户
GET    /users/{user_id} # 获取单个用户
PUT    /users/{user_id} # 更新用户
DELETE /users/{user_id} # 删除用户
```

### 4.4 请求参数验证

使用 FastAPI 的 `Query`、`Path`、`Body` 进行参数验证：

```python
from fastapi import Query, Path, Body
from typing import Annotated

@router.get("/users")
async def list_users(
    # Query 参数验证
    page: Annotated[int, Query(ge=1, description="页码")] = 1,
    page_size: Annotated[int, Query(ge=1, le=100, description="每页数量")] = 10,
    keyword: Annotated[str | None, Query(max_length=50, description="搜索关键词")] = None,
    status: Annotated[str | None, Query(pattern="^(active|inactive)$")] = None,
) -> ResponseModel[list[UserResponse]]:
    """获取用户列表，支持分页和筛选。"""
    users = await service.list(
        page=page,
        page_size=page_size,
        keyword=keyword,
        status=status
    )
    return ResponseModel(data=users)

@router.get("/users/{user_id}")
async def get_user(
    # Path 参数验证
    user_id: Annotated[int, Path(ge=1, description="用户ID")],
) -> ResponseModel[UserResponse]:
    """获取用户详情。"""
    user = await service.get_by_id(user_id)
    return ResponseModel(data=user)

@router.post("/users")
async def create_user(
    # Body 参数验证
    user_data: Annotated[UserCreate, Body(description="用户创建数据")],
) -> ResponseModel[UserResponse]:
    """创建用户。"""
    user = await service.create(user_data)
    return ResponseModel(data=user)
```

**验证规则说明：**

| 验证器 | 说明 | 示例 |
|--------|------|------|
| `ge` | 大于等于 | `Query(ge=1)` |
| `gt` | 大于 | `Query(gt=0)` |
| `le` | 小于等于 | `Query(le=100)` |
| `lt` | 小于 | `Query(lt=1000)` |
| `min_length` | 最小长度 | `Query(min_length=1)` |
| `max_length` | 最大长度 | `Query(max_length=50)` |
| `pattern` | 正则匹配 | `Query(pattern="^[a-z]+$")` |
| `description` | 参数描述（显示在 API 文档中） | `Query(description="页码")` |

---

## 五、依赖注入

### 5.1 依赖注入工厂函数

FastAPI 的 `Depends()` 需要提供工厂函数，不能直接实例化：

```python
# app/dependencies.py
from typing import Generator
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.repositories.user_repo import UserRepository
from app.services.user_service import UserService

def get_db() -> Generator[Session, None, None]:
    """获取数据库会话。"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_user_repo(db: Session = Depends(get_db)) -> UserRepository:
    """获取用户 Repository。"""
    return UserRepository(db)

def get_user_service(repo: UserRepository = Depends(get_user_repo)) -> UserService:
    """获取用户 Service。"""
    return UserService(repo)
```

### 5.2 在路由中使用

```python
# app/routers/user.py
from fastapi import APIRouter, Depends
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import UserService, get_user_service

router = APIRouter(prefix="/users", tags=["用户管理"])

@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(
    user_data: UserCreate,
    service: UserService = Depends(get_user_service)
) -> UserResponse:
    """创建用户。"""
    return await service.create(user_data)
```

### 5.3 Service 层实现

```python
# app/services/user_service.py
from app.repositories.user_repo import UserRepository
from app.schemas.user import UserCreate
from app.models.user import User

class UserService:
    def __init__(self, repo: UserRepository):
        self.repo = repo
    
    async def create(self, user_data: UserCreate) -> User:
        """创建用户。"""
        # 检查邮箱是否已存在
        if self.repo.get_by_email(user_data.email):
            raise DuplicateError("邮箱", user_data.email)
        
        # 创建用户
        user_dict = user_data.model_dump()
        user_dict["hashed_password"] = get_password_hash(user_dict.pop("password"))
        return self.repo.create(user_dict)

# 工厂函数
def get_user_service(repo: UserRepository = Depends(get_user_repo)) -> UserService:
    return UserService(repo)
```

---

## 六、错误处理

### 6.1 自定义异常

```python
# app/exceptions.py
from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse

class AppException(Exception):
    """应用基础异常。"""
    def __init__(self, message: str, code: str = "UNKNOWN_ERROR", status_code: int = 400):
        self.message = message
        self.code = code
        self.status_code = status_code

class NotFoundError(AppException):
    """资源不存在。"""
    def __init__(self, resource: str, resource_id: int):
        super().__init__(
            message=f"{resource} 不存在: ID={resource_id}",
            code="NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND
        )

class DuplicateError(AppException):
    """资源重复。"""
    def __init__(self, field: str, value: str):
        super().__init__(
            message=f"{field} 已存在: {value}",
            code="DUPLICATE",
            status_code=status.HTTP_409_CONFLICT
        )

class ValidationError(AppException):
    """验证错误。"""
    def __init__(self, message: str):
        super().__init__(
            message=message,
            code="VALIDATION_ERROR",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )

class PermissionDeniedError(AppException):
    """权限不足。"""
    def __init__(self, message: str = "权限不足"):
        super().__init__(
            message=message,
            code="PERMISSION_DENIED",
            status_code=status.HTTP_403_FORBIDDEN
        )
```

### 6.2 全局异常处理器

```python
# app/exceptions.py（续）
from fastapi import FastAPI

def register_exception_handlers(app: FastAPI):
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "code": exc.code,
                "message": exc.message,
                "detail": None
            }
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "code": "HTTP_ERROR",
                "message": exc.detail,
                "detail": None
            }
        )
```

### 6.3 统一响应格式

```python
# app/schemas/response.py
from typing import Generic, TypeVar, Optional
from pydantic import BaseModel

T = TypeVar("T")

class ResponseModel(BaseModel, Generic[T]):
    code: str = "SUCCESS"
    message: str = "操作成功"
    data: Optional[T] = None

# 使用示例
@router.get("/users/{user_id}", response_model=ResponseModel[UserResponse])
async def get_user(user_id: int) -> ResponseModel[UserResponse]:
    user = await service.get_by_id(user_id)
    return ResponseModel(data=user)
```

---

## 七、测试规范

### 7.1 测试结构

```
tests/
├── conftest.py          # 共享 fixtures
├── test_user_api.py     # API 层测试
├── test_user_service.py # 业务逻辑测试
└── test_user_repo.py    # 数据访问层测试
```

### 7.2 conftest.py 配置

```python
# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

# 推荐：使用 PostgreSQL Docker 容器进行测试
# docker run -d --name test-postgres -e POSTGRES_PASSWORD=test -p 5433:5432 postgres:14
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:test@localhost:5433/test_db"

# 备选：使用 SQLite 内存数据库（仅用于简单测试，生产环境不推荐）
# SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
# engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """创建测试数据库会话。"""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    """创建测试客户端。"""
    def override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()
```

### 7.3 测试示例

```python
# tests/test_user_api.py
def test_create_user(client):
    """测试创建用户接口。"""
    response = client.post(
        "/users/",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "password123"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"

def test_get_user_not_found(client):
    """测试获取不存在的用户。"""
    response = client.get("/users/999")
    assert response.status_code == 404
```

### 7.4 测试覆盖率

```bash
# 运行测试并生成覆盖率报告
pytest --cov=app --cov-report=html --cov-report=term

# 覆盖率要求
# - 核心业务逻辑：≥ 80%
# - API 接口：≥ 70%
# - 工具函数：≥ 60%
```

---

## 八、配置管理

### 8.1 环境变量

```python
# app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "FastAPI Project"
    debug: bool = False
    
    # 数据库配置
    database_url: str
    database_pool_size: int = 5
    
    # Redis 配置
    redis_url: str | None = None
    
    # 安全配置
    secret_key: str
    access_token_expire_minutes: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
```

### 8.2 .env.example

```env
# 应用配置
APP_NAME=FastAPI Project
DEBUG=False

# 数据库
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
DATABASE_POOL_SIZE=10

# Redis
REDIS_URL=redis://localhost:6379/0

# 安全
SECRET_KEY=your-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 九、Git 工作流

### 9.1 分支策略

```
main        # 生产环境，受保护
  ├── develop    # 开发环境
  │     ├── feature/user-auth    # 功能分支
  │     ├── feature/order-system
  │     └── bugfix/login-error   # 修复分支
  └── hotfix/critical-bug        # 紧急修复
```

### 9.2 Commit 规范

使用 Conventional Commits：

```
feat: 添加用户登录功能
fix: 修复用户创建时邮箱验证错误
docs: 更新 API 文档
refactor: 重构订单服务逻辑
test: 添加用户服务单元测试
chore: 更新依赖版本
```

### 9.3 PR 规范

PR 标题格式：`[类型] 简短描述`

```
[Feature] 用户登录功能
[Fix] 修复邮箱验证错误
[Refactor] 重构订单服务
```

PR 模板：

```markdown
## 变更说明
简要说明本次变更内容。

## 变更类型
- [ ] 功能新增
- [ ] Bug 修复
- [ ] 重构
- [ ] 文档更新

## 测试情况
- [ ] 已添加单元测试
- [ ] 已手动测试

## 相关 Issue
Closes #123
```

---

## 十、部署规范

### 10.1 Dockerfile（多阶段构建）

```dockerfile
# 阶段1：构建依赖
FROM python:3.11-slim as builder

WORKDIR /app

# 安装构建依赖
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 创建虚拟环境并安装依赖
COPY requirements.txt .
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 阶段2：运行环境
FROM python:3.11-slim as runner

WORKDIR /app

# 安装运行时依赖
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# 从构建阶段复制虚拟环境
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# 创建非 root 用户
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app

# 复制应用代码
COPY --chown=appuser:appuser app ./app
COPY --chown=appuser:appuser alembic ./alembic
COPY --chown=appuser:appuser alembic.ini .

# 切换到非 root 用户
USER appuser

# 暴露端口
EXPOSE 8000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import httpx; httpx.get('http://localhost:8000/health')" || exit 1

# 启动命令
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 10.2 启动脚本

```bash
#!/bin/bash
# scripts/start.sh

# 数据库迁移
alembic upgrade head

# 启动应用
uvicorn app.main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --workers 4 \
  --log-level info
```

### 10.3 健康检查

```python
# app/main.py
@app.get("/health")
async def health_check():
    """健康检查接口。"""
    return {"status": "healthy", "version": "1.0.0"}
```

---

## 十一、认证授权规范

### 11.1 JWT 认证实现

```python
# app/utils/auth.py
from datetime import datetime, timedelta
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings
from app.schemas.user import TokenData

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class AuthError(HTTPException):
    """认证错误。"""
    def __init__(self, detail: str):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码。"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """生成密码哈希。"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """创建访问令牌。"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm="HS256")
    return encoded_jwt

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)]
) -> TokenData:
    """获取当前用户。"""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            raise AuthError("无法验证凭据")
        token_data = TokenData(username=username)
    except JWTError:
        raise AuthError("无法验证凭据")
    return token_data

# 使用示例
@router.get("/users/me")
async def read_users_me(
    current_user: Annotated[TokenData, Depends(get_current_user)]
):
    """获取当前用户信息。"""
    return {"username": current_user.username}
```

### 11.2 OAuth2 密码模式

```python
# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.utils.auth import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["认证"])

@router.post("/token")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> dict:
    """用户登录，获取访问令牌。"""
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
```

### 11.3 权限控制

```python
# app/utils/permissions.py
from functools import wraps
from fastapi import HTTPException, status

def require_role(roles: list[str]):
    """角色权限装饰器。"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user=None, **kwargs):
            if current_user.role not in roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="权限不足"
                )
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator

# 使用示例
@router.delete("/users/{user_id}")
@require_role(["admin"])
async def delete_user(
    user_id: int,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """删除用户（仅管理员）。"""
    await user_service.delete(user_id)
    return {"message": "用户已删除"}
```

---

## 十二、数据库模型与 ORM 规范

### 12.1 SQLAlchemy 模型定义

```python
# app/models/base.py
from datetime import datetime
from sqlalchemy import DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    """SQLAlchemy 基类。"""
    pass

class TimestampMixin:
    """时间戳混入类。"""
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
```

```python
# app/models/user.py
from typing import TYPE_CHECKING
from sqlalchemy import String, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.order import Order

class User(Base, TimestampMixin):
    """用户模型。"""
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # 关联关系
    orders: Mapped[list["Order"]] = relationship(
        "Order",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, username={self.username})>"
```

### 12.2 数据库会话管理

```python
# app/database.py
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.config import settings

engine = create_engine(
    settings.database_url,
    pool_size=settings.database_pool_size,
    pool_pre_ping=True,  # 检查连接有效性
    echo=settings.debug,  # 生产环境关闭
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    """获取数据库会话。"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### 12.3 Repository 模式

```python
# app/repositories/base.py
from typing import Generic, TypeVar, Type, Any
from sqlalchemy.orm import Session
from app.models.base import Base

ModelType = TypeVar("ModelType", bound=Base)

class BaseRepository(Generic[ModelType]):
    """基础 Repository。"""
    
    def __init__(self, model: Type[ModelType], db: Session):
        self.model = model
        self.db = db
    
    def get(self, id: int) -> ModelType | None:
        """根据 ID 获取。"""
        return self.db.query(self.model).filter(self.model.id == id).first()
    
    def get_multi(self, skip: int = 0, limit: int = 100) -> list[ModelType]:
        """获取列表。"""
        return self.db.query(self.model).offset(skip).limit(limit).all()
    
    def create(self, obj_in: dict) -> ModelType:
        """创建。"""
        db_obj = self.model(**obj_in)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj
    
    def update(self, db_obj: ModelType, obj_in: dict) -> ModelType:
        """更新。"""
        for field, value in obj_in.items():
            setattr(db_obj, field, value)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj
    
    def delete(self, id: int) -> bool:
        """删除。"""
        obj = self.get(id)
        if obj:
            self.db.delete(obj)
            self.db.commit()
            return True
        return False
```

```python
# app/repositories/user_repo.py
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.repositories.base import BaseRepository

class UserRepository(BaseRepository[User]):
    """用户 Repository。"""
    
    def __init__(self, db: Session):
        super().__init__(User, db)
    
    def get_by_email(self, email: str) -> Optional[User]:
        """根据邮箱获取用户。"""
        return self.db.query(User).filter(User.email == email).first()
    
    def get_by_username(self, username: str) -> Optional[User]:
        """根据用户名获取用户。"""
        return self.db.query(User).filter(User.username == username).first()
```

---

## 十三、中间件使用规范

### 13.1 自定义中间件

```python
# app/middleware/timer.py
import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

class TimerMiddleware(BaseHTTPMiddleware):
    """请求计时中间件。"""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = f"{process_time:.4f}"
        return response
```

### 13.2 CORS 中间件

```python
# app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 生产环境指定具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=3600,
)
```

### 13.3 请求日志中间件

```python
# app/middleware/logging.py
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)

class LoggingMiddleware(BaseHTTPMiddleware):
    """请求日志中间件。"""
    
    async def dispatch(self, request: Request, call_next):
        # 记录请求
        logger.info(
            f"Request: {request.method} {request.url.path}",
            extra={
                "method": request.method,
                "path": request.url.path,
                "client": request.client.host if request.client else None,
            }
        )
        
        response = await call_next(request)
        
        # 记录响应
        logger.info(
            f"Response: {response.status_code}",
            extra={
                "status_code": response.status_code,
                "method": request.method,
                "path": request.url.path,
            }
        )
        
        return response
```

### 13.4 注册中间件

```python
# app/main.py
from fastapi import FastAPI
from app.middleware.timer import TimerMiddleware
from app.middleware.logging import LoggingMiddleware

app = FastAPI()

# 中间件按注册顺序逆序执行（后注册先执行）
app.add_middleware(TimerMiddleware)
app.add_middleware(LoggingMiddleware)
```

---

## 十四、异步编程规范

### 14.1 异步函数定义

```python
# ✅ 正确：异步 I/O 操作
async def get_user(db: Session, user_id: int) -> User | None:
    """异步获取用户。"""
    return await db.execute(select(User).where(User.id == user_id))

# ❌ 错误：CPU 密集型操作不应使用 async
async def calculate_hash(data: str) -> str:
    """计算哈希（应使用同步函数 + 线程池）。"""
    import hashlib
    return hashlib.sha256(data.encode()).hexdigest()

# ✅ 正确：CPU 密集型操作使用 run_in_executor
import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor()

async def calculate_hash_async(data: str) -> str:
    """异步计算哈希。"""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, calculate_hash, data)
```

### 14.2 异步数据库操作

```python
# 使用 SQLAlchemy 2.0 异步支持
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy import select

engine = create_async_engine("postgresql+asyncpg://user:pass@localhost/db")
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession)

async def get_user_async(db: AsyncSession, user_id: int) -> User | None:
    """异步获取用户。"""
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()
```

### 14.3 并发请求

```python
import asyncio
import httpx

async def fetch_multiple_urls(urls: list[str]) -> list[dict]:
    """并发获取多个 URL。"""
    async with httpx.AsyncClient() as client:
        tasks = [client.get(url) for url in urls]
        responses = await asyncio.gather(*tasks)
        return [response.json() for response in responses]
```

### 14.4 异步上下文管理

```python
from contextlib import asynccontextmanager
from typing import AsyncGenerator

@asynccontextmanager
async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """异步数据库会话上下文管理器。"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

---

## 十五、日志规范

### 15.1 日志配置

```python
# app/utils/logging.py
import logging
import sys
from logging.handlers import RotatingFileHandler
from app.config import settings

def setup_logging():
    """配置日志。"""
    # 创建 logger
    logger = logging.getLogger()
    logger.setLevel(logging.INFO if not settings.debug else logging.DEBUG)
    
    # 格式化器
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s:%(lineno)d | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    
    # 控制台处理器
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # 文件处理器（生产环境）
    if not settings.debug:
        file_handler = RotatingFileHandler(
            "logs/app.log",
            maxBytes=10 * 1024 * 1024,  # 10MB
            backupCount=5,
            encoding="utf-8"
        )
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    # 第三方库日志级别
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
```

### 15.2 日志使用规范

```python
import logging

logger = logging.getLogger(__name__)

# ✅ 正确：使用 f-string 或 % 格式化
logger.info(f"用户登录: user_id={user_id}")
logger.info("订单创建成功: order_id=%d", order_id)

# ✅ 正确：异常日志包含堆栈信息
try:
    await process_order(order_id)
except Exception as e:
    logger.exception(f"订单处理失败: order_id={order_id}")
    raise

# ✅ 正确：敏感信息脱敏
logger.info(f"用户注册: email={email[:3]}***@{email.split('@')[1]}")

# ❌ 错误：在生产环境打印敏感信息
logger.info(f"用户密码: {password}")
```

### 15.3 结构化日志（可选）

```python
# 使用 structlog 进行结构化日志
import structlog

logger = structlog.get_logger()

# 结构化日志
logger.info(
    "user_login",
    user_id=user_id,
    ip_address=request.client.host,
    user_agent=request.headers.get("user-agent")
)
```

---

## 十六、缓存使用规范

### 16.1 Redis 缓存

```python
# app/utils/cache.py
import json
from typing import Optional, Any
import redis.asyncio as redis
from app.config import settings

class CacheManager:
    """缓存管理器。"""
    
    def __init__(self):
        self.redis: redis.Redis | None = None
    
    async def init(self):
        """初始化 Redis 连接。"""
        self.redis = redis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True
        )
    
    async def close(self):
        """关闭连接。"""
        if self.redis:
            await self.redis.close()
    
    async def get(self, key: str) -> Optional[Any]:
        """获取缓存。"""
        if not self.redis:
            return None
        value = await self.redis.get(key)
        if value:
            return json.loads(value)
        return None
    
    async def set(self, key: str, value: Any, expire: int = 300):
        """设置缓存。"""
        if not self.redis:
            return
        await self.redis.set(key, json.dumps(value), ex=expire)
    
    async def delete(self, key: str):
        """删除缓存。"""
        if not self.redis:
            return
        await self.redis.delete(key)
    
    async def delete_pattern(self, pattern: str):
        """删除匹配模式的缓存。"""
        if not self.redis:
            return
        keys = await self.redis.keys(pattern)
        if keys:
            await self.redis.delete(*keys)

cache = CacheManager()
```

### 16.2 缓存装饰器

```python
# app/utils/cache_decorator.py
from functools import wraps
from typing import Callable
from app.utils.cache import cache

def cached(key_prefix: str, expire: int = 300):
    """缓存装饰器。"""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # 生成缓存键
            cache_key = f"{key_prefix}:{':'.join(str(arg) for arg in args)}"
            
            # 尝试从缓存获取
            cached_value = await cache.get(cache_key)
            if cached_value is not None:
                return cached_value
            
            # 执行函数
            result = await func(*args, **kwargs)
            
            # 存入缓存
            await cache.set(cache_key, result, expire)
            
            return result
        return wrapper
    return decorator

# 使用示例
@cached("user", expire=600)
async def get_user_by_id(user_id: int) -> User:
    """获取用户（带缓存）。"""
    return await user_repo.get(user_id)
```

### 16.3 缓存策略

| 场景 | 策略 | 过期时间 |
|------|------|----------|
| 用户信息 | Cache-Aside | 10 分钟 |
| 配置数据 | Cache-Aside | 1 小时 |
| 热门数据 | Write-Through | 5 分钟 |
| 计数器 | Increment | 不过期（或 24 小时） |
| Session | Write-Through | 30 分钟 |

---

## 十七、数据库迁移规范

### 17.1 Alembic 初始化

```bash
# 初始化 Alembic
alembic init alembic

# 配置 alembic.ini
# sqlalchemy.url = postgresql://user:password@localhost/dbname
```

### 17.2 生成迁移脚本

```bash
# 自动生成迁移
alembic revision --autogenerate -m "add user table"

# 创建空迁移
alembic revision -m "add index to user email"
```

### 17.3 迁移脚本规范

```python
# alembic/versions/xxx_add_user_table.py
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = 'abc123'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # 创建用户表
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('username', sa.String(length=50), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username')
    )
    
    # 创建索引
    op.create_index('ix_users_email', 'users', ['email'])
    op.create_index('ix_users_username', 'users', ['username'])

def downgrade() -> None:
    # 删除索引
    op.drop_index('ix_users_username', table_name='users')
    op.drop_index('ix_users_email', table_name='users')
    
    # 删除表
    op.drop_table('users')
```

### 17.4 迁移执行

```bash
# 查看当前版本
alembic current

# 查看迁移历史
alembic history

# 升级到最新版本
alembic upgrade head

# 回退一个版本
alembic downgrade -1

# 回退到指定版本
alembic downgrade abc123

# 标记当前版本（不执行迁移）
alembic stamp head
```

### 17.5 迁移最佳实践

1. **迁移脚本命名清晰**：使用描述性的迁移消息，如 `add_user_table`、`fix_order_status_enum`
2. **避免在生产环境使用 autogenerate**：生成的迁移应人工审核
3. **大表迁移分批执行**：避免长时间锁表
4. **测试回滚**：确保 downgrade 正确执行
5. **备份数据库**：执行迁移前先备份

---

## 十八、pre-commit 配置

### 18.1 安装配置

```bash
# 安装 pre-commit
pip install pre-commit

# 在项目中创建 .pre-commit-config.yaml
# 安装 git hooks
pre-commit install
```

### 18.2 .pre-commit-config.yaml

```yaml
# .pre-commit-config.yaml
repos:
  # 通用检查
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace       # 删除行尾空白
      - id: end-of-file-fixer         # 确保文件以换行结束
      - id: check-yaml                # YAML 语法检查
      - id: check-json                # JSON 语法检查
      - id: check-added-large-files   # 检查大文件
        args: ['--maxkb=500']
      - id: check-merge-conflict      # 检查合并冲突标记
      - id: debug-statements          # 检查调试语句
      - id: detect-private-key        # 检测私钥

  # Python 代码格式化
  - repo: https://github.com/psf/black
    rev: 24.10.0
    hooks:
      - id: black
        args: ['--config', 'pyproject.toml']

  # Import 排序
  - repo: https://github.com/pycqa/isort
    rev: 5.13.2
    hooks:
      - id: isort
        args: ['--settings-path', 'pyproject.toml']

  # 代码检查
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.8.0
    hooks:
      - id: ruff
        args: ['--fix']

  # 类型检查（可选）
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.13.0
    hooks:
      - id: mypy
        additional_dependencies:
          - types-redis
          - pydantic
        args: ['--config-file', 'pyproject.toml']
```

### 18.3 手动运行

```bash
# 对所有文件运行
pre-commit run --all-files

# 对暂存文件运行
pre-commit run

# 更新 hooks 版本
pre-commit autoupdate
```

---

## 十九、API 文档

FastAPI 自动生成 Swagger 和 ReDoc，访问地址：

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 二十、参考链接

- [FastAPI 官方文档](https://fastapi.tiangolo.com/zh/)
- [Pydantic 官方文档](https://docs.pydantic.dev/)
- [Uvicorn 官方文档](https://www.uvicorn.org/)
- [SQLAlchemy 官方文档](https://docs.sqlalchemy.org/)

---

## 附录：检查清单

**代码提交前：**

- [ ] 运行 `black .` 格式化代码
- [ ] 运行 `ruff check .` 检查代码规范
- [ ] 运行 `pytest` 确保测试通过
- [ ] 运行 `pre-commit run --all-files` 执行所有检查
- [ ] 更新相关文档

**Code Review 检查点：**

- [ ] 类型注解完整
- [ ] 错误处理覆盖（使用正确的异常状态码）
- [ ] 测试覆盖率达标
- [ ] 无敏感信息硬编码
- [ ] 文档注释清晰
- [ ] 依赖注入使用工厂函数
- [ ] 异步函数正确使用（I/O 操作用 async，CPU 密集用线程池）
- [ ] 日志记录规范（敏感信息脱敏）
- [ ] 数据库查询使用索引

**部署前检查：**

- [ ] 环境变量配置正确
- [ ] 数据库迁移脚本已测试
- [ ] Docker 镜像构建成功
- [ ] 健康检查接口正常
- [ ] 日志输出正常
- [ ] 监控和告警配置

---

*规范不是束缚，是协作的润滑剂。写清楚，让后来者能看懂，也是对团队负责。*
