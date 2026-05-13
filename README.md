# acessibilidade-br

[![npm version](https://img.shields.io/npm/v/acessibilidade-br.svg)](https://www.npmjs.com/package/acessibilidade-br)
[![license](https://img.shields.io/npm/l/acessibilidade-br.svg)](LICENSE)
[![vanilla JS](https://img.shields.io/badge/vanilla-JS-yellow.svg)](#)

Widget flutuante de acessibilidade web em português. Adiciona **12 ferramentas de acessibilidade** a qualquer site com um único `<script>` ou via `npm install`.

Funciona em qualquer stack: **PHP, Laravel, WordPress, Django, Flask, Spring Boot, Rails, Angular, React, Vue, Next.js, Svelte** — tudo. O widget roda inteiramente no navegador, sem dependências de backend.

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Instalação rápida](#instalação-rápida)
- [Como inicializar](#como-inicializar)
- [Opções de configuração](#opções-de-configuração)
- [API pública](#api-pública)
- [Personalização visual](#personalização-visual)
- [Compatibilidade](#compatibilidade)
- [Documentação completa](#documentação-completa)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Licença](#licença)

---

## Funcionalidades

O widget oferece 12 ferramentas de acessibilidade, todas em português:

| # | Ferramenta | O que faz |
|---|------------|-----------|
| 1 | **Aumentar Texto** | Escala a fonte da página em até +50% (6 níveis) |
| 2 | **Diminuir Texto** | Reduz a fonte da página (até −20%) |
| 3 | **Aumentar Espaçamento** | Aumenta letter-spacing, word-spacing e line-height |
| 4 | **Diminuir Espaçamento** | Reduz espaçamentos |
| 5 | **Inverter Cores** | Aplica `filter: invert()` mantendo imagens com cores naturais |
| 6 | **Tons de Cinza** | Converte a página inteira para escala de cinza |
| 7 | **Sublinhar Links** | Força `text-decoration: underline` em todos os `<a>` |
| 8 | **Fonte para Dislexia** | Aplica a fonte OpenDyslexic (fallback: Comic Sans, Verdana) |
| 9 | **Posicionamento** | Alterna o botão flutuante entre os 4 cantos da tela |
| 10 | **Cursor Grande** | Substitui o cursor por um SVG ampliado |
| 11 | **Guia de Leitura** | Janela horizontal que segue o mouse e escurece o restante |
| 12 | **Texto para Fala** | Lê em voz alta qualquer elemento clicado (Web Speech API) |

**Extras:**
- Botão **"Redefinir tudo"** para zerar todas as configurações
- **Preferências salvas** em `localStorage` (persistem entre visitas)
- **Acessível por teclado** (ESC fecha o painel, `aria-*` em todos os botões)
- **Sem conflito de CSS** — todas as classes têm prefixo `.acb-`
- **Zero dependências** — vanilla JS puro, ~19 KB não minificado

---

## Instalação rápida

### Via NPM (Angular, React, Vue, Next.js, Svelte)

```bash
npm install acessibilidade-br
```

```javascript
import Acessibilidade from 'acessibilidade-br';
import 'acessibilidade-br/dist/acessibilidade.css';

new Acessibilidade();
```

### Via CDN (PHP, Java, Django, WordPress, Laravel, HTML puro)

```html
<!-- No <head> -->
<link rel="stylesheet" href="https://unpkg.com/acessibilidade-br@1.0.1/dist/acessibilidade.css">

<!-- Antes do </body> -->
<script src="https://unpkg.com/acessibilidade-br@1.0.1/dist/acessibilidade.js"></script>
<script>new Acessibilidade();</script>
```

Alternativa com jsDelivr:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/acessibilidade-br@1.0.1/dist/acessibilidade.css">
<script src="https://cdn.jsdelivr.net/npm/acessibilidade-br@1.0.1/dist/acessibilidade.js"></script>
<script>new Acessibilidade();</script>
```

### Auto-hospedado (intranet / offline)

Baixe os dois arquivos de `dist/` e inclua localmente:

```html
<link rel="stylesheet" href="/assets/css/acessibilidade.css">
<script src="/assets/js/acessibilidade.js"></script>
<script>new Acessibilidade();</script>
```

Para exemplos detalhados por framework, veja **[docs/INTEGRACAO.md](docs/INTEGRACAO.md)**.

---

## Como inicializar

A forma mais simples — uma linha:

```javascript
new Acessibilidade();
```

Com configurações:

```javascript
new Acessibilidade({
  posicaoInicial:     'bottom-right', // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  salvarPreferencias: true,           // salvar configurações no localStorage
  idiomaTTS:          'pt-BR',        // idioma do leitor de voz (BCP-47)
  autoInit:           true            // inicializa automaticamente ao carregar o DOM
});
```

---

## Opções de configuração

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `autoInit` | `boolean` | `true` | Inicializa automaticamente no `DOMContentLoaded`. Se `false`, chame `.init()` manualmente |
| `salvarPreferencias` | `boolean` | `true` | Salva configurações em `localStorage` para persistir entre visitas |
| `idiomaTTS` | `string` | `"pt-BR"` | Código BCP-47 do idioma da síntese de voz (ex: `"en-US"`, `"es-ES"`) |
| `posicaoInicial` | `string\|null` | `null` | Força a posição inicial do botão, ignorando o valor salvo no localStorage |

---

## API pública

```javascript
const a11y = new Acessibilidade();

a11y.init();       // inicializa manualmente (quando autoInit: false)
a11y.abrir();      // abre o painel de ferramentas
a11y.fechar();     // fecha o painel
a11y.redefinir();  // restaura todas as configurações para o padrão
a11y.destroy();    // remove completamente o widget e todos os seus efeitos

a11y.estado;       // objeto com o estado atual (somente leitura)
a11y.aberto;       // boolean — indica se o painel está aberto
```

Referência completa em **[docs/API.md](docs/API.md)**.

---

## Personalização visual

Todas as classes do widget têm prefixo `.acb-`. Para mudar a cor primária (padrão: azul `#1e6bb8`), adicione no seu CSS:

```css
/* Botão flutuante e cabeçalho do painel */
.acb-toggle,
.acb-header {
  background: #d4006a !important;
}

/* Botão de ferramenta ativo */
.acb-item.acb-active {
  background: #f8d7e6 !important;
  border-color: #d4006a !important;
  color: #8a0044 !important;
}
```

Você também pode reagir às classes CSS que a biblioteca aplica no elemento `<html>`:

```css
/* Estilo extra quando a fonte para dislexia está ativa */
html.acb-dyslexia .meu-titulo {
  margin-bottom: 2em;
  line-height: 1.8;
}
```

Lista completa de classes em **[docs/API.md#classes-css-aplicadas](docs/API.md#classes-css-aplicadas)**.

---

## Compatibilidade

| Recurso | Suporte |
|---------|---------|
| Navegadores modernos | Chrome, Firefox, Edge, Safari (últimas 2 versões) |
| Mobile | iOS Safari 12+, Chrome para Android |
| Texto para Fala | Requer Web Speech API (disponível em todos os navegadores modernos) |
| Fonte para Dislexia | OpenDyslexic via CDN; fallback automático para Comic Sans / Verdana |
| IE / Edge Legacy | Não suportado |

A biblioteca **não usa** `async/await`, Promises nativas nem template literals — compatível com navegadores mais antigos sem transpilação.

---

## Documentação completa

| Arquivo | Conteúdo |
|---------|----------|
| **[docs/PUBLICACAO.md](docs/PUBLICACAO.md)** | Como publicar no NPM, usar via CDN, GitHub Releases, checklist pré-publicação |
| **[docs/INTEGRACAO.md](docs/INTEGRACAO.md)** | Exemplos: PHP, Laravel, WordPress, Django, Flask, Spring Boot, Rails, Angular, React, Vue, Next.js, Svelte |
| **[docs/API.md](docs/API.md)** | Referência completa: construtor, opções, métodos, estado, classes CSS, localStorage, eventos |

---

## Estrutura do projeto

```
acessibilidade-br/
├── src/
│   ├── index.js            # Código-fonte (UMD — funciona via CDN e npm)
│   └── styles.css          # Estilos do widget
├── dist/
│   ├── acessibilidade.js   # Build distribuível
│   └── acessibilidade.css  # CSS distribuível
├── docs/
│   ├── API.md              # Referência da API JavaScript
│   ├── INTEGRACAO.md       # Guias de integração por framework
│   └── PUBLICACAO.md       # Como publicar e distribuir
├── demo.html               # Página de demonstração interativa
├── package.json
├── LICENSE
└── README.md
```

### `src/` vs `dist/` — qual o programa usa?

**`src/index.js`** é o **código-fonte** — onde o desenvolvimento acontece. Tem comentários, formatação legível e nomes de variáveis descritivos. É o arquivo que você edita.

**`dist/acessibilidade.js`** é o **código distribuído** — a cópia processada do `src/index.js` gerada pelo comando `npm run build`. É esse que o mundo usa:

- Quem faz `npm install acessibilidade-br` recebe o `dist/`, porque o `package.json` aponta `"main": "dist/acessibilidade.js"`
- Quem usa o link CDN (unpkg, jsDelivr) também está baixando o `dist/`

O `src/index.js` nunca chega ao usuário final diretamente — ele existe apenas para você poder ler, entender e modificar o código com facilidade.

> Pense assim: `src/` é a receita com anotações do cozinheiro. `dist/` é o prato pronto que vai para a mesa. O cozinheiro trabalha na receita, o cliente come o prato.

---

## Licença

MIT — veja [LICENSE](LICENSE).
