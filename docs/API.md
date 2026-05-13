# Referência da API

Documentação completa de todas as opções, métodos, estado e classes CSS expostas pela `acessibilidade-br`.

---

## Sumário

- [Construtor](#construtor)
- [Opções](#opções)
- [Métodos públicos](#métodos-públicos)
- [Propriedades de instância](#propriedades-de-instância)
- [Propriedades estáticas](#propriedades-estáticas)
- [Lista de ferramentas](#lista-de-ferramentas)
- [Classes CSS aplicadas](#classes-css-aplicadas)
- [Persistência (localStorage)](#persistência-localstorage)
- [Eventos](#eventos)
- [Exemplos avançados](#exemplos-avançados)

---

## Construtor

### `new Acessibilidade(opcoes?)`

Cria uma nova instância do widget e — se `autoInit: true` (padrão) — o renderiza imediatamente no `<body>`.

```javascript
const a11y = new Acessibilidade({
  posicaoInicial: 'bottom-right',
  salvarPreferencias: true,
  idiomaTTS: 'pt-BR',
  autoInit: true
});
```

**Retorna:** uma instância de `Acessibilidade`.

> Se chamada sem `new`, o construtor faz o `new` automaticamente. `Acessibilidade()` e `new Acessibilidade()` são equivalentes.

---

## Opções

Todas as opções são opcionais.

### `autoInit`

- **Tipo:** `boolean`
- **Padrão:** `true`
- **Descrição:** Inicializa o widget automaticamente no evento `DOMContentLoaded`. Se `false`, você precisa chamar `.init()` manualmente.

```javascript
const a11y = new Acessibilidade({ autoInit: false });

// Depois, em algum momento:
a11y.init();
```

### `salvarPreferencias`

- **Tipo:** `boolean`
- **Padrão:** `true`
- **Descrição:** Salva as configurações do usuário em `localStorage` (chave `acessibilidade-br:state`) para que persistam entre visitas. Se o navegador bloquear `localStorage` (modo anônimo restrito), a lib ignora o erro silenciosamente.

### `idiomaTTS`

- **Tipo:** `string`
- **Padrão:** `"pt-BR"`
- **Descrição:** Código BCP-47 do idioma usado pelo leitor de voz (Text to Speech). Exemplos: `"pt-BR"`, `"en-US"`, `"es-ES"`, `"fr-FR"`. Vozes disponíveis dependem do sistema operacional do usuário.

### `posicaoInicial`

- **Tipo:** `"bottom-right"` | `"bottom-left"` | `"top-right"` | `"top-left"` | `null`
- **Padrão:** `null`
- **Descrição:** Força a posição inicial do botão flutuante. Se `null`, usa a posição salva em `localStorage` (ou `"bottom-right"` na primeira execução).

---

## Métodos públicos

### `.init()`

Inicializa o widget manualmente. Útil quando você desativa `autoInit`.

```javascript
const a11y = new Acessibilidade({ autoInit: false });

// Quando quiser exibir:
a11y.init();
```

Chamadas repetidas são seguras — se o widget já foi renderizado, nada acontece.

### `.abrir()`

Abre o painel dropdown programaticamente.

```javascript
document.querySelector('#btn-customizado').addEventListener('click', () => {
  a11y.abrir();
});
```

### `.fechar()`

Fecha o painel dropdown.

```javascript
a11y.fechar();
```

### `.redefinir()`

Restaura todas as configurações para o padrão (texto normal, sem filtros, cursor padrão, etc.) e — se `salvarPreferencias` estiver ativo — limpa o `localStorage`.

```javascript
a11y.redefinir();
```

Equivalente a o usuário clicar no botão "Redefinir tudo" no painel.

### `.destroy()`

Remove **completamente** o widget da página:
- Remove o elemento do DOM
- Remove todas as classes CSS aplicadas em `<html>`
- Cancela o TTS se estiver tocando
- Remove os event listeners globais

```javascript
a11y.destroy();
```

Útil em SPAs quando você precisa montar/desmontar o widget conforme a rota.

---

## Propriedades de instância

### `.estado`

Objeto que representa as configurações atuais do widget. **Não modifique diretamente** — use os métodos públicos para alterar.

```javascript
console.log(a11y.estado);
// {
//   fontStep: 2,              // -2 a 4
//   spacingStep: 1,           // -1 a 3
//   invert: false,
//   grayscale: false,
//   underline: true,
//   dyslexia: false,
//   bigCursor: false,
//   readingGuide: false,
//   tts: false,
//   posicao: "bottom-right"
// }
```

### `.aberto`

`boolean` — indica se o painel dropdown está aberto.

```javascript
if (a11y.aberto) {
  a11y.fechar();
}
```

### `.elementos`

Objeto com referências aos elementos DOM internos do widget. Útil para personalizações avançadas.

```javascript
a11y.elementos.toggle    // o botão flutuante
a11y.elementos.panel     // o painel dropdown
a11y.elementos.widget    // o container raiz
a11y.elementos.itens     // { fontUp: <button>, fontDown: <button>, ... }
```

### `.opcoes`

Objeto com as opções de configuração que foram passadas ao construtor (já merged com os padrões).

---

## Propriedades estáticas

### `Acessibilidade.versao`

`string` — versão atual da biblioteca.

```javascript
console.log(Acessibilidade.versao); // "1.0.0"
```

### `Acessibilidade.ferramentas`

`Array` — lista das 12 ferramentas com seus metadados (id, label em português, ícone, tipo).

```javascript
console.log(Acessibilidade.ferramentas);
// [
//   { id: "fontUp", label: "Aumentar Texto", icone: "A+", tipo: "step" },
//   ...
// ]
```

---

## Lista de ferramentas

Cada ferramenta tem um `id` interno usado nos métodos e classes CSS:

| id | Label | Tipo | Faixa de valores |
|----|-------|------|------------------|
| `fontUp` | Aumentar Texto | step | incrementa `fontStep` (máx 4) |
| `fontDown` | Diminuir Texto | step | decrementa `fontStep` (mín -2) |
| `spacingUp` | Aumentar Espaçamento | step | incrementa `spacingStep` (máx 3) |
| `spacingDown` | Diminuir Espaçamento | step | decrementa `spacingStep` (mín -1) |
| `invert` | Inverter Cores | toggle | `true` / `false` |
| `grayscale` | Tons de Cinza | toggle | `true` / `false` |
| `underline` | Sublinhar Links | toggle | `true` / `false` |
| `dyslexia` | Fonte para Dislexia | toggle | `true` / `false` |
| `posicionar` | Posicionamento | action | rotaciona entre 4 cantos |
| `bigCursor` | Cursor Grande | toggle | `true` / `false` |
| `readingGuide` | Guia de Leitura | toggle | `true` / `false` |
| `tts` | Texto para Fala | toggle | `true` / `false` |

---

## Classes CSS aplicadas

Quando o usuário ativa uma ferramenta, a biblioteca adiciona classes na tag `<html>`. Você pode usar essas classes no seu CSS para casos especiais.

| Classe em `<html>` | Significado |
|--------------------|-------------|
| `.acb-fs-1` ... `.acb-fs-4` | Tamanho de fonte aumentado (níveis 1-4) |
| `.acb-fs--1`, `.acb-fs--2` | Tamanho de fonte reduzido |
| `.acb-ls-1` ... `.acb-ls-3` | Espaçamento aumentado |
| `.acb-ls--1` | Espaçamento reduzido |
| `.acb-invert` | Cores invertidas |
| `.acb-grayscale` | Tons de cinza |
| `.acb-underline-links` | Links sublinhados |
| `.acb-dyslexia` | Fonte para dislexia |
| `.acb-big-cursor` | Cursor grande |

### Exemplo: ajustar seu CSS quando dislexia está ativa

```css
html.acb-dyslexia .meu-titulo {
  /* Aumenta espaçamento entre títulos quando dislexia ativa */
  margin-bottom: 2em;
}
```

### Classes do widget (todas com prefixo `.acb-`)

| Classe | Elemento |
|--------|----------|
| `.acb-widget` | Container raiz |
| `.acb-toggle` | Botão flutuante |
| `.acb-panel` | Painel dropdown |
| `.acb-header` | Cabeçalho do painel |
| `.acb-list` | Lista de ferramentas |
| `.acb-item` | Botão de cada ferramenta |
| `.acb-item.acb-active` | Botão de ferramenta ativa |
| `.acb-footer` | Rodapé com "Redefinir" |
| `.acb-reading-guide` | Faixa escura superior da guia de leitura |
| `.acb-reading-guide-window` | Janela clara da guia de leitura |

---

## Persistência (localStorage)

Chave usada: `acessibilidade-br:state`

Formato do valor (JSON serializado):

```json
{
  "fontStep": 0,
  "spacingStep": 0,
  "invert": false,
  "grayscale": false,
  "underline": false,
  "dyslexia": false,
  "bigCursor": false,
  "readingGuide": false,
  "tts": false,
  "posicao": "bottom-right"
}
```

Para limpar manualmente:

```javascript
localStorage.removeItem('acessibilidade-br:state');
```

Ou via API:

```javascript
a11y.redefinir();
```

---

## Eventos

A versão atual **não emite eventos customizados**. Se você precisar reagir a mudanças de estado, sobrescreva o método `_aplicarEstadoCompleto`:

```javascript
const a11y = new Acessibilidade();
const original = a11y._aplicarEstadoCompleto.bind(a11y);

a11y._aplicarEstadoCompleto = function () {
  original();
  // Sua lógica aqui — exemplo: registrar mudanças no Google Analytics
  if (window.gtag) {
    gtag('event', 'acessibilidade_alterada', { estado: this.estado });
  }
};
```

Eventos nativos como `change` ou `acessibilidade:toggle` estão na roadmap para v1.1.

---

## Exemplos avançados

### Forçar a posição em todo carregamento (ignorar preferência salva)

```javascript
new Acessibilidade({
  posicaoInicial: 'top-left',
  salvarPreferencias: false  // não salva, fica fixo
});
```

### Múltiplos idiomas para TTS

```javascript
const idiomaAtual = document.documentElement.lang || 'pt-BR';
new Acessibilidade({ idiomaTTS: idiomaAtual });
```

### Carregar sob demanda (lazy)

```javascript
document.querySelector('#botao-a11y').addEventListener('click', async () => {
  const { default: Acessibilidade } = await import('acessibilidade-br');
  await import('acessibilidade-br/dist/acessibilidade.css');
  window._a11y = new Acessibilidade({ autoInit: true });
  window._a11y.abrir();
}, { once: true });
```

### Integrar com tema escuro do site

```javascript
const a11y = new Acessibilidade();
const obs = new MutationObserver(() => {
  const isDark = document.documentElement.classList.contains('dark-theme');
  // Faça algo quando o tema mudar — ex: cancela "Inverter Cores" se já está escuro
  if (isDark && a11y.estado.invert) {
    a11y._acionar('invert');
  }
});
obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
```

### Acessar instância globalmente

```javascript
window.a11y = new Acessibilidade();

// Em qualquer lugar do site:
console.log(window.a11y.estado);
window.a11y.abrir();
```
