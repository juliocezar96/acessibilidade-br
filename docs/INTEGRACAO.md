# Guia de Integração por Framework

Como integrar a `acessibilidade-br` em diferentes stacks. Como a biblioteca é JavaScript puro que roda no navegador, **o backend não importa** — o que muda é apenas a sintaxe de inclusão de assets em cada framework.

---

## Sumário

**Frontend JavaScript:**
- [Angular](#angular)
- [React (Create React App)](#react-create-react-app)
- [Next.js](#nextjs)
- [Vue.js / Nuxt](#vuejs--nuxt)
- [Svelte / SvelteKit](#svelte--sveltekit)
- [HTML estático / Vanilla JS](#html-estático--vanilla-js)

**Backend / Server-side:**
- [PHP puro](#php-puro)
- [Laravel](#laravel)
- [WordPress](#wordpress)
- [Java Spring Boot + Thymeleaf](#java-spring-boot--thymeleaf)
- [Java JSP](#java-jsp)
- [Python Django](#python-django)
- [Python Flask](#python-flask)
- [Ruby on Rails](#ruby-on-rails)
- [ASP.NET MVC](#aspnet-mvc)

**Outras situações:**
- [Em iframes / múltiplos sites](#em-iframes--múltiplos-sites)

---

## Resumo: qual método usar?

| Tipo de projeto | Método recomendado |
|-----------------|-------------------|
| Angular, React, Vue, Next, Svelte | NPM (`npm install`) |
| WordPress, Laravel, Django, Spring, Rails | CDN ou Auto-hospedado |
| HTML estático | CDN |
| Intranet / offline | Auto-hospedado |

---

## Angular

### Instalação

```bash
npm install acessibilidade-br
```

### Uso global (carrega em todas as rotas)

**`angular.json`:**
```json
{
  "projects": {
    "seu-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.css",
              "node_modules/acessibilidade-br/dist/acessibilidade.css"
            ],
            "scripts": [
              "node_modules/acessibilidade-br/dist/acessibilidade.js"
            ]
          }
        }
      }
    }
  }
}
```

**`src/app/app.component.ts`:**
```typescript
import { Component, OnInit } from '@angular/core';

declare const Acessibilidade: any;

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  ngOnInit() {
    new Acessibilidade({ idiomaTTS: 'pt-BR' });
  }
}
```

### Uso como componente isolado (alternativa)

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import Acessibilidade from 'acessibilidade-br';
import 'acessibilidade-br/dist/acessibilidade.css';

@Component({ selector: 'app-a11y-widget', template: '' })
export class A11yWidgetComponent implements OnInit, OnDestroy {
  private instancia: any;

  ngOnInit() {
    this.instancia = new Acessibilidade();
  }

  ngOnDestroy() {
    this.instancia?.destroy();
  }
}
```

---

## React (Create React App)

### Instalação

```bash
npm install acessibilidade-br
```

### Hook personalizado

**`src/hooks/useAcessibilidade.js`:**
```javascript
import { useEffect, useRef } from 'react';
import Acessibilidade from 'acessibilidade-br';
import 'acessibilidade-br/dist/acessibilidade.css';

export function useAcessibilidade(opcoes = {}) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current = new Acessibilidade(opcoes);
    return () => ref.current?.destroy();
  }, []);

  return ref.current;
}
```

**`src/App.js`:**
```javascript
import { useAcessibilidade } from './hooks/useAcessibilidade';

function App() {
  useAcessibilidade({ idiomaTTS: 'pt-BR' });

  return <main>...</main>;
}
```

---

## Next.js

A biblioteca manipula o DOM, então só pode rodar no **cliente** (não no SSR).

### App Router (Next 13+)

**`app/layout.tsx`:**
```tsx
import { A11yProvider } from './a11y-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <A11yProvider>{children}</A11yProvider>
      </body>
    </html>
  );
}
```

**`app/a11y-provider.tsx`:**
```tsx
'use client';

import { useEffect } from 'react';

export function A11yProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    (async () => {
      const Acessibilidade = (await import('acessibilidade-br')).default;
      await import('acessibilidade-br/dist/acessibilidade.css');
      new Acessibilidade();
    })();
  }, []);

  return <>{children}</>;
}
```

### Pages Router

**`pages/_app.tsx`:**
```tsx
import { useEffect } from 'react';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    (async () => {
      const Acessibilidade = (await import('acessibilidade-br')).default;
      await import('acessibilidade-br/dist/acessibilidade.css');
      new Acessibilidade();
    })();
  }, []);

  return <Component {...pageProps} />;
}
```

---

## Vue.js / Nuxt

### Vue 3

```bash
npm install acessibilidade-br
```

**`src/main.js`:**
```javascript
import { createApp } from 'vue';
import App from './App.vue';
import Acessibilidade from 'acessibilidade-br';
import 'acessibilidade-br/dist/acessibilidade.css';

const app = createApp(App);
app.mount('#app');

new Acessibilidade({ idiomaTTS: 'pt-BR' });
```

### Nuxt 3 (plugin)

**`plugins/acessibilidade.client.ts`:**
```typescript
export default defineNuxtPlugin(async () => {
  const Acessibilidade = (await import('acessibilidade-br')).default;
  await import('acessibilidade-br/dist/acessibilidade.css');
  new Acessibilidade();
});
```

O sufixo `.client.ts` faz o plugin rodar apenas no cliente, evitando erro de SSR.

---

## Svelte / SvelteKit

### SvelteKit

**`src/routes/+layout.svelte`:**
```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  let instancia;

  onMount(async () => {
    const { default: Acessibilidade } = await import('acessibilidade-br');
    await import('acessibilidade-br/dist/acessibilidade.css');
    instancia = new Acessibilidade();
  });

  onDestroy(() => instancia?.destroy());
</script>

<slot />
```

---

## HTML estático / Vanilla JS

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Meu site</title>
  <link rel="stylesheet" href="https://unpkg.com/acessibilidade-br@1.0.1/dist/acessibilidade.css">
</head>
<body>
  <h1>Conteúdo do site</h1>

  <script src="https://unpkg.com/acessibilidade-br@1.0.1/dist/acessibilidade.js"></script>
  <script>
    new Acessibilidade();
  </script>
</body>
</html>
```

---

## PHP puro

### Via CDN (mais simples)

**`layout.php`:**
```php
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <link rel="stylesheet" href="https://unpkg.com/acessibilidade-br@1.0.1/dist/acessibilidade.css">
</head>
<body>
  <?php include 'header.php'; ?>
  <?= $conteudo ?>

  <script src="https://unpkg.com/acessibilidade-br@1.0.1/dist/acessibilidade.js"></script>
  <script>new Acessibilidade();</script>
</body>
</html>
```

### Auto-hospedado

Copie os arquivos para `public/assets/`:

```php
<link rel="stylesheet" href="/assets/css/acessibilidade.css">
<script src="/assets/js/acessibilidade.js"></script>
<script>new Acessibilidade();</script>
```

---

## Laravel

### Auto-hospedado

1. Copie `dist/acessibilidade.js` para `public/js/`
2. Copie `dist/acessibilidade.css` para `public/css/`

**`resources/views/layouts/app.blade.php`:**
```blade
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <link rel="stylesheet" href="{{ asset('css/acessibilidade.css') }}">
</head>
<body>
  @yield('content')

  <script src="{{ asset('js/acessibilidade.js') }}"></script>
  <script>new Acessibilidade();</script>
</body>
</html>
```

### Via NPM + Vite (Laravel moderno)

```bash
npm install acessibilidade-br
```

**`resources/js/app.js`:**
```javascript
import Acessibilidade from 'acessibilidade-br';
import 'acessibilidade-br/dist/acessibilidade.css';

document.addEventListener('DOMContentLoaded', () => {
  new Acessibilidade();
});
```

**No layout:**
```blade
@vite(['resources/css/app.css', 'resources/js/app.js'])
```

---

## WordPress

### Como tema (enqueue script)

**`functions.php`:**
```php
function meu_tema_a11y_scripts() {
    // Via CDN
    wp_enqueue_style(
        'acessibilidade-br',
        'https://unpkg.com/acessibilidade-br@1.0.1/dist/acessibilidade.css',
        [],
        '1.0.1'
    );
    wp_enqueue_script(
        'acessibilidade-br',
        'https://unpkg.com/acessibilidade-br@1.0.1/dist/acessibilidade.js',
        [],
        '1.0.1',
        true
    );

    // Inicializa o widget
    wp_add_inline_script(
        'acessibilidade-br',
        'document.addEventListener("DOMContentLoaded", function() { new Acessibilidade({ idiomaTTS: "pt-BR" }); });'
    );
}
add_action('wp_enqueue_scripts', 'meu_tema_a11y_scripts');
```

### Auto-hospedado no tema

Coloque os arquivos em `wp-content/themes/seu-tema/assets/` e use `get_template_directory_uri()`:

```php
wp_enqueue_style('acessibilidade-br',
  get_template_directory_uri() . '/assets/acessibilidade.css');
wp_enqueue_script('acessibilidade-br',
  get_template_directory_uri() . '/assets/acessibilidade.js', [], '1.0.1', true);
```

---

## Java Spring Boot + Thymeleaf

### Auto-hospedado

1. Copie `acessibilidade.js` para `src/main/resources/static/js/`
2. Copie `acessibilidade.css` para `src/main/resources/static/css/`

**`src/main/resources/templates/layout.html`:**
```html
<!DOCTYPE html>
<html lang="pt-BR" xmlns:th="http://www.thymeleaf.org">
<head>
  <link rel="stylesheet" th:href="@{/css/acessibilidade.css}">
</head>
<body>
  <div th:replace="${conteudo}"></div>

  <script th:src="@{/js/acessibilidade.js}"></script>
  <script>new Acessibilidade();</script>
</body>
</html>
```

### Via CDN

```html
<link rel="stylesheet" href="https://unpkg.com/acessibilidade-br@1.0.1/dist/acessibilidade.css">
<script src="https://unpkg.com/acessibilidade-br@1.0.1/dist/acessibilidade.js"></script>
<script>new Acessibilidade();</script>
```

---

## Java JSP

**`WEB-INF/jsp/layout.jsp`:**
```jsp
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <link rel="stylesheet" href="<c:url value='/resources/css/acessibilidade.css'/>">
</head>
<body>
  <jsp:include page="conteudo.jsp" />

  <script src="<c:url value='/resources/js/acessibilidade.js'/>"></script>
  <script>new Acessibilidade();</script>
</body>
</html>
```

---

## Python Django

1. Copie os arquivos para `seu_app/static/js/` e `seu_app/static/css/`
2. Rode `python manage.py collectstatic`

**`templates/base.html`:**
```django
{% load static %}
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <link rel="stylesheet" href="{% static 'css/acessibilidade.css' %}">
</head>
<body>
  {% block content %}{% endblock %}

  <script src="{% static 'js/acessibilidade.js' %}"></script>
  <script>new Acessibilidade();</script>
</body>
</html>
```

---

## Python Flask

Coloque os arquivos em `static/`:

```
projeto/
├── static/
│   ├── acessibilidade.js
│   └── acessibilidade.css
└── templates/
    └── base.html
```

**`templates/base.html`:**
```jinja
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <link rel="stylesheet" href="{{ url_for('static', filename='acessibilidade.css') }}">
</head>
<body>
  {% block content %}{% endblock %}

  <script src="{{ url_for('static', filename='acessibilidade.js') }}"></script>
  <script>new Acessibilidade();</script>
</body>
</html>
```

---

## Ruby on Rails

### Asset Pipeline (Sprockets)

1. Copie `acessibilidade.js` para `app/assets/javascripts/`
2. Copie `acessibilidade.css` para `app/assets/stylesheets/`

**`app/assets/javascripts/application.js`:**
```javascript
//= require acessibilidade
//= require_tree .

document.addEventListener('DOMContentLoaded', function() {
  new Acessibilidade();
});
```

**`app/assets/stylesheets/application.css`:**
```css
/*
 *= require acessibilidade
 *= require_tree .
 */
```

### importmaps (Rails 7+)

**`config/importmap.rb`:**
```ruby
pin "acessibilidade-br", to: "https://unpkg.com/acessibilidade-br@1.0.1/dist/acessibilidade.js"
```

**`app/javascript/application.js`:**
```javascript
import Acessibilidade from "acessibilidade-br";
new Acessibilidade();
```

E inclua o CSS via link no layout.

---

## ASP.NET MVC

1. Copie os arquivos para `wwwroot/lib/acessibilidade-br/`

**`Views/Shared/_Layout.cshtml`:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <link rel="stylesheet" href="~/lib/acessibilidade-br/acessibilidade.css" />
</head>
<body>
  @RenderBody()

  <script src="~/lib/acessibilidade-br/acessibilidade.js"></script>
  <script>new Acessibilidade();</script>
</body>
</html>
```

---

## Em iframes / múltiplos sites

O widget é **por documento**. Se você tem iframes, cada iframe precisa carregar a biblioteca separadamente — o widget da página pai **não controla** o conteúdo do iframe.

Em casos onde você quer o widget controlando vários domínios, considere:

1. **Sincronizar preferências** via `postMessage` entre iframe e parent.
2. **Servir tudo do mesmo domínio** (não usar iframes).
3. **Usar cookies de primeira parte** em vez de localStorage, se controlar todos os domínios.
