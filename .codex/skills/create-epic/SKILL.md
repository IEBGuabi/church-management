---
name: create-epic
description: Transforme uma ideia de produto em um épico claro, registre decisões e perguntas em aberto e avalie se há base suficiente para refinamento técnico.
metadata:
  short-description: Estruturar e avaliar épicos de produto
---

# Criar épico

Atue como Product Owner experiente. Receba um tema ou ideia ainda ampla e produza no projeto um documento de épico que ajude a equipe a tomar decisões futuras. Não converta a iniciativa em especificação técnica detalhada nem invente respostas para lacunas.

## Fluxo

1. Examine a estrutura do projeto e respeite convenções existentes para documentação de produto/épicos. Se não houver, use `docs/product/epics/<slug-do-epico>/epic.md`. Essa pasta é a raiz do épico; refinamentos e planos derivados pertencem abaixo dela, conforme as skills complementares.
2. Use o tema fornecido e o contexto disponível no repositório. Faça perguntas de esclarecimento somente quando uma resposta for indispensável para definir o propósito ou o limite do épico; caso contrário, documente a lacuna como pergunta aberta e prossiga.
3. Estruture o documento em português, salvo se o usuário pedir outro idioma. Inclua, conforme aplicável:
   - título, resumo, status de prontidão e data;
   - contexto/oportunidade e problema a resolver;
   - público/personas e necessidades;
   - resultados esperados e como reconhecer sucesso (indicadores sugeridos, sem metas inventadas);
   - escopo pretendido e fora de escopo conhecido;
   - premissas, restrições, dependências e riscos;
   - perguntas em aberto, cada uma com motivo e, quando útil, responsável sugerido;
   - avaliação de prontidão para refinamento técnico.
4. Marque `OK — pronto para refinamento técnico` apenas quando propósito/problema, público ou beneficiário, resultado esperado e limites iniciais estiverem compreensíveis, sem decisão de produto crítica pendente que possa alterar substancialmente a solução ou o escopo. Perguntas secundárias podem continuar abertas se não bloquearem esse trabalho.
5. Se algum critério essencial estiver ausente ou houver decisão crítica pendente, marque `PENDENTE — precisa de decisões de produto` e explique exatamente o que bloqueia e quais respostas são necessárias. Não marque OK por cortesia.
6. Salve o arquivo no destino escolhido. Não crie tarefas técnicas, histórias, requisitos de implementação ou integrações externas, a menos que o usuário peça.

## Seção de prontidão obrigatória

Finalize o épico com uma avaliação explícita, usando este formato:

### Prontidão para refinamento técnico
- **Status:** `OK — pronto para refinamento técnico` ou `PENDENTE — precisa de decisões de produto`
- **Justificativa:** evidências do próprio épico que sustentam o status.
- **Bloqueios:** decisões de produto que impedem o refinamento; use `Nenhum` se estiver OK.
- **Próximo passo:** refinamento técnico, se OK; caso contrário, responder às perguntas bloqueadoras.

Mantenha separadas as perguntas bloqueadoras das perguntas que podem ser respondidas durante ou após o refinamento. Ao concluir, informe o caminho do arquivo, o status e as principais perguntas que permanecem.
