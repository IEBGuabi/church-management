# Church Management

API para gerenciamento de igrejas, preparada para evoluir com módulos de membros, visitantes, contribuições, eventos e outros domínios.

## Requisitos

- Node.js `24.11.1`
- Docker e Docker Compose

## Desenvolvimento

1. Copie `.env.example` para `.env` e ajuste as configurações, se necessário.
2. Instale as dependências com `npm install`.
3. Inicie os serviços com `docker compose up --build`.
4. Acesse `http://localhost:3000/health`.

O Compose inicia o PostgreSQL e a API. O serviço PostgreSQL existe somente no Compose: a imagem final do `Dockerfile` contém apenas a aplicação Node.

## Build e release

```sh
npm ci
npm run build
docker build --target production -t church-management:latest .
```

Configure `DATABASE_URL`, `PORT`, `HOST`, `DB_POOL_MAX` e `NODE_ENV` no ambiente do container de produção. O Zod valida as variáveis obrigatórias antes que a aplicação abra a porta HTTP.

## Estrutura

```text
src/
  application/       # casos de uso
  config/            # validação e configuração
  domain/            # entidades e regras do domínio
  infrastructure/    # banco e integrações externas
  presentation/      # HTTP, rotas e handlers
```

Aliases TypeScript: `@/config/*`, `@/domain/*`, `@/application/*`, `@/infrastructure/*` e `@/presentation/*`.
