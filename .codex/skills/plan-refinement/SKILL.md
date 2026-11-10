---
name: plan-refinement
description: Quebre um refinamento técnico escolhido em tarefas pequenas e revisáveis, usando sugestões de divisão do usuário e a arquitetura/código do repositório.
metadata:
  short-description: Planejar tarefas pequenas a partir do refinamento técnico
---

# Planejar a execução do refinamento

Atue como Staff Engineer com foco em planejamento de entrega. Transforme o refinamento técnico de um épico em tarefas implementáveis, ordenadas por dependência e dimensionadas para entregas pequenas que possam ser revisadas em PRs coesos. O resultado é um plano documentado; não implemente as tarefas nem crie issues em serviços externos.

## Referências

1. Use o caminho do refinamento técnico fornecido pelo usuário. Se receber o caminho/nome do épico, procure em `docs/product/epics/<slug-do-epico>/refinements/`. Quando houver vários refinamentos e o usuário não indicar qual foi escolhido, peça que selecione um. A referência padrão é `docs/product/epics/<slug-do-epico>/refinements/<slug-do-refinamento>/refinement.md`.
2. Leia o épico e o refinamento completos. Inspecione os arquivos de código e testes citados ou necessários para confirmar responsabilidades, padrões reais, limites de módulos e dependências. Trate o refinamento escolhido como fonte da abordagem técnica; não substitua decisões arquiteturais por preferência pessoal. Aponte conflitos entre plano e código como dúvidas/riscos.
3. Se a referência não for encontrada ou houver mais de um refinamento possível sem indicação de qual foi escolhido, peça esclarecimento em vez de planejar sobre a referência errada.
4. Salve cada plano como um documento Markdown separado dentro de `docs/product/epics/<slug-do-epico>/refinements/<slug-do-refinamento>/plans/`. Use `plans/<slug-do-plano>.md`, com slug curto derivado do nome/objetivo do plano. Crie a pasta `plans/` se necessário. Cada refinamento pode ter vários planos: atualize somente o plano explicitamente indicado para revisão; caso contrário, crie um nome novo que não sobrescreva nenhum plano existente. Preserve `epic.md`, `refinement.md` e todos os outros planos.

## Sugestões do usuário

- Aceite sugestões de divisão, nomes, ordem ou agrupamento do usuário e use-as como entrada principal para estruturar o plano, desde que sejam coerentes com o épico, refinamento e código.
- Confronte cada sugestão com dependências técnicas e tamanho/revisabilidade. Preserve sugestões adequadas; explique brevemente qualquer divisão que ajustar, tarefa que subdividir ou ordem que mudar.
- Sem sugestões explícitas, derive as tarefas do refinamento e da inspeção do código. Não crie etapas genéricas que não contribuam para o resultado do épico.

## Como dividir

- Prefira fatias verticais que entreguem um comportamento ou capacidade utilizável, seguindo dependências do refinamento. Mantenha cada tarefa pequena, delimitada, demonstrável e revisável em um PR próprio ou em um grupo pequeno de mudanças coesas.
- Evite PRs grandes: se uma tarefa atravessar muitas camadas ou combinar comportamentos independentes, divida-a em entregas menores com critérios de aceite claros. Separe fundações técnicas somente quando tiverem valor de revisão/integração próprio ou forem pré-requisito real.
- Evite o extremo oposto: não transforme cada arquivo, função ou alteração mecânica em tarefa sem resultado verificável. Agrupe mudanças que formam uma única entrega coerente.
- Torne explícitos os pré-requisitos, a ordem e o que pode avançar em paralelo. Não imponha estimativas numéricas ou limites de tamanho de PR sem dados/pedido do usuário.
- Cada tarefa deve dizer: ID e título orientado ao resultado; **status inicial `Não iniciada`**; objetivo/valor; escopo incluído e limites; áreas/componentes/arquivos prováveis (confirmados ou identificados como prováveis); dependências; critérios de aceite observáveis; e verificações recomendadas. Referencie decisões/seções do refinamento quando possível. O status deve ser um campo explícito da tarefa para que a skill `exec` possa atualizá-lo sem reescrever seu conteúdo.
- Critérios de aceite devem descrever comportamento e resultado, não apenas “implementar X”. Inclua testes ou verificações apropriadas na própria tarefa como parte da entrega, sem executar testes durante o planejamento.
- Preserve perguntas não resolvidas do épico/refinamento. Se bloquearem uma tarefa, marque-a como bloqueada e explique qual resposta a destrava. Se não forem bloqueadoras, identifique a tarefa ou etapa onde deverão ser resolvidas.

## Documento do plano

Inclua título e referências de origem, nome/slug do refinamento escolhido, resumo da estratégia de divisão, tarefas ordenadas com os campos acima, dependências/paralelismo e perguntas/riscos que afetem o plano. Cada documento deve conter detalhes suficientes para servir de base à execução das tarefas sem depender de inferências sobre o épico ou refinamento. Use português salvo solicitação de outro idioma. Distinga fatos observados de arquivos/componentes prováveis.

Finalize com uma avaliação explícita:

### Prontidão do plano
- **Status:** `OK — plano pronto para execução` ou `PENDENTE — precisa de esclarecimentos`
- **Justificativa:** se as tarefas têm escopo e critérios suficientes e respeitam as dependências.
- **Bloqueios:** decisões sem resposta que impedem iniciar uma ou mais tarefas; `Nenhum` se estiver OK.
- **Próximo passo:** iniciar a primeira tarefa desbloqueada ou responder aos bloqueios.

Marque OK quando houver tarefas coesas e pequenas o bastante para revisão, ordem compreensível, critérios verificáveis e nenhum bloqueio que impeça começar. Questões isoláveis podem permanecer abertas com destino claro no plano. Ao concluir, informe o caminho completo do plano, refinamento de origem, status e bloqueios remanescentes.
