/*!
 * acessibilidade-br v1.0.1
 * Biblioteca de acessibilidade web em portugues.
 * Widget flutuante com 12 ferramentas de acessibilidade.
 * Licenca: MIT
 */
(function (global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define([], factory);
  } else {
    global.Acessibilidade = factory();
  }
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var STORAGE_KEY = "acessibilidade-br:state";
  var FONT_STEPS = [-2, -1, 0, 1, 2, 3, 4];
  var SPACING_STEPS = [-1, 0, 1, 2, 3];
  var POSICOES = [
    { id: "bottom-right", label: "Inferior direito" },
    { id: "bottom-left",  label: "Inferior esquerdo" },
    { id: "top-right",    label: "Superior direito" },
    { id: "top-left",     label: "Superior esquerdo" }
  ];

  var ICONE_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<circle cx="12" cy="3.5" r="2"/>' +
      '<path d="M12 7c-3 0-5 1.5-5 3 0 .8.6 1.4 1.4 1.4h2.2l-1.2 3.6c-.3.8-.4 1.6-.4 2.4 0 2.5 2 4.6 4.5 4.6 2.1 0 3.9-1.5 4.4-3.5h-2.1c-.4 1-1.3 1.6-2.3 1.6-1.4 0-2.5-1.1-2.5-2.5 0-.5.1-1 .3-1.4l1.4-4.2H17c.8 0 1.4-.6 1.4-1.4 0-1.5-2-3-5-3z"/>' +
    '</svg>';

  var FERRAMENTAS = [
    { id: "fontUp",      label: "Aumentar Texto",       icone: "A+",  tipo: "step" },
    { id: "fontDown",    label: "Diminuir Texto",       icone: "A-",  tipo: "step" },
    { id: "spacingUp",   label: "Aumentar Espacamento", icone: ">|",  tipo: "step" },
    { id: "spacingDown", label: "Diminuir Espacamento", icone: "|<",  tipo: "step" },
    { id: "invert",      label: "Inverter Cores",       icone: "◑", tipo: "toggle" },
    { id: "grayscale",   label: "Tons de Cinza",        icone: "◎", tipo: "toggle" },
    { id: "underline",   label: "Sublinhar Links",      icone: "_L_", tipo: "toggle" },
    { id: "dyslexia",    label: "Fonte para Dislexia",  icone: "Aa",  tipo: "toggle" },
    { id: "posicionar",  label: "Posicionamento",       icone: "⤢", tipo: "action" },
    { id: "bigCursor",   label: "Cursor Grande",        icone: "➤", tipo: "toggle" },
    { id: "readingGuide",label: "Guia de Leitura",      icone: "↔", tipo: "toggle" },
    { id: "tts",         label: "Texto para Fala",      icone: "♪", tipo: "toggle" }
  ];

  function getDefaultState() {
    return { fontStep: 0, spacingStep: 0, invert: false, grayscale: false,
             underline: false, dyslexia: false, bigCursor: false,
             readingGuide: false, tts: false, posicao: "bottom-right" };
  }

  function clamp(v, mn, mx) { return Math.max(mn, Math.min(mx, v)); }

  function carregarEstado() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return getDefaultState();
      var p = JSON.parse(raw);
      var d = getDefaultState();
      for (var k in d) if (p[k] === undefined) p[k] = d[k];
      return p;
    } catch (e) { return getDefaultState(); }
  }

  function salvarEstado(e) {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(e)); } catch (x) {}
  }

  function Acessibilidade(opcoes) {
    if (!(this instanceof Acessibilidade)) return new Acessibilidade(opcoes);
    this.opcoes = Object.assign({
      autoInit: true, salvarPreferencias: true,
      idiomaTTS: "pt-BR", posicaoInicial: null
    }, opcoes || {});
    this.estado = this.opcoes.salvarPreferencias ? carregarEstado() : getDefaultState();
    if (this.opcoes.posicaoInicial) this.estado.posicao = this.opcoes.posicaoInicial;
    this.elementos = {};
    this.aberto = false;
    this._readingGuideHandler = null;
    this._ttsHandler = null;
    this._mutationObserver = null;
    if (this.opcoes.autoInit) {
      if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", this.init.bind(this));
      else this.init();
    }
  }

  Acessibilidade.prototype.init = function () {
    if (this.elementos.toggle) return;
    this._envolverConteudo();
    this._renderWidget();
    this._aplicarEstadoCompleto();
    this._anexarEventos();
  };

  Acessibilidade.prototype.destroy = function () {
    if (!this.elementos.toggle) return;
    this._removerGuiaLeitura();
    if (this.estado.tts) this._pararTTS();
    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
      this._mutationObserver = null;
    }
    if (this.elementos.widget && this.elementos.widget.parentNode)
      this.elementos.widget.parentNode.removeChild(this.elementos.widget);
    this._desenvolverConteudo();
    var h = document.documentElement;
    ["acb-fs-1","acb-fs-2","acb-fs-3","acb-fs-4","acb-fs--1","acb-fs--2",
     "acb-ls-1","acb-ls-2","acb-ls-3","acb-ls--1",
     "acb-underline-links","acb-dyslexia","acb-big-cursor"
    ].forEach(function (c) { h.classList.remove(c); });
    this.elementos = {};
  };

  // WRAPPER DE CONTEUDO
  // Envolve o conteudo do <body> num div .acb-content
  // para que os filtros (invert/grayscale) sejam aplicados
  // nele em vez do <html>, preservando position:fixed do widget.

  Acessibilidade.prototype._envolverConteudo = function () {
    if (this.elementos.contentWrapper) return;
    var wrapper = document.createElement("div");
    wrapper.className = "acb-content";
    while (document.body.firstChild) wrapper.appendChild(document.body.firstChild);
    document.body.appendChild(wrapper);
    this.elementos.contentWrapper = wrapper;

    var self = this;
    if (typeof MutationObserver !== "undefined") {
      this._mutationObserver = new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          if (!m.addedNodes) return;
          Array.prototype.forEach.call(m.addedNodes, function (node) {
            if (node.nodeType !== 1) return;
            if (node === wrapper) return;
            if (node === self.elementos.widget) return;
            if (node.parentNode !== document.body) return;
            wrapper.appendChild(node);
          });
        });
      });
      this._mutationObserver.observe(document.body, { childList: true });
    }
  };

  Acessibilidade.prototype._desenvolverConteudo = function () {
    var w = this.elementos.contentWrapper;
    if (!w) return;
    while (w.firstChild) document.body.insertBefore(w.firstChild, w);
    if (w.parentNode) w.parentNode.removeChild(w);
    this.elementos.contentWrapper = null;
  };

  Acessibilidade.prototype._renderWidget = function () {
    var self = this;
    var widget = document.createElement("div");
    widget.className = "acb-widget";
    widget.setAttribute("role", "region");
    widget.setAttribute("aria-label", "Ferramentas de acessibilidade");

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "acb-toggle";
    toggle.setAttribute("aria-label", "Abrir menu de acessibilidade");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = ICONE_SVG;
    this._aplicarPosicao(toggle);

    var panel = document.createElement("div");
    panel.className = "acb-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Menu de acessibilidade");
    this._aplicarPosicao(panel);

    var header = document.createElement("div");
    header.className = "acb-header";
    var titulo = document.createElement("h2");
    titulo.textContent = "Acessibilidade";
    var btnFechar = document.createElement("button");
    btnFechar.type = "button";
    btnFechar.className = "acb-close";
    btnFechar.setAttribute("aria-label", "Fechar menu");
    btnFechar.innerHTML = "&times;";
    header.appendChild(titulo);
    header.appendChild(btnFechar);

    var lista = document.createElement("ul");
    lista.className = "acb-list";
    lista.setAttribute("role", "list");

    this.elementos.itens = {};
    FERRAMENTAS.forEach(function (f) {
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "acb-item";
      btn.dataset.tool = f.id;
      btn.setAttribute("aria-label", f.label);
      var icone = document.createElement("span");
      icone.className = "acb-item-icon";
      icone.textContent = f.icone;
      icone.setAttribute("aria-hidden", "true");
      var label = document.createElement("span");
      label.className = "acb-item-label";
      label.textContent = f.label;
      btn.appendChild(icone);
      btn.appendChild(label);
      li.appendChild(btn);
      lista.appendChild(li);
      self.elementos.itens[f.id] = btn;
    });

    var rodape = document.createElement("div");
    rodape.className = "acb-footer";
    var btnReset = document.createElement("button");
    btnReset.type = "button";
    btnReset.className = "acb-btn-reset";
    btnReset.textContent = "Redefinir tudo";
    rodape.appendChild(btnReset);

    panel.appendChild(header);
    panel.appendChild(lista);
    panel.appendChild(rodape);

    var guiaTop = document.createElement("div");
    guiaTop.className = "acb-reading-guide";
    var guiaWindow = document.createElement("div");
    guiaWindow.className = "acb-reading-guide-window";

    // Dica visual para Texto para Fala
    var ttsHint = document.createElement("div");
    ttsHint.className = "acb-tts-hint";
    ttsHint.textContent = "Texto para Fala ativo - clique em qualquer texto da pagina";

    widget.appendChild(toggle);
    widget.appendChild(panel);
    widget.appendChild(guiaTop);
    widget.appendChild(guiaWindow);
    widget.appendChild(ttsHint);

    // IMPORTANTE: widget eh IRMAO do .acb-content, NUNCA dentro dele.
    document.body.appendChild(widget);

    this.elementos.widget = widget;
    this.elementos.toggle = toggle;
    this.elementos.panel = panel;
    this.elementos.btnFechar = btnFechar;
    this.elementos.btnReset = btnReset;
    this.elementos.guiaTop = guiaTop;
    this.elementos.guiaWindow = guiaWindow;
    this.elementos.ttsHint = ttsHint;
  };

  Acessibilidade.prototype._aplicarPosicao = function (el) {
    ["acb-pos-bottom-right","acb-pos-bottom-left","acb-pos-top-right","acb-pos-top-left"]
      .forEach(function (c) { el.classList.remove(c); });
    el.classList.add("acb-pos-" + this.estado.posicao);
  };

  Acessibilidade.prototype._anexarEventos = function () {
    var self = this;
    this.elementos.toggle.addEventListener("click", function () {
      self.aberto ? self.fechar() : self.abrir();
    });
    this.elementos.btnFechar.addEventListener("click", function () { self.fechar(); });
    this.elementos.btnReset.addEventListener("click", function () { self.redefinir(); });
    FERRAMENTAS.forEach(function (f) {
      self.elementos.itens[f.id].addEventListener("click", function () { self._acionar(f.id); });
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && self.aberto) self.fechar();
    });
    document.addEventListener("click", function (ev) {
      if (!self.aberto) return;
      if (self.elementos.widget.contains(ev.target)) return;
      self.fechar();
    });
  };

  Acessibilidade.prototype.abrir = function () {
    this.elementos.panel.classList.add("acb-open");
    this.elementos.toggle.setAttribute("aria-expanded", "true");
    this.aberto = true;
  };

  Acessibilidade.prototype.fechar = function () {
    this.elementos.panel.classList.remove("acb-open");
    this.elementos.toggle.setAttribute("aria-expanded", "false");
    this.aberto = false;
  };

  Acessibilidade.prototype._acionar = function (id) {
    switch (id) {
      case "fontUp":     this.estado.fontStep = clamp(this.estado.fontStep + 1, FONT_STEPS[0], FONT_STEPS[FONT_STEPS.length-1]); break;
      case "fontDown":   this.estado.fontStep = clamp(this.estado.fontStep - 1, FONT_STEPS[0], FONT_STEPS[FONT_STEPS.length-1]); break;
      case "spacingUp":  this.estado.spacingStep = clamp(this.estado.spacingStep + 1, SPACING_STEPS[0], SPACING_STEPS[SPACING_STEPS.length-1]); break;
      case "spacingDown":this.estado.spacingStep = clamp(this.estado.spacingStep - 1, SPACING_STEPS[0], SPACING_STEPS[SPACING_STEPS.length-1]); break;
      case "invert":       this.estado.invert       = !this.estado.invert;       break;
      case "grayscale":    this.estado.grayscale    = !this.estado.grayscale;    break;
      case "underline":    this.estado.underline    = !this.estado.underline;    break;
      case "dyslexia":     this.estado.dyslexia     = !this.estado.dyslexia;     break;
      case "bigCursor":    this.estado.bigCursor    = !this.estado.bigCursor;    break;
      case "readingGuide": this.estado.readingGuide = !this.estado.readingGuide; break;
      case "tts":          this.estado.tts          = !this.estado.tts;          break;
      case "posicionar":   this._rotacionarPosicao();                            break;
    }
    this._aplicarEstadoCompleto();
    if (this.opcoes.salvarPreferencias) salvarEstado(this.estado);
  };

  Acessibilidade.prototype._rotacionarPosicao = function () {
    var idx = -1;
    for (var i = 0; i < POSICOES.length; i++)
      if (POSICOES[i].id === this.estado.posicao) { idx = i; break; }
    this.estado.posicao = POSICOES[(idx + 1) % POSICOES.length].id;
  };

  Acessibilidade.prototype._aplicarEstadoCompleto = function () {
    var html = document.documentElement;
    var wrapper = this.elementos.contentWrapper;

    ["acb-fs-1","acb-fs-2","acb-fs-3","acb-fs-4","acb-fs--1","acb-fs--2",
     "acb-ls-1","acb-ls-2","acb-ls-3","acb-ls--1",
     "acb-underline-links","acb-dyslexia","acb-big-cursor"
    ].forEach(function (c) { html.classList.remove(c); });

    if (wrapper) {
      wrapper.classList.remove("acb-invert");
      wrapper.classList.remove("acb-grayscale");
    }

    if (this.estado.fontStep !== 0)
      html.classList.add("acb-fs-" + (this.estado.fontStep < 0 ? "-" + Math.abs(this.estado.fontStep) : this.estado.fontStep));
    if (this.estado.spacingStep !== 0)
      html.classList.add("acb-ls-" + (this.estado.spacingStep < 0 ? "-" + Math.abs(this.estado.spacingStep) : this.estado.spacingStep));

    // FILTROS no wrapper, nao no <html> (preserva position:fixed)
    if (wrapper && this.estado.invert)    wrapper.classList.add("acb-invert");
    if (wrapper && this.estado.grayscale) wrapper.classList.add("acb-grayscale");

    if (this.estado.underline) html.classList.add("acb-underline-links");
    if (this.estado.dyslexia)  html.classList.add("acb-dyslexia");
    if (this.estado.bigCursor) html.classList.add("acb-big-cursor");

    if (this.estado.readingGuide) this._ativarGuiaLeitura();
    else this._removerGuiaLeitura();

    if (this.estado.tts) this._ativarTTS();
    else this._pararTTS();

    this._aplicarPosicao(this.elementos.toggle);
    this._aplicarPosicao(this.elementos.panel);
    this._atualizarBotoes();
  };

  Acessibilidade.prototype._atualizarBotoes = function () {
    var st = this.estado;
    var ativo = {
      fontUp: st.fontStep > 0, fontDown: st.fontStep < 0,
      spacingUp: st.spacingStep > 0, spacingDown: st.spacingStep < 0,
      invert: st.invert, grayscale: st.grayscale,
      underline: st.underline, dyslexia: st.dyslexia,
      bigCursor: st.bigCursor, readingGuide: st.readingGuide,
      tts: st.tts, posicionar: false
    };
    for (var id in this.elementos.itens) {
      var btn = this.elementos.itens[id];
      if (ativo[id]) btn.classList.add("acb-active");
      else btn.classList.remove("acb-active");
    }
  };

  Acessibilidade.prototype._ativarGuiaLeitura = function () {
    if (this._readingGuideHandler) return;
    var topEl = this.elementos.guiaTop;
    var windowEl = this.elementos.guiaWindow;
    topEl.classList.add("acb-visible");
    windowEl.classList.add("acb-visible");
    this._readingGuideHandler = function (ev) {
      var y = ev.clientY, altura = 80;
      topEl.style.top = "0px";
      topEl.style.height = Math.max(0, y - altura/2) + "px";
      windowEl.style.top = (y - altura/2) + "px";
    };
    document.addEventListener("mousemove", this._readingGuideHandler);
  };

  Acessibilidade.prototype._removerGuiaLeitura = function () {
    if (!this._readingGuideHandler) return;
    document.removeEventListener("mousemove", this._readingGuideHandler);
    this._readingGuideHandler = null;
    if (this.elementos.guiaTop)    this.elementos.guiaTop.classList.remove("acb-visible");
    if (this.elementos.guiaWindow) this.elementos.guiaWindow.classList.remove("acb-visible");
  };

  Acessibilidade.prototype._ativarTTS = function () {
    if (!("speechSynthesis" in window)) {
      console.warn("[acessibilidade-br] Web Speech API nao disponivel.");
      this.estado.tts = false;
      this._atualizarBotoes();
      return;
    }
    if (this._ttsHandler) return;
    var self = this;

    // Mostra dica visual
    if (this.elementos.ttsHint) this.elementos.ttsHint.classList.add("acb-visible");

    this._ttsUltimoAlvo = null;

    this._ttsHandler = function (ev) {
      if (self.elementos.widget.contains(ev.target)) return;
      var alvo = ev.target;
      if (!alvo) return;
      var texto = (alvo.innerText || alvo.textContent || "").trim();
      if (!texto) return;

      // Limita texto muito longo (parágrafos gigantes)
      if (texto.length > 1500) texto = texto.substring(0, 1500) + "...";

      try {
        window.speechSynthesis.cancel();

        // Remove destaque do alvo anterior
        if (self._ttsUltimoAlvo) {
          self._ttsUltimoAlvo.classList.remove("acb-tts-reading");
        }
        // Destaca o alvo atual
        alvo.classList.add("acb-tts-reading");
        self._ttsUltimoAlvo = alvo;

        var u = new SpeechSynthesisUtterance(texto);
        u.lang = self.opcoes.idiomaTTS;
        u.rate = 1.0;
        u.onend = function () {
          if (self._ttsUltimoAlvo === alvo) {
            alvo.classList.remove("acb-tts-reading");
            self._ttsUltimoAlvo = null;
          }
        };
        u.onerror = u.onend;
        window.speechSynthesis.speak(u);
      } catch (e) {
        console.warn("[acessibilidade-br] Erro TTS:", e);
      }
    };
    document.addEventListener("click", this._ttsHandler, true);
  };

  Acessibilidade.prototype._pararTTS = function () {
    if (this._ttsHandler) {
      document.removeEventListener("click", this._ttsHandler, true);
      this._ttsHandler = null;
    }
    if (this.elementos.ttsHint) this.elementos.ttsHint.classList.remove("acb-visible");
    if (this._ttsUltimoAlvo) {
      this._ttsUltimoAlvo.classList.remove("acb-tts-reading");
      this._ttsUltimoAlvo = null;
    }
    if ("speechSynthesis" in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  };

  Acessibilidade.prototype.redefinir = function () {
    this.estado = getDefaultState();
    this._aplicarEstadoCompleto();
    if (this.opcoes.salvarPreferencias) salvarEstado(this.estado);
  };

  Acessibilidade.versao = "1.0.1";
  Acessibilidade.ferramentas = FERRAMENTAS.slice();

  return Acessibilidade;
});
