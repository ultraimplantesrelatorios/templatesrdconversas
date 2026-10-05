/*
  ULTRA CENTRAL — CONFIGURAÇÃO RÁPIDA
  ----------------------------------
  Este arquivo existe para você mudar identidade, textos e logos sem mexer na lógica.
  Depois de editar, salve e recarregue a página.
*/

window.ULTRA_CONFIG = {
  brand: {
    name: 'Ultra Implantes',
    productName: 'Central de Inteligência Comercial',
    location: 'Osasco/SP',
    pageTitle: 'Ultra Implantes — Central de Inteligência',
    logos: {
      main: 'assets/ultra-logo.png',
      icon: 'assets/ultra-icon.png',
      rdConversas: 'assets/rd-conversas.png',
      rdIcon: 'assets/rd-icon.png'
    }
  },

  theme: {
    orange: '#ff6a00',
    orangeStrong: '#ec6200',
    orangeSoft: '#fff3ea',
    graphite: '#24262b',
    muted: '#6f737b',
    background: '#f7f7f8',
    surface: '#ffffff',
    line: '#e8e9ec',
    contentMax: '1240px',
    radius: '20px'
  },

  texts: {
    sidebarSubtitle: 'Central de Inteligência Comercial',
    rdFooter: 'RD Conversas como infraestrutura. A experiência é Ultra.',
    baseStatus: 'Base V6 ativa',
    humanRule: 'A IA da Ultra precisa saber odontologia em nível sênior, mas falar como uma ótima pessoa de atendimento. Ela pensa tecnicamente por dentro e conversa de forma simples, humana e cuidadosa por fora.'
  }
};

(function applyUltraConfig(){
  const cfg = window.ULTRA_CONFIG;
  if (!cfg) return;

  const root = document.documentElement;
  const cssVars = {
    '--orange': cfg.theme.orange,
    '--orange-2': cfg.theme.orangeStrong,
    '--orange-soft': cfg.theme.orangeSoft,
    '--ink': cfg.theme.graphite,
    '--muted': cfg.theme.muted,
    '--bg': cfg.theme.background,
    '--white': cfg.theme.surface,
    '--line': cfg.theme.line,
    '--content': cfg.theme.contentMax,
    '--radius': cfg.theme.radius
  };
  Object.entries(cssVars).forEach(([k,v]) => root.style.setProperty(k,v));

  document.title = cfg.brand.pageTitle;

  window.addEventListener('DOMContentLoaded', () => {
    const setText = (sel, value) => {
      const el = document.querySelector(sel);
      if (el && value) el.textContent = value;
    };
    const setSrc = (sel, value) => {
      const el = document.querySelector(sel);
      if (el && value) el.src = value;
    };

    setText('.brand-sub', cfg.texts.sidebarSubtitle);
    setText('.side-footer p', cfg.texts.rdFooter);
    setText('.status-pill', cfg.texts.baseStatus);

    setSrc('.brand-logo', cfg.brand.logos.main);
    setSrc('.side-footer img', cfg.brand.logos.rdConversas);

    const heroIcon = document.querySelector('.hero-mark img');
    if (heroIcon) heroIcon.src = cfg.brand.logos.icon;

    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.href = cfg.brand.logos.icon;

    const humanRule = document.querySelector('.human-rule blockquote');
    if (humanRule) humanRule.textContent = `“${cfg.texts.humanRule}”`;
  });
})();
