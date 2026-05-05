export function renderLessonPage({ lesson, summary, state, reviews = [] }) {
  const reviewLog = reviews.slice(-5).reverse().map((r) =>
    `<li>${escapeHtml(r.date)} — ${escapeHtml(r.wordId)} → <strong>${escapeHtml(r.rating)}</strong></li>`
  ).join('');

  const cards = lesson.words.map((word, i) => {
    const reviewed = reviews.some((r) => r.wordId === word.id && r.date === lesson.date);
    const front = escapeHtml(word.kanji || word.reading || word.id);
    const reading = escapeHtml(word.reading || '');
    const english = escapeHtml(word.english || '');
    const level = escapeHtml(word.jlptLevel || '');
    const examples = (word.examples || []).slice(0, 2).map((ex) => `<li>${escapeHtml(ex)}</li>`).join('');

    return `
    <div class="flashcard${reviewed ? ' reviewed' : ''}" id="card-${i}">
      <div class="card-inner">
        <div class="card-front">
          <div class="jp">${front}</div>
          <div class="hint">Tap to reveal</div>
        </div>
        <div class="card-back">
          <div class="jp small">${front}</div>
          <div class="reading">${reading}</div>
          <div class="en">${english}</div>
          <div class="level">${level}</div>
          ${examples ? `<ul class="examples">${examples}</ul>` : ''}
          <form method="post" action="/api/review" class="ratings">
            <input type="hidden" name="wordId" value="${escapeHtml(word.id)}" />
            <button name="rating" value="hard" ${reviewed ? 'disabled' : ''}>😓 Hard</button>
            <button name="rating" value="medium" ${reviewed ? 'disabled' : ''}>🤔 Medium</button>
            <button name="rating" value="easy" ${reviewed ? 'disabled' : ''}>😊 Easy</button>
          </form>
        </div>
      </div>
    </div>`;
  }).join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Japanese Study App</title>
    <style>
      :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
      body { margin: 0; padding: 24px; max-width: 960px; margin-inline: auto; line-height: 1.5; }
      header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
      h1 { margin: 0; }
      h2 { margin: 0 0 12px; }
      .muted { opacity: 0.65; font-size: 0.9rem; }
      .pill { display: inline-block; border: 1px solid currentColor; border-radius: 999px; padding: 3px 10px; margin-right: 6px; font-size: 0.85rem; }
      .grid { display: grid; gap: 20px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }

      /* Flip card */
      .flashcard { perspective: 1000px; height: 260px; cursor: pointer; }
      .flashcard.reviewed { opacity: 0.6; }
      .card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.45s; transform-style: preserve-3d; }
      .flashcard.flipped .card-inner { transform: rotateY(180deg); }
      .card-front, .card-back {
        position: absolute; inset: 0; border-radius: 18px;
        border: 1px solid rgba(127,127,127,0.4);
        backface-visibility: hidden; -webkit-backface-visibility: hidden;
        display: flex; flex-direction: column; align-items: center;
        justify-content: center; padding: 20px; box-sizing: border-box;
        background: rgba(127,127,127,0.05);
      }
      .card-back { transform: rotateY(180deg); justify-content: flex-start; padding-top: 18px; }
      .jp { font-size: 2.2rem; font-weight: 700; }
      .jp.small { font-size: 1.3rem; margin-bottom: 4px; }
      .reading { font-size: 1rem; opacity: 0.75; }
      .en { font-size: 1.1rem; font-weight: 600; margin: 6px 0; }
      .level { font-size: 0.8rem; opacity: 0.5; }
      .examples { margin: 8px 0 0; padding-left: 18px; font-size: 0.85rem; opacity: 0.75; width: 100%; }
      .hint { font-size: 0.85rem; opacity: 0.5; margin-top: 8px; }
      .ratings { display: flex; gap: 6px; margin-top: 12px; flex-wrap: wrap; justify-content: center; }
      .ratings button {
        padding: 6px 12px; border-radius: 999px; border: 1px solid currentColor;
        background: transparent; color: inherit; cursor: pointer; font-size: 0.85rem;
      }
      .ratings button:hover:not(:disabled) { background: rgba(127,127,127,0.16); }
      .ratings button:disabled { opacity: 0.4; cursor: default; }

      .bottom { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-top: 28px; }
      .panel { border: 1px solid rgba(127,127,127,0.3); border-radius: 14px; padding: 16px; }
      .panel ul { margin: 0; padding-left: 18px; font-size: 0.9rem; }
      pre { white-space: pre-wrap; background: rgba(127,127,127,0.1); padding: 14px; border-radius: 10px; font-size: 0.85rem; margin: 0; }
    </style>
  </head>
  <body>
    <header>
      <div>
        <h1>🇯🇵 Japanese Study App</h1>
        <div class="muted">Daily lesson — tap a card to reveal</div>
      </div>
      <div>
        <span class="pill">Lesson: ${lesson.date}</span>
        <span class="pill">${lesson.words.length} words</span>
      </div>
    </header>

    <div class="grid">
      ${cards}
    </div>

    <div class="bottom">
      <div class="panel">
        <h2>Summary</h2>
        <pre>${escapeHtml(summary.join('\n'))}</pre>
      </div>
      <div class="panel">
        <h2>Recent reviews</h2>
        <ul>${reviewLog || '<li>No reviews yet.</li>'}</ul>
      </div>
    </div>

    <script>
      document.querySelectorAll('.flashcard').forEach((card) => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('form')) return;
          card.classList.toggle('flipped');
        });
      });
    </script>
  </body>
</html>`;
}

export function renderJsonPage(data) {
  return `<!doctype html><html><body><pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre></body></html>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
