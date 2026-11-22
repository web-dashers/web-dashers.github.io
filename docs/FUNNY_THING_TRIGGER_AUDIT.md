# Auditoria de triggers — Funny Thing (ID 111112593)

**Estado:** auditoria concluída; o 1819 foi ligado ao runtime e passou smoke test de carga/transição, mas sua semântica visual ainda não foi confirmada durante progresso normal. Esta página não significa que todos os efeitos restantes tenham sido implementados.

O payload baixado pelo proxy público do projeto contém 43.892 objetos e 35 IDs classificados como `trigger` no catálogo. Nove IDs já tinham um caminho de runtime no projeto: 899, 901, 1006, 1007, 1049, 1268, 1346, 1347 e 1612. A auditoria paralela autorizada analisou os 26 tipos restantes (26 chamadas concluídas, sem falhas), incluindo semântica, contagens, suporte existente e incertezas nos campos serializados.

## Resultados por ID

| ID | Tipo identificado | Instâncias no nível | Estado observado nesta auditoria |
|---:|---|---:|---|
| 914 | Texto personalizado | 20 | Renderização de texto já existe; não é ação autônoma de gameplay. Preservar campo 31, UTF-8/Base64, grupos e canais. |
| 1819 | BG Effect Off | 1 | Handler básico adicionado: progresso, toque (campo 11, ainda sem fixture independente), spawn por grupo e reset. O registro desta instância não traz campo 11; teste de progresso desliga partículas/trails do jogador sem tocar na física. A semântica visual durante avanço real ainda precisa de conferência. |
| 1913 | Zoom de câmera | 18 | Efeito de câmera sem handler; chave 371 é candidata ao zoom-alvo, 10 à duração e 30/85 ao easing; verificar contra fixture antes de afirmar fidelidade total. |
| 1914 | Static Camera | 5 | Sem handler; faltam mapeamentos confiáveis para Follow, Exit Static e restrições de eixo. |
| 1916 | Camera Offset | 4 | Sem handler; os campos crus foram observados, mas sua ligação a Offset X/Y, duração e easing não está confirmada. |
| 2016 | Camera Guide | 4 | Guia editorial do editor; não executar como efeito durante a partida. |
| 2062 | Edge Camera | 1 | Sem handler; documentação consultada identifica alvo no campo 51 e borda no 164 (1–4: esquerda/direita/cima/baixo); alvo 0 libera a borda. Validar a instância do nível. |
| 2065 | Spawn Particles | 117 | Sem handler; faltam mapeamento validado de Particle Group, Position Group, offsets, rotação/escala e flags. Não inferir campos pelo frame ou por dados opacos. |
| 2066 | Gravity | 2 | Sem handler; semântica geral documentada, mas intensidade e alvo não têm chaves brutas verificadas. |
| 2067 | Scale | 370 | Sem handler; a pesquisa reporta campos candidatos 51 (grupo-alvo), 71 (centro), 10 (duração), 150/151 (escalas X/Y) e key 11 (touch); validar antes de chamar isso de suporte completo. |
| 2899 | Game Options | 4 | Sem handler; opções de gameplay conhecidas em alto nível, mas não foi possível mapear chaves brutas às opções específicas. |
| 2903 | Gradient | 4 | Sem efeito runtime; campos crus permanecem sem schema verificado. |
| 2904 | Shader policy | 5 | Sem handler; opções de camadas/disable-all sem mapeamento bruto confirmado. |
| 2907 | Shock Line | 1 | Sem efeito de shader; parâmetros brutos não verificados. |
| 2911 | Chromatic Glitch | 1 | Sem efeito de shader; parâmetros brutos não verificados. |
| 2913 | Lens Circle | 4 | Sem efeito de shader; parâmetros brutos não verificados. |
| 2914 | Radial Blur | 4 | Sem efeito de shader; parâmetros brutos não verificados. |
| 2915 | Motion Blur | 32 | Sem efeito de shader; parâmetros brutos não verificados. |
| 2916 | Bulge | 3 | Sem efeito de shader; parâmetros brutos não verificados. |
| 3006 | Area Move | 28 | Sem handler; efeito espacial contínuo e não necessariamente um evento ao cruzar X; chaves brutas não mapeadas. |
| 3007 | Area Rotate | 4 | Sem handler; efeito espacial de área é distinto do Rotate legado; campos crus não mapeados. |
| 3008 | Area Scale | 10 | Sem handler; alvo/área/parâmetros não mapeados. |
| 3009 | Area Fade | 4 | Sem handler; alvo, centro, alcance e opacidades sem mapeamento bruto confirmado. |
| 3010 | Area Tint | 15 | Sem handler; alvo, canal e parâmetros HSV/intensidade sem mapeamento bruto confirmado. |
| 3016 | Advanced Follow | 2 | Sem handler; parâmetros de acompanhamento/grupos/prioridade não mapeados. |
| 3613 | UI Object Settings | 1 | Sem handler; atribuição permanente à camada de UI no início do nível. A auditoria encontrou 51=Group ID, 71=UI Target e 385/386=XRef/YRef; outros campos continuam desconhecidos. |

## Conclusão de implementação

A presença de `type: "trigger"`, do ícone de editor ou da preservação de `_raw` não equivale a executar um efeito. A cobertura solicitada exige subsistemas de câmera, física, transformação por grupos, partículas, configuração global, efeitos de tela e avaliação espacial contínua. Para muitos desses subsistemas, as fontes consultadas explicam a semântica dos controles, mas não a serialização numérica do objeto no payload. O 1819 tem agora um handler parcial, ainda sem validação visual no nível real.

Por segurança, não se deve inventar significado para chaves opacas (por exemplo, 155), nem afirmar suporte funcional para os 26 IDs enquanto o parsing, execução e validação visual/temporal não estiverem implementados. A documentação disponível recomenda preservar os campos desconhecidos, separar a visualização editorial do runtime e validar cada efeito com fixtures conhecidas do Geometry Dash.

## Validação realizada nesta sessão

- `node --check` passou em `game-scene.js`, `level.js`, `player.js`, `level-editor.js` e `performance-optimizer.js`; `git diff --check` também passou.
- No browser, `parseLevel()` decodificou 43.892 objetos e encontrou uma instância do ID 1819. O jogo chegou à página online “Funny Thing” e a partida carregou como `online_111112593`; o runtime registrou 1 trigger 1819.
- Teste de limite: antes de x=17.070 o estado não mudava; em x=17.070 o estado passou a desativado. O reset o reativou. Durante o teste, partículas, streak e wave trail ficaram parados, e `y`/`yVelocity` permaneceram idênticos.
- Esse smoke test exercitou a transição chamando o handler no limite; não confirma a aparência nem a temporização do efeito ao jogar naturalmente. Os outros triggers sem handler continuam sem suporte declarado.

## Fontes

- Geometry Dash Editor Guide (RobTop): https://www.robtopgames.com/files/GDEditor.pdf
- Geometry Dash Wiki — Triggers: https://geometrydash.wiki.gg/wiki/Triggers
- Geometry Dash Creator School (guias de câmera, escala, partículas, áreas e shaders): https://www.gdcreatorschool.com/docs/guides/triggers-1/
- Implementação aberta G.js para o Edge Trigger: https://github.com/g-js-api/G.js
- Os detalhes por ID e as fontes específicas estão registrados na síntese da auditoria de pesquisa executada para esta tarefa.
