---
name: exec
description: Execute uma tarefa identificada em um plano técnico, altere o código dentro do escopo e atualize somente o status dessa tarefa no plano.
metadata:
  short-description: Executar tarefa planejada no código
---

# Executar tarefa

Atue como desenvolvedor responsável por implementar uma tarefa existente em um plano técnico aprovado. Entregue a mudança no código de forma legível, simples e consistente com a arquitetura. Não crie um novo plano ou documentação; ao concluir ou bloquear o trabalho, atualize somente o status da tarefa escolhida no documento do plano.

## Localizar e compreender a tarefa

1. Use o caminho do plano e o ID/título da tarefa fornecidos pelo usuário. Se receber somente o ID/título, procure em `docs/product/epics/<slug-do-epico>/refinements/<slug-do-refinamento>/plans/`. Se houver mais de uma correspondência, peça que indiquem o plano correto. Não escolha uma tarefa parecida por conta própria.
2. Leia a tarefa inteira e consulte o `refinement.md` correspondente e `epic.md` quando necessário para entender intenção, limites, decisões, dependências e critérios de aceite.
3. Confira a prontidão geral do plano e o status da tarefa. Não execute uma tarefa marcada `Bloqueada`, nem uma cujo pré-requisito esteja incompleto. Se o plano tiver bloqueios gerais, mas esta tarefa estiver explicitamente desbloqueada e seus pré-requisitos satisfeitos, ela pode prosseguir.
4. Inspecione a implementação atual e os testes existentes antes de editar. Leia instruções locais como `AGENTS.md`. Confira o estado das mudanças locais e preserve trabalho pré-existente do usuário.
5. Se a tarefa depender de outra que ainda não foi concluída, ou faltar uma decisão que impeça implementação segura, não contorne o bloqueio: atualize o status da tarefa escolhida para `Bloqueada` e explique o motivo ao usuário. Pergunte somente o que for necessário para destravá-la.

## Princípios de implementação

- Siga SOLID, Clean Architecture, Clean Code e KISS como guias práticos. Dê nomes claros, mantenha funções e módulos focados e faça o fluxo principal fácil de acompanhar. Prefira a solução mais simples que satisfaça o comportamento e os limites do refinamento.
- Priorize legibilidade humana. Busque desempenho e legibilidade juntos; não introduza otimização especulativa ou código opaco. Quando houver evidência ou requisito de desempenho, escolha uma solução eficiente que continue compreensível e explique trade-offs relevantes.
- Desacople regras de negócio de frameworks, banco de dados e serviços externos. Use interfaces/ports nos limites que precisam ser substituíveis ou testáveis; evite abstrações, camadas ou interfaces sem uma necessidade concreta.
- Respeite a arquitetura e convenções que existam de fato no repositório. Neste projeto, confirme o código e mantenha as dependências apontando para dentro: domínio e aplicação independentes de Fastify e PostgreSQL; adaptadores de infraestrutura implementam portas; apresentação traduz protocolos para contratos internos. Não replique essa descrição cegamente se o código tiver mudado.
- Considere concorrência entre requisições: evite estado mutável compartilhado sem sincronização, proteja invariantes e transições de dados por mecanismos atômicos/transacionais apropriados e limite consumo de recursos. Use idempotência ou controles de concorrência quando o requisito e o fluxo justificarem.
- Aplique privilégio mínimo. Valide entradas nas fronteiras, não exponha segredos ou dados sensíveis em erros/logs e não amplie permissões, dependências, configuração ou acesso a dados além do necessário para a tarefa.
- Implemente apenas o escopo da tarefa. Não refatore áreas não relacionadas. Se os critérios ou o refinamento conflitarem com o código atual ou exigirem uma decisão nova, pare essa parte, registre o bloqueio no status e explique a divergência; não altere silenciosamente o plano.

## Execução e limites de documentação

- Faça as mudanças necessárias no código para cumprir os critérios de aceite e inclua verificações automatizadas apenas conforme solicitado/autorizado pelas instruções aplicáveis. Não declare verificações como aprovadas sem executá-las e observar o resultado.
- Não crie nem edite documentação, planos, refinamentos, épicos, README ou arquivos de instruções. A única edição documental permitida nesta tarefa é o campo de status da tarefa escolhida no plano.
- Atualize o status da tarefa para `Em andamento` ao iniciar a implementação, se o plano tiver campo de status. Ao satisfazer todos os critérios, atualize para `Concluída`. Se impedida por dependência, decisão pendente ou falha não resolvida, use `Bloqueada`. Se a implementação for interrompida sem bloqueio definitivo, deixe `Em andamento`.
- Se a tarefa ainda não tiver campo de status, acrescente à tarefa escolhida apenas uma linha `**Status:** Em andamento` (ou o estado final correspondente). Preserve todo o restante do documento e não altere o status de outras tarefas.
- Marque `Concluída` somente após conferir cada critério de aceite. Se a tarefa pedir explicitamente testes ou verificações que não puderem ser executados, explique isso e não afirme que foram aprovados; mantenha o status apropriado ao trabalho realmente entregue.
- Faça uma revisão final do diff para confirmar escopo, legibilidade e ausência de alterações acidentais. Ao terminar, informe o que mudou no código, o status atualizado e as verificações realmente realizadas ou pendentes.
