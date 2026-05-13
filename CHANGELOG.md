# Histórico de Versões

Todas as mudanças relevantes da `acessibilidade-br` serão documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e a biblioteca usa [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [1.0.1] — 2026-05-13

### Corrigido

- **Bug crítico em "Inverter Cores" e "Tons de Cinza":** o widget perdia `position: fixed` quando o filtro era ativado (rolava com a página em vez de ficar fixo na tela). Causa: aplicar `filter` no `<html>` quebra o "containing block" dos elementos descendentes com `position: fixed`. Solução: os filtros agora são aplicados num wrapper interno `.acb-content` que envolve o conteúdo do site, deixando o widget como **irmão** desse wrapper (filho direto do `<body>`) — assim o widget permanece imune ao `filter`.

### Melhorado

- **Fonte para Dislexia:** agora carrega o **OpenDyslexic real** via jsDelivr CDN (`open-dyslexic@1.0.3`), em vez de depender da fonte estar instalada no sistema do usuário. Inclui as 4 variantes (Regular, Bold, Italic, BoldItalic) com `font-display: swap` para evitar flash de texto invisível. O navegador só baixa a fonte quando a classe `.acb-dyslexia` é ativada — sites que não usam a função não pagam custo de banda.
- **MutationObserver** automático no `<body>`: novos elementos adicionados dinamicamente após a inicialização (modais Bootstrap, toasts, portals React) são automaticamente movidos para dentro do wrapper `.acb-content`, garantindo que o filtro também os afete.

---

## [1.0.0] — 2026-05-13

### Adicionado

- Lançamento inicial da biblioteca
- Widget flutuante com botão de acessibilidade
- 12 ferramentas de acessibilidade em português:
  - Aumentar / Diminuir Texto (6 níveis de escala)
  - Aumentar / Diminuir Espaçamento (letter-spacing, word-spacing, line-height)
  - Inverter Cores
  - Tons de Cinza
  - Sublinhar Links
  - Fonte para Dislexia (OpenDyslexic + fallback)
  - Posicionamento (rotação entre 4 cantos da tela)
  - Cursor Grande (SVG inline)
  - Guia de Leitura (janela horizontal que segue o mouse)
  - Texto para Fala (Web Speech API, padrão pt-BR)
- Persistência de preferências via `localStorage`
- Botão "Redefinir tudo"
- Suporte a teclado: ESC fecha o painel, foco visível
- Atributos `aria-*` em todos os elementos interativos
- Build UMD (funciona como `<script>`, CommonJS e AMD)
- Zero dependências externas
- Página de demonstração (`demo.html`)
- Documentação completa: README, API, Publicação, Integração
