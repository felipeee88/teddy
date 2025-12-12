Desafio Técnico – Tech Lead Pleno | Teddy Open Finance
Visão Geral

Este repositório contém um MVP full-stack para gestão de clientes, desenvolvido como monorepo Nx, com autenticação via JWT, CRUD completo, dashboard administrativo e observabilidade básica.
O projeto está preparado para execução local via Docker e segue boas práticas de arquitetura, testes e padronização.

Arquitetura Geral

Monorepo gerenciado com Nx

Front-end desacoplado do back-end

Comunicação via API REST

Persistência em PostgreSQL

Autenticação baseada em JWT

Visão Local

Front-end: http://localhost:5173

Back-end: http://localhost:3000

Swagger: http://localhost:3000/docs

Healthcheck: http://localhost:3000/healthz

Estrutura do Repositório
/
├─ front-end/
│  ├─ docker-compose.yml
│  ├─ .env.example
│  ├─ README.md
│  └─ src/
│
├─ back-end/
│  ├─ docker-compose.yml
│  ├─ .env.example
│  ├─ README.md
│  └─ src/
│
├─ nx.json
├─ package.json
└─ README.md

Funcionalidades (MVP)

Autenticação por e-mail e senha (JWT)

CRUD de clientes com soft delete

Dashboard administrativo com:

Total de clientes

Últimos clientes cadastrados

Gráfico simples

Contador de acessos no detalhe do cliente

Auditoria com timestamps (createdAt, updatedAt, deletedAt)

Front-End

React + Vite + TypeScript

UI responsiva

Roteamento por página

Formulários com validação

Consumo de API autenticada via JWT

Testes unitários

Docker para execução isolada

Detalhes adicionais no front-end/README.md.

Back-End

NestJS modular

TypeORM + PostgreSQL

Autenticação JWT

Validação de dados

Swagger para documentação da API

Logs estruturados

Endpoint de healthcheck

Endpoint de métricas

Docker para execução isolada

Endpoints Principais

POST /auth/login

POST /clients

GET /clients

GET /clients/:id

PUT /clients/:id

DELETE /clients/:id

GET /healthz

Detalhes adicionais no back-end/README.md.

Observabilidade

Logs estruturados em JSON

Healthcheck para monitoramento de disponibilidade

Endpoint de métricas compatível com Prometheus

Estrutura preparada para evolução com OpenTelemetry

Testes e Qualidade

Testes unitários no front-end e back-end

ESLint e Prettier

Commits semânticos

Pipelines separados para build e testes via Nx

Execução Local

Clonar o repositório

Configurar os arquivos .env a partir dos .env.example

Subir os serviços:

docker-compose up


Acessar a aplicação pelos endpoints descritos acima

Considerações Finais

Este projeto foi estruturado priorizando clareza arquitetural, separação de responsabilidades, facilidade de execução local e base sólida para evolução em ambiente cloud.

Se quiser, no próximo passo eu posso:

Ajustar o README para tom mais técnico ou mais executivo

Criar a versão README do front e README do back

Enxugar ainda mais para algo “one-page” estilo avaliação rápida de recrutador
