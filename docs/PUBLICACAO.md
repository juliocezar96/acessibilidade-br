# Guia de Publicação

Este documento mostra os 4 caminhos para distribuir a biblioteca `acessibilidade-br`. Você pode usar **um, alguns ou todos** — eles se complementam.

> **Recomendação prática:** publique primeiro no **NPM**. Isso te dá automaticamente acesso via NPM (para projetos JS) **e** via CDN (unpkg / jsDelivr), cobrindo praticamente todos os cenários de uma vez só.

---

## Sumário

- [Caminho 1 — NPM](#caminho-1--npm)
- [Caminho 2 — CDN público](#caminho-2--cdn-público)
- [Caminho 3 — Auto-hospedado](#caminho-3--auto-hospedado)
- [Caminho 4 — GitHub Releases](#caminho-4--github-releases)
- [Versionamento (SemVer)](#versionamento-semver)
- [Checklist antes de publicar](#checklist-antes-de-publicar)
- [Resolução de problemas](#resolução-de-problemas)

---

## Caminho 1 — NPM

Melhor para: projetos **JavaScript modernos** (Angular, React, Vue, Next, Svelte, etc.)

### Passo 1 — Criar conta no npm

Vá em https://www.npmjs.com/signup e crie uma conta gratuita.

### Passo 2 — Verificar se o nome está livre

```bash
npm view acessibilidade-br
```

- Se retornar **erro 404** → nome está livre, pode usar.
- Se retornar dados de um pacote → escolha outro nome ou use scope.

**Usando scope** (recomendado para evitar conflitos):

No `package.json`, mude:

```json
{
  "name": "@seu-usuario-npm/acessibilidade-br"
}
```

### Passo 3 — Login no npm

```bash
npm login
```

Informe usuário, senha e e-mail. Vai pedir um código de verificação enviado por e-mail.

### Passo 4 — Publicar

```bash
cd acessibilidade-br
npm publish --access public
```

A flag `--access public` é **obrigatória** se você estiver usando scope (`@usuario/pacote`). Para pacotes sem scope, ela é opcional.

### Passo 5 — Verificar

```bash
npm view acessibilidade-br
```

Pronto. O pacote já está disponível em:
- `https://www.npmjs.com/package/acessibilidade-br`
- `https://unpkg.com/acessibilidade-br` (CDN automático)
- `https://cdn.jsdelivr.net/npm/acessibilidade-br` (CDN automático)

### Para atualizar versões

```bash
npm version patch       # 1.0.0 → 1.0.1 (correções)
npm version minor       # 1.0.0 → 1.1.0 (novas features compatíveis)
npm version major       # 1.0.0 → 2.0.0 (breaking changes)

npm publish
```

---

## Caminho 2 — CDN público

Melhor para: **PHP, Java, Python, Ruby, WordPress, HTML estático**.

> **Importante:** os CDNs públicos servem o pacote automaticamente **depois que você publica no NPM**. Não é um passo separado de publicação — é só o link.

### unpkg

```html
<!-- Versão específica (recomendado em produção) -->
<link rel="stylesheet" href="https://unpkg.com/acessibilidade-br@1.0.1/dist/acessibilidade.css">
<script src="https://unpkg.com/acessibilidade-br@1.0.1/dist/acessibilidade.js"></script>

<!-- Última versão (apenas para testes) -->
<link rel="stylesheet" href="https://unpkg.com/acessibilidade-br/dist/acessibilidade.css">
<script src="https://unpkg.com/acessibilidade-br/dist/acessibilidade.js"></script>
```

### jsDelivr

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/acessibilidade-br@1.0.1/dist/acessibilidade.css">
<script src="https://cdn.jsdelivr.net/npm/acessibilidade-br@1.0.1/dist/acessibilidade.js"></script>
```

### Recomendações

- **Trave a versão** em produção (`@1.0.0`, não apenas `@latest`). Assim, atualizações da lib não quebram seu site sem você saber.
- Use **SRI (Subresource Integrity)** para garantir integridade do arquivo. O jsDelivr fornece os hashes na URL `https://www.jsdelivr.com/package/npm/acessibilidade-br`.

Exemplo com SRI:

```html
<script
  src="https://cdn.jsdelivr.net/npm/acessibilidade-br@1.0.1/dist/acessibilidade.js"
  integrity="sha384-XXXXXX"
  crossorigin="anonymous">
</script>
```

---

## Caminho 3 — Auto-hospedado

Melhor para: **intranet, sites offline, projetos que não podem depender de CDN externa**.

### Passo 1 — Copiar os arquivos

Pegue os dois arquivos de `dist/`:

- `dist/acessibilidade.js`
- `dist/acessibilidade.css`

E coloque-os na pasta pública do seu projeto. Exemplos:

| Framework | Pasta destino |
|-----------|---------------|
| Laravel | `public/assets/js/` e `public/assets/css/` |
| Django | `static/js/` e `static/css/` |
| Flask | `static/js/` e `static/css/` |
| Spring Boot | `src/main/resources/static/js/` e `/css/` |
| Rails | `app/assets/javascripts/` e `app/assets/stylesheets/` |
| WordPress | `wp-content/themes/seu-tema/assets/` |
| Angular | `src/assets/vendor/` (e referenciar em `angular.json`) |
| React (CRA) | `public/vendor/` |
| Next.js | `public/vendor/` |

### Passo 2 — Incluir nos templates

Veja **[INTEGRACAO.md](INTEGRACAO.md)** para exemplos por framework.

### Vantagens

- Funciona sem internet (intranet)
- Você controla a versão exata
- Sem latência de DNS de CDNs externas

### Desvantagens

- Você precisa fazer o upload manual a cada atualização
- Sem cache compartilhado entre sites diferentes

---

## Caminho 4 — GitHub Releases

Melhor para: **distribuir versões sem usar npm**, ou para que outras pessoas baixem os arquivos diretamente do GitHub.

### Passo 1 — Subir o projeto pro GitHub

```bash
cd acessibilidade-br
git init
git add .
git commit -m "feat: versão inicial v1.0.0"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/acessibilidade-br.git
git push -u origin main
```

### Passo 2 — Criar uma tag

```bash
git tag v1.0.0
git push origin v1.0.0
```

### Passo 3 — Criar o Release pela interface

1. Vá em `https://github.com/SEU-USUARIO/acessibilidade-br/releases/new`
2. Selecione a tag `v1.0.0`
3. Preencha título e descrição (changelog)
4. Anexe os arquivos `dist/acessibilidade.js` e `dist/acessibilidade.css` (opcional, dá pra baixar direto)
5. Publique

### Usando via jsDelivr (sem npm)

O jsDelivr também serve arquivos direto do GitHub:

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/SEU-USUARIO/acessibilidade-br@v1.0.1/dist/acessibilidade.css">
<script
  src="https://cdn.jsdelivr.net/gh/SEU-USUARIO/acessibilidade-br@v1.0.1/dist/acessibilidade.js">
</script>
```

Repare na diferença: `cdn.jsdelivr.net/gh/...` (GitHub) em vez de `cdn.jsdelivr.net/npm/...` (npm).

---

## Versionamento (SemVer)

A biblioteca segue **Semantic Versioning**: `MAJOR.MINOR.PATCH`.

| Tipo de mudança | Comando | Exemplo |
|----------------|---------|---------|
| Correção de bug, sem nova feature | `npm version patch` | 1.0.0 → 1.0.1 |
| Nova feature, retrocompatível | `npm version minor` | 1.0.0 → 1.1.0 |
| Mudança que quebra compatibilidade | `npm version major` | 1.0.0 → 2.0.0 |

Esses comandos:

1. Atualizam o `package.json`
2. Criam um commit `vX.Y.Z`
3. Criam uma tag git `vX.Y.Z`

Depois é só `git push --tags && npm publish`.

---

## Checklist antes de publicar

Antes do primeiro `npm publish`, confira:

- [ ] `package.json` com `name`, `version`, `description`, `author`, `license`, `repository` preenchidos
- [ ] Campo `"files"` do `package.json` lista as pastas que devem ir junto (`src/`, `dist/`)
- [ ] `README.md` na raiz do projeto (vira a página do pacote no npmjs.com)
- [ ] `LICENSE` na raiz
- [ ] `.npmignore` configurado (exclui `node_modules/`, `.git/`, etc.)
- [ ] Build de produção em `dist/` atualizado
- [ ] Teste a instalação local antes:

  ```bash
  npm pack                       # cria o .tgz que o npm publish enviaria
  cd /outro-projeto
  npm install /caminho/do/acessibilidade-br-1.0.0.tgz
  ```

- [ ] Testar `npm view acessibilidade-br --json` para confirmar que o nome está livre

---

## Resolução de problemas

### `403 Forbidden` ao publicar

Significa que o nome do pacote já existe. Soluções:
- Renomeie o pacote: `acessibilidade-br-julio`, `julio-a11y`, etc.
- Use scope: `@seu-usuario/acessibilidade-br` e publique com `--access public`.

### `npm ERR! need auth`

Você não está logado. Rode `npm login` novamente.

### Pacote publicado mas o `dist/` não chegou

Confira o campo `"files"` no `package.json`:

```json
"files": ["src/", "dist/", "demo.html"]
```

Ou use `npm pack && tar -tzf *.tgz` para ver o que **foi** incluído.

### Quero **despublicar** (cuidado!)

```bash
npm unpublish acessibilidade-br@1.0.0
```

O npm tem regras estritas: você só pode despublicar nas primeiras 72 horas, e versões muito usadas não podem ser removidas (regra contra "left-pad").

A prática recomendada é publicar uma versão nova com a correção, e marcar a anterior como **deprecated**:

```bash
npm deprecate acessibilidade-br@1.0.0 "Versão com bug, use 1.0.1+"
```
