# Teddy Front-end - Monorepo

Sistema de gerenciamento de clientes desenvolvido com Nx, React, Vite e TypeScript.

## 🚀 Tecnologias

- **Nx**: Monorepo tooling
- **React 18**: Framework UI
- **Vite**: Build tool
- **TypeScript**: Type safety
- **React Router DOM**: Roteamento
- **React Hook Form + Zod**: Formulários e validação
- **Zustand**: State management
- **Axios**: HTTP client
- **Vitest**: Testes unitários

## 📋 Funcionalidades

✅ Autenticação com JWT (gerado a partir do nome)  
✅ CRUD completo de clientes  
✅ Paginação e seleção de itens por página  
✅ Seleção de clientes favoritos com persistência  
✅ Modais para criar, editar e excluir  
✅ Interface responsiva  
✅ Guards de rotas privadas

## 🛠️ Instalação

```bash
npm install
```

## 💻 Desenvolvimento

```bash
npx nx serve teddy-front
```

Aplicação disponível em: `http://localhost:4200`

## 🏗️ Build

```bash
npx nx build teddy-front --prod
```

## 🧪 Testes

```bash
npx nx test teddy-front
```

## 🐳 Docker

```bash
cd apps/teddy-front
cp .env.example .env
docker compose up --build
```

Aplicação disponível em: `http://localhost`

## 🌍 Variáveis de Ambiente

```bash
VITE_API_URL=http://localhost:3000
```

## 📁 Estrutura

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

## 🔗 Rotas

- `/login` - Autenticação
- `/clients` - Listagem e CRUD
- `/selected-clients` - Favoritos

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/getting-started/tutorials/react-monorepo-tutorial?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
