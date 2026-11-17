/*
  RANKING GLOBAL · PROHIBIDO NO JUGAR
  -----------------------------------
  Lo usan todos los juegos con: <script src="/ranking.js"></script>
  Cada juego le pone su propia estética con CSS (clases .pnj-…).

  La clave de abajo es la "publishable": está pensada para ir en la página.
  Lo que protege los récords son las reglas de la base (supabase-records.sql).
*/
(function () {
  const SUPABASE_URL = 'https://fzmuhwrwupofvrmtsawt.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_wTc2hxiXymgBmynOf7vKYQ_7ygccIke';
  const NAME_LEN = 5;

  async function rpc(fn, body) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!r.ok) throw new Error((await r.text()) || r.status);
    return r.json();
  }

  const cleanName = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, NAME_LEN);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmtNum = n => Number(n).toLocaleString('es-AR');

  const PNJ = {
    NAME_LEN,
    cleanName,

    /* --- datos --- */
    ranking(game, mode = '', name = null) {
      return rpc('get_ranking', { p_game: game, p_mode: mode, p_name: name ? cleanName(name) : null });
    },
    /* --- "me gusta" de los juegos (home) --- */
    async likes() {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/game_likes?select=game,likes`, { headers: { apikey: SUPABASE_KEY } });
      if (!r.ok) throw new Error(r.status);
      const out = {}; (await r.json()).forEach(x => { out[x.game] = x.likes; }); return out;
    },
    like(game, delta) { return rpc('like_game', { p_game: game, p_delta: delta }); },
    likedSet() { try { return new Set(JSON.parse(localStorage.getItem('pnj_liked') || '[]')); } catch (e) { return new Set(); } },
    saveLiked(set) { try { localStorage.setItem('pnj_liked', JSON.stringify([...set])); } catch (e) {} },

    submit(game, mode, name, score) {
      return rpc('submit_score', { p_game: game, p_mode: mode || '', p_name: cleanName(name), p_score: score });
    },

    /* --- el nombre se recuerda entre juegos --- */
    lastName() { try { return localStorage.getItem('pnj_name') || ''; } catch (e) { return ''; } },
    saveName(n) { try { localStorage.setItem('pnj_name', cleanName(n)); } catch (e) {} },

    /* --- compartir: menú del celular, o copia al portapapeles en la compu --- */
    async share(text) {
      const url = location.origin + location.pathname;
      if (navigator.share) {
        try { await navigator.share({ text, url }); return 'shared'; } catch (e) { return 'cancel'; }
      }
      try { await navigator.clipboard.writeText(text + ' ' + url); return 'copied'; } catch (e) { return 'error'; }
    },

    /* --- formulario de nombre (5 letras) ---
       opts: { label, button, onSubmit(name) }  — devuelve el elemento */
    nameForm(opts) {
      const f = document.createElement('form');
      f.className = 'pnj-ui pnj-form';
      f.autocomplete = 'off';
      f.innerHTML =
        `<label class="pnj-label">${esc(opts.label)}</label>` +
        `<input class="pnj-input" maxlength="${NAME_LEN}" spellcheck="false" autocapitalize="characters" enterkeyhint="done" inputmode="text">` +
        `<button class="pnj-btn" type="submit">${esc(opts.button)}</button>` +
        `<div class="pnj-msg" aria-live="polite"></div>`;
      const inp = f.querySelector('input'), btn = f.querySelector('button'), msg = f.querySelector('.pnj-msg');
      inp.value = PNJ.lastName();
      inp.placeholder = '_'.repeat(NAME_LEN);
      inp.addEventListener('input', () => { const c = cleanName(inp.value); if (c !== inp.value) inp.value = c; });
      // que las teclas no lleguen al juego (Enter, flechas, espacio, M, P…)
      ['keydown', 'keyup', 'keypress'].forEach(t => inp.addEventListener(t, e => e.stopPropagation()));
      inp.addEventListener('keydown', e => { if (e.key === 'Escape') inp.blur(); });   // Esc: salir del campo sin guardar
      ['pointerdown', 'mousedown', 'touchstart', 'click'].forEach(t => f.addEventListener(t, e => e.stopPropagation()));
      f.addEventListener('submit', async e => {
        e.preventDefault(); e.stopPropagation();
        const n = cleanName(inp.value);
        if (!n) { inp.focus(); return; }
        btn.disabled = true; inp.disabled = true; msg.textContent = opts.saving || '…';
        try { PNJ.saveName(n); await opts.onSubmit(n); }
        catch (err) {
          btn.disabled = false; inp.disabled = false;
          msg.textContent = /too fast/.test(err.message) ? (opts.tooFast || 'Wait a few seconds')
                                                         : (opts.error || 'Could not save. Try again.');
        }
      });
      f.focusInput = () => { try { inp.focus({ preventScroll: true }); inp.select(); } catch (e) {} };
      return f;
    },

    /* --- tabla top 10 + tu puesto ---
       data = respuesta de ranking/submit
       opts: { format(score), youLabel(pos,total), title, empty, highlight } */
    board(data, opts) {
      const wrap = document.createElement('div');
      wrap.className = 'pnj-ui pnj-board';
      const fmt = opts.format || fmtNum;
      const me = data && data.me;
      const rows = (data && data.top || []).map(r =>
        `<li class="${me && r.name === me.name ? 'me' : ''}"><span class="pos">${r.pos}</span><span class="nm">${esc(r.name)}</span><span class="sc">${esc(fmt(r.score))}</span></li>`
      );
      if (me && !(data.top || []).some(r => r.name === me.name)) {
        rows.push('<li class="gap"><span>⋯</span></li>');
        rows.push(`<li class="me"><span class="pos">${me.pos}</span><span class="nm">${esc(me.name)}</span><span class="sc">${esc(fmt(me.score))}</span></li>`);
      }
      wrap.innerHTML =
        (opts.title ? `<div class="pnj-title">${esc(opts.title)}</div>` : '') +
        (rows.length ? `<ol class="pnj-list">${rows.join('')}</ol>` : `<div class="pnj-empty">${esc(opts.empty || '—')}</div>`) +
        (me && opts.youLabel ? `<div class="pnj-you">${esc(opts.youLabel(me.pos, data.total))}</div>` : '');
      ['pointerdown', 'mousedown', 'touchstart', 'click'].forEach(t => wrap.addEventListener(t, e => e.stopPropagation()));
      return wrap;
    },

    /* --- botón compartir --- */
    shareButton(opts) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'pnj-ui pnj-btn pnj-share'; b.textContent = opts.label;
      ['pointerdown', 'mousedown', 'touchstart'].forEach(t => b.addEventListener(t, e => e.stopPropagation()));
      b.addEventListener('click', async e => {
        e.stopPropagation();
        const r = await PNJ.share(opts.text());
        if (r === 'copied') { const t = b.textContent; b.textContent = opts.copied || '¡Copiado!'; setTimeout(() => b.textContent = t, 1600); }
      });
      return b;
    }
  };

  window.PNJ = PNJ;
})();
