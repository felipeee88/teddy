# Teddy API - Technical Challenge

API REST desenvolvida em .NET 8 com arquitetura em camadas para o desafio técnico da Teddy.

## 🎯 Requisitos Implementados

✅ JWT Authentication (sem senha, apenas nome)  
✅ Endpoints de Clientes (CRUD completo)  
✅ Paginação  
✅ Soft Delete  
✅ Contador de Acessos  
✅ Swagger em `/docs`  
✅ Healthcheck em `/healthz`  
✅ Logs estruturados (JSON)  
✅ Metrics Prometheus em `/metrics`  
✅ Docker + docker-compose  
✅ Testes Unitários  

## 🏗️ Arquitetura

```
Teddy/
├── Teddy.Domain/          # Entidades, abstrações, exceções
├── Teddy.Application/     # DTOs, Services, Validators, Interfaces
├── Teddy.Infra/          # DbContext, Repositories, EF Core
├── Teddy.IoC/            # Dependency Injection
├── Teddy.Api/            # Controllers, Middlewares
└── Teddy.Tests/          # Testes unitários
```

## 🚀 Como Executar

### Pré-requisitos

- .NET 8 SDK
- Docker e Docker Compose

### Opção 1: Com Docker Compose (Recomendado)

```bash
# Clone o repositório e navegue até a pasta
cd Teddy

# Copie o arquivo de variáveis de ambiente
cp .env.example .env

# Suba os containers
docker-compose up --build

# A API estará disponível em http://localhost:3000
```

### Opção 2: Execução Local

```bash
# Instale as dependências
dotnet restore

# Configure a connection string no appsettings.json
# Certifique-se de ter um PostgreSQL rodando

# Execute as migrations
dotnet ef database update --project Teddy.Infra --startup-project Teddy.Api

# Execute a aplicação
dotnet run --project Teddy.Api
```

## 📚 Endpoints

### Authentication

#### POST /auth/login
Gera um token JWT (sem senha, apenas nome).

**Request:**
```json
{
  "name": "Felipe"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userName": "Felipe",
  "expiresIn": 3600
}
```

### Clients (Requer autenticação)

#### POST /clients
Cria um novo cliente.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "John Doe",
  "salary": 5000.00,
  "companyValue": 100000.00
}
```

#### GET /clients?page=1&pageSize=16
Lista clientes com paginação.

**Response:**
```json
{
  "items": [...],
  "page": 1,
  "pageSize": 16,
  "totalItems": 50,
  "totalPages": 4
}
```

#### GET /clients/{id}
Obtém um cliente por ID (incrementa contador de acessos).

#### PUT /clients/{id}
Atualiza um cliente existente.

#### DELETE /clients/{id}
Remove um cliente (soft delete).

## 📊 Observabilidade

### Swagger
Acesse a documentação interativa em: **http://localhost:3000/docs**

### Healthcheck
Verifique a saúde da aplicação em: **http://localhost:3000/healthz**

### Metrics (Prometheus)
Métricas disponíveis em: **http://localhost:3000/metrics**

### Logs
Logs estruturados em JSON no console.

## 🧪 Testes

Execute os testes unitários:

```bash
dotnet test
```

Os testes cobrem:
- AuthService (validações, geração de token)
- ClientService (CRUD, validações, soft delete, contador de acessos)
- Validators (validações de entrada)

## 🔐 Segurança

- JWT com validação de issuer, audience e assinatura
- Tokens expiram em 60 minutos (configurável)
- Endpoints protegidos por atributo `[Authorize]`

## 🗄️ Banco de Dados

- PostgreSQL 16
- EF Core com Migrations
- Soft Delete implementado via Query Filter
- Índices em campos principais

## 🛠️ Tecnologias

- .NET 8
- Entity Framework Core 8
- PostgreSQL
- FluentValidation
- Serilog (logs estruturados JSON)
- Prometheus.NET (métricas)
- Swagger/OpenAPI
- Docker & Docker Compose
- xUnit, Moq, FluentAssertions (testes)

## 📋 Variáveis de Ambiente

Edite o arquivo `.env`:

```env
# Database
POSTGRES_USER=teddy
POSTGRES_PASSWORD=teddy123
POSTGRES_DB=teddydb

# JWT
JWT_SECRET=SuperSecretKeyForJwtTokenGeneration123456789
JWT_ISSUER=TeddyApi
JWT_AUDIENCE=TeddyClient
JWT_EXPIRES_MINUTES=60
```

## 🔄 Migrations

Para criar uma nova migration:

```bash
dotnet ef migrations add MigrationName --project Teddy.Infra --startup-project Teddy.Api
```

Para aplicar migrations:

```bash
dotnet ef database update --project Teddy.Infra --startup-project Teddy.Api
```

## 📝 Convenções

- **Domain**: Entidades puras, sem dependências externas
- **Application**: Regras de negócio, DTOs, interfaces
- **Infrastructure**: Implementações de repositórios, DbContext
- **IoC**: Configuração de DI
- **API**: Controllers, middlewares, configurações

## ✅ Checklist de Qualidade

- [x] Arquitetura em camadas bem definida
- [x] SOLID e Clean Code
- [x] Testes unitários com boa cobertura
- [x] Logs estruturados
- [x] Tratamento de erros global
- [x] Validações com FluentValidation
- [x] Soft Delete
- [x] Documentação completa (Swagger)
- [x] Containerização (Docker)
- [x] Observabilidade (Health + Metrics)

## 👤 Autor

Desenvolvido para o desafio técnico Tech Lead da Teddy.

## 📄 Licença

Este projeto foi desenvolvido para fins de avaliação técnica.
