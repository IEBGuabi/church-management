---
name: refine-epic
description: Produza um plano de refinamento técnico detalhado a partir de um épico existente, alinhado à arquitetura e às ferramentas do repositório, com perguntas em aberto e avaliação de prontidão para execução.
metadata:
  short-description: Refinar tecnicamente um épico
---

# Refinar épico tecnicamente

Atue como Staff Software Engineer responsável por transformar a intenção de produto de um épico em uma abordagem técnica implementável, coerente com a arquitetura existente e com espaço para evolução. Responda como a iniciativa será construída: componentes, estruturas, ferramentas, dados, contratos e sequência de implementação. Não implemente o épico ao produzir o refinamento.

## Encontrar a referência e o destino

1. Use o caminho do épico informado pelo usuário. Se receber somente um nome/tema, procure em `docs/product/epics/` e use a correspondência inequívoca. O documento de origem é `docs/product/epics/<slug-do-epico>/epic.md`. Se houver mais de uma correspondência ou nenhuma, peça o caminho correto; não crie uma referência presumida.
2. Leia o épico completo, incluindo estado de prontidão e perguntas em aberto. Se houver código ou documentação pertinente no repositório, inspecione-os para confirmar padrões e restrições atuais.
3. Cada alternativa/versão de abordagem técnica é um refinamento independente. Escolha um slug curto e descritivo a partir do nome informado pelo usuário ou do foco da abordagem; crie o arquivo em `docs/product/epics/<slug-do-epico>/refinements/<slug-do-refinamento>/refinement.md`. Se o usuário indicar um refinamento existente para atualizar, preserve seu slug e edite somente esse `refinement.md`. Se não indicar e já houver refinamentos, crie um novo diretório com slug não utilizado; nunca substitua outro refinamento. Não crie uma pasta `plans` vazia: a skill de planejamento a cria quando houver o primeiro plano.

## Como elaborar

- Separe fatos encontrados no épico/repositório de decisões propostas e hipóteses. Não transforme hipótese em requisito nem invente respostas de produto.
- Proponha a solução no nível adequado ao épico. Evite especificação prematura e mudanças sem benefício claro.
- Siga os limites arquiteturais e convenções existentes. Neste repositório, confirme o código antes de recomendar estruturas: há separação entre `domain`, `application`, `infrastructure` e `presentation`; o fluxo HTTP é rota → controller → serviço; casos de uso não devem depender diretamente do Fastify; a persistência usa PostgreSQL. Reutilize os contratos e adaptadores existentes quando apropriado, sem forçar essas convenções se o código tiver evoluído.
- Explique decisões relevantes e trade-offs. Recomende ferramentas e bibliotecas já adotadas sempre que adequadas; se sugerir uma dependência ou ferramenta nova, explique a necessidade e considere custo de manutenção e alternativas.
- Faça perguntas para decisões técnicas ou de produto que não estejam definidas. Classifique cada pergunta como bloqueadora ou não bloqueadora e explique o impacto da resposta. Não pare o trabalho por lacunas que possam ser claramente isoladas; documente premissas provisórias sem apresentá-las como fatos.
- Não faça alterações no código, banco, serviços externos ou configurações de execução. O único artefato a criar/editar nesta tarefa é o documento de refinamento solicitado.

## Conteúdo do documento

Adapte as seções ao escopo; omita as que não se aplicam e explique lacunas relevantes. Inclua:

1. Título, referência/caminho do épico, data e status de prontidão para execução.
2. Resumo técnico e vínculo com os resultados e limites do épico.
3. Contexto técnico observado: componentes, padrões existentes e restrições relevantes, com caminhos de arquivos quando úteis.
4. Abordagem proposta: módulos/componentes envolvidos e suas responsabilidades, fluxo principal da operação e integrações.
5. Dados: entidades/tabelas afetadas, relações, regras de integridade, migração e estratégia de compatibilidade, conforme aplicável.
6. Interfaces: rotas/contratos de API, eventos ou contratos internos, validações e formatos de erro, conforme aplicável.
7. Segurança, privacidade, autorização, observabilidade, desempenho e resiliência quando pertinentes ao domínio.
8. Plano de implementação em etapas ordenadas, com áreas/arquivos prováveis e dependências entre etapas. Identifique quais detalhes ainda precisam ser confirmados no momento da implementação.
9. Estratégia de verificação: comportamentos e cenários que deverão ser cobertos por testes e verificações, sem executar testes como parte do refinamento.
10. Riscos, alternativas consideradas e perguntas em aberto, indicando bloqueio e impacto.

## Critério de prontidão

Marque `OK — pronto para execução` somente quando o objetivo e os limites do épico forem implementáveis, a abordagem e as responsabilidades estiverem claras, as mudanças de dados/interfaces relevantes estiverem descritas, e não houver decisão bloqueadora de produto ou arquitetura. Questões não bloqueadoras podem permanecer abertas se forem isoláveis e tiverem encaminhamento claro.

Se faltar informação essencial, houver incompatibilidade não resolvida com a arquitetura ou uma decisão bloqueadora puder alterar substancialmente a implementação, marque `PENDENTE — precisa de esclarecimentos` e liste as perguntas que bloqueiam. Não use OK como aprovação genérica nem infira respostas de produto. O refinamento pode descrever alternativas para uma decisão pendente, deixando explícito o que depende da escolha.

Finalize o documento com:

### Prontidão para execução
- **Status:** `OK — pronto para execução` ou `PENDENTE — precisa de esclarecimentos`
- **Justificativa:** evidências do épico, do repositório e da abordagem técnica.
- **Bloqueios:** perguntas/decisões que impedem começar; `Nenhum` se estiver OK.
- **Próximo passo:** iniciar implementação, se OK; caso contrário, resolver os bloqueios.

Ao concluir, informe o caminho do arquivo, incluindo o slug do refinamento, status e perguntas bloqueadoras remanescentes.
