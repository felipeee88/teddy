# Teddy Front-end

Front-end do sistema de gerenciamento de clientes Teddy, desenvolvido com Nx, React, Vite e TypeScript.

## Tecnologias

- Nx (Monorepo)
- React 18
- Vite
- TypeScript
- React Router DOM
- React Hook Form + Zod
- Zustand
- Axios

## Funcionalidades

- Autenticação com JWT (gerado a partir do nome)
- CRUD de clientes com paginação
- Seleção e gerenciamento de clientes favoritos
- Interface responsiva
- Persistência de dados selecionados

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npx nx serve teddy-front
```

O app estará disponível em `http://localhost:4200`

## Build

```bash
npx nx build teddy-front --prod
```

## Testes

```bash
npx nx test teddy-front
```

## Docker

```bash
cd apps/teddy-front
cp .env.example .env
docker compose up --build
```

O app estará disponível em `http://localhost`

## Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```
VITE_API_URL=http://localhost:3000
```

## Estrutura do Projeto

```
apps/teddy-front/src/
├── app/
│   ├── guards/          # Proteção de rotas
│   ├── layouts/         # Layouts principais
│   └── routes/          # Configuração de rotas
├── features/
│   ├── auth/           # Autenticação
│   ├── clients/        # Gerenciamento de clientes
│   └── selected-clients/ # Clientes selecionados
└── shared/
    ├── components/     # Componentes reutilizáveis
    ├── lib/           # Utilitários e stores
    └── styles/        # Estilos globais
```

## Rotas

- `/login` - Tela de login
- `/clients` - Listagem e gerenciamento de clientes
- `/selected-clients` - Clientes selecionados
