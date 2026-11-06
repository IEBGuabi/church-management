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
  application/       # casos de uso e portas (interfaces)
  config/            # validação e configuração
  domain/            # erros, entidades e regras do domínio
  infrastructure/    # adaptadores de banco e framework HTTP
  presentation/      # rotas e handlers independentes do framework
```

O fluxo HTTP segue `rota → controller → serviço`: o adaptador converte a requisição Fastify para `HttpRequest`, o controller pode validá-la ou transformá-la antes de chamar o serviço, e a resposta volta pelo contrato `HttpResponse`. `HttpApplicationFactory.createApp` recebe a porta `HttpServerFactory`; os controllers e casos de uso não importam Fastify. `FastifyHttpServer` implementa essa porta e traduz erros do framework para `SystemError`, que é independente do adaptador. Outro framework pode substituir Fastify implementando a mesma interface.

O health check usa `HealthDependency`: cada integração fornece um adaptador próprio, e o serviço de aplicação agrega os resultados. Para adicionar um serviço monitorado, implemente essa interface e registre-o na inicialização.

Aliases TypeScript: `@/config/*`, `@/domain/*`, `@/application/*`, `@/infrastructure/*` e `@/presentation/*`. O build reescreve os aliases para que também funcionem no Node após a compilação.
