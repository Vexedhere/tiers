const TEBEX_PACKAGES = {
  PLUS: 'https://creator.tebex.io/packages/6821532',
  PRO: 'https://creator.tebex.io/packages/6821535',
  PREMIUM: 'https://creator.tebex.io/packages/6821537'
};

window.sparkAgentTebexCheckout = function (plan) {
  const url = TEBEX_PACKAGES[String(plan).toUpperCase()];
  if (!url) return;
  window.location.href = url;
};

// Override the existing pricing-page payment action so paid plans open
// their corresponding Tebex checkout/package page.
window.choose = function (name) {
  window.sparkAgentTebexCheckout(name);
};

// Covers the existing plan buttons even when the inline choose() function
// was defined before this file loaded.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.plans .card').forEach((card) => {
    const name = card.querySelector('h3')?.textContent?.trim()?.toUpperCase();
    if (!TEBEX_PACKAGES[name]) return;
    const button = card.querySelector('button');
    if (!button) return;
    button.type = 'button';
    button.onclick = () => window.sparkAgentTebexCheckout(name);
  });
});
