(() => {
  const site = 'https://bibliotecariberadenuble.github.io/biblionuble/';
  const shareUrl = encodeURIComponent(site);
  const shareTitle = encodeURIComponent('BiblioÑuble · Biblioteca digital escolar');
  const banner = encodeURIComponent(new URL('assets/cabecera-biblionuble.jpg', site).href);
  const shareLinks = document.querySelector('#shareLinks');
  const shareStatus = document.querySelector('#shareStatus');
  const networks = [
    ['WhatsApp', `https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`],
    ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`],
    ['X', `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`],
    ['Telegram', `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`],
    ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`],
    ['Reddit', `https://www.reddit.com/submit?url=${shareUrl}&title=${shareTitle}`],
    ['Pinterest', `https://www.pinterest.com/pin/create/button/?url=${shareUrl}&media=${banner}&description=${shareTitle}`],
    ['Bluesky', `https://bsky.app/intent/compose?text=${shareTitle}%20${shareUrl}`],
    ['Threads', `https://www.threads.com/intent/post?text=${shareTitle}%20${shareUrl}`],
    ['Tumblr', `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${shareUrl}&title=${shareTitle}&posttype=link`],
    ['LINE', `https://social-plugins.line.me/lineit/share?url=${shareUrl}`],
    ['VK', `https://vk.com/share.php?url=${shareUrl}&title=${shareTitle}`]
  ];

  function link(label, url) {
    const anchor = document.createElement('a');
    anchor.textContent = label;
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    return anchor;
  }

  for (const [name, url] of networks) {
    const anchor = link(name, url);
    anchor.className = 'social-link';
    anchor.setAttribute('aria-label', 'Compartir en ' + name);
    shareLinks.append(anchor);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(site);
      shareStatus.textContent = 'Enlace copiado.';
    } catch {
      const input = document.createElement('input');
      input.readOnly = true;
      input.value = site;
      input.setAttribute('aria-label', 'Enlace de BiblioÑuble para copiar');
      shareStatus.replaceChildren(input);
      input.select();
    }
  }

  for (const [name, url] of [['Instagram', 'https://www.instagram.com/'], ['TikTok', 'https://www.tiktok.com/']]) {
    const anchor = link(name, url);
    anchor.className = 'social-link';
    anchor.title = 'Copiar el enlace y abrir ' + name;
    anchor.setAttribute('aria-label', anchor.title);
    anchor.addEventListener('click', copyLink);
    shareLinks.append(anchor);
  }
  const more = document.createElement('button');
  more.className = 'social-link';
  more.type = 'button';
  more.textContent = navigator.share ? 'Más opciones' : 'Copiar enlace';
  more.addEventListener('click', async () => {
    if (!navigator.share) return copyLink();
    try {
      await navigator.share({ title: 'BiblioÑuble', url: site });
    } catch (error) {
      if (error.name !== 'AbortError') await copyLink();
    }
  });
  shareLinks.append(more);

  const badge = document.querySelector('#visitBadge');
  function showCounterError() {
    badge.hidden = true;
    document.querySelector('#visitError').hidden = false;
  }
  badge.addEventListener('error', showCounterError);
  if (badge.complete && !badge.naturalWidth) showCounterError();

  const chile = 'America/Santiago';
  const dateLabel = new Intl.DateTimeFormat('es-CL', {
    timeZone: chile, day: 'numeric', month: 'long', year: 'numeric'
  });
  const dateKey = new Intl.DateTimeFormat('sv-SE', { timeZone: chile });
  const newsBox = document.querySelector('#literaryNews');
  const anniversaryBox = document.querySelector('#literaryAnniversary');
  const localMonth = new Intl.DateTimeFormat('es-CL', { timeZone: chile, month: 'long' });
  const readingNews = /libr[oa]s?|lectura|literari|literatura|poesía|novela|escritor|biblioteca|autor|editorial|escrib|relatos|guadalajara|filsa/i;
  let displayedDay;

  async function request(url, type) {
    const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8500) });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return response[type]();
  }

  function renderItem(box, item) {
    if (!item?.title || !item.url || !/^https:\/\//i.test(item.url)) return false;
    const title = document.createElement('strong');
    title.append(link(item.title, item.url));
    const source = document.createElement('p');
    source.className = 'item-source';
    source.textContent = [item.source, item.date].filter(Boolean).join(' · ');
    box.replaceChildren(title);
    if (item.summary) {
      const summary = document.createElement('p');
      summary.textContent = item.summary;
      box.append(summary);
    }
    box.append(source);
    return true;
  }

  async function latestNews(now, recent = []) {
    const chileanFeed = 'https://camaradellibro.cl/wp-json/wp/v2/posts?per_page=10&_fields=title,link,date';
    const worldFeed = 'https://feeds.elpais.com/mrss-s/list/ep/site/elpais.com/section/babelia';
    const [chileNews, worldNews] = await Promise.all([
      request(chileanFeed, 'json').catch(() => []),
      request(worldFeed, 'text').catch(() => '')
    ]);
    const parser = new DOMParser();
    const chilean = Array.isArray(chileNews) ? chileNews.map(node => ({
      title: parser.parseFromString(node.title?.rendered || '', 'text/html').body.textContent.trim(),
      url: node.link,
      published: new Date(node.date?.slice(0, 10) + 'T12:00:00Z'),
      source: 'Cámara Chilena del Libro'
    })).filter(item => /^https:\/\/camaradellibro\.cl\//.test(item.url)) : [];
    const global = [...parser.parseFromString(worldNews, 'text/xml').querySelectorAll('item')].map(node => ({
      title: node.querySelector('title')?.textContent.trim(),
      url: node.querySelector('link')?.textContent.trim(),
      published: new Date(node.querySelector('pubDate')?.textContent),
      source: 'Babelia · EL PAÍS'
    })).filter(item => /^https:\/\/elpais\.com\//.test(item.url));
    const cutoff = new Date(now.getTime() - 21 * 86400000);
    const eligible = items => items.filter(item => item.title && readingNews.test(item.title)
      && item.published >= cutoff && dateKey.format(item.published) <= dateKey.format(now) && !recent.includes(item.url));
    const day = Math.floor(Date.parse(dateKey.format(now)) / 86400000);
    const groups = day % 2 ? [chilean, global] : [global, chilean];
    const pool = groups.map(eligible).find(items => items.length)?.slice(0, 4);
    if (!pool) return null;
    const chosen = pool[Math.floor(day / 2) % pool.length];
    return { ...chosen, date: dateKey.format(chosen.published) };
  }

  async function dateAnniversary(now) {
    const day = Number(dateKey.format(now).slice(-2));
    const datePage = `${day}_de_${localMonth.format(now)}`;
    const api = new URL('https://es.wikipedia.org/w/api.php');
    api.search = new URLSearchParams({ action: 'parse', page: datePage, prop: 'text', format: 'json', origin: '*' });
    const payload = await request(api.href, 'json');
    const page = new DOMParser().parseFromString(payload.parse.text['*'], 'text/html');
    const entries = [...page.querySelectorAll('li')].map(row => {
      const text = row.textContent.trim().replace(/\[\d+\]/g, '');
      const anchors = [...row.querySelectorAll('a[href^="/wiki/"]')];
      const person = anchors.find(a => !/^\d+$/.test(a.textContent.trim()));
      return { text, person };
    }).filter(({ text, person }) => person && /^\d{3,4}:/.test(text)
      && /\b(escritor[ae]?|poeta|novelista|dramaturg[oa])\b/i.test(text));
    const chosen = entries.find(entry => /chilen[oa]/i.test(entry.text)) || entries[0];
    if (!chosen) return null;
    return {
      title: chosen.person.textContent.trim() + ' · ' + chosen.text.split(':')[0],
      summary: chosen.text,
      source: 'Wikipedia en español · Efemérides',
      url: 'https://es.wikipedia.org/wiki/' + encodeURIComponent(datePage)
    };
  }

  async function refreshLiteraryPanel() {
    const now = new Date();
    const day = dateKey.format(now);
    if (displayedDay === day) return;
    displayedDay = day;
    document.querySelector('#literaryDate').textContent = dateLabel.format(now);
    const editorial = await request('./literarias.json', 'json').catch(() => null);
    if (editorial?.date === day && renderItem(newsBox, editorial.news) && renderItem(anniversaryBox, editorial.anniversary)) return;
    await Promise.all([
      latestNews(now, editorial?.recentNews).then(item => {
        if (!renderItem(newsBox, item) && !renderItem(newsBox, editorial?.news)) newsBox.textContent = 'Noticias temporalmente no disponibles.';
      }).catch(() => {
        if (!renderItem(newsBox, editorial?.news)) newsBox.textContent = 'Noticias temporalmente no disponibles.';
      }),
      dateAnniversary(now).then(item => {
        if (!renderItem(anniversaryBox, item)) anniversaryBox.textContent = 'Efeméride temporalmente no disponible.';
      }).catch(() => { anniversaryBox.textContent = 'Efeméride temporalmente no disponible.'; })
    ]);
  }
  refreshLiteraryPanel();
  setInterval(refreshLiteraryPanel, 60_000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refreshLiteraryPanel();
  });
})();
