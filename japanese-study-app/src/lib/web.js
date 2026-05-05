export function renderLessonPage({ lesson, summary, state, reviews = [] }) {
  const reviewLog = reviews.slice(-5).reverse().map((review) => `<li>${escapeHtml(review.date)} — ${escapeHtml(review.wordId)} → ${escapeHtml(review.rating)}</li>`).join('');
  const rows = lesson.words
    .map((word) => {
      const submitted = reviews.some((review) => review.wordId === word.id && review.date === lesson.date);
      return `
      <li class="card">
        <div class="jp">${escapeHtml(word.kanji || word.reading || word.id)}</div>
        <div class="meta">${escapeHtml([word.reading, word.jlptLevel].filter(Boolean).join(' • '))}</div>
        <div class="en">${escapeHtml(word.english || '')}</div>
        ${word.examples?.length ? `<ul class="examples">${word.examples.slice(0, 2).map((ex) => `<li>${escapeHtml(ex)}</li>`).join('')}</ul>` : ''}
        <form method="post" action="/api/review" class="ratings">
          <input type="hidden" name="wordId" value="${escapeHtml(word.id)}" />
          <button name="rating" value="hard" ${submitted ? 'disabled' : ''}>Hard</button>
          <button name="rating" value="medium" ${submitted ? 'disabled' : ''}>Medium</button>
          <button name="rating" value="easy" ${submitted ? 'disabled' : ''}>Easy</button>
        </form>
      </li>
    `;
    })
    .join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Japanese Study App</title>
    <style>
      :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
      body { margin: 0; padding: 24px; max-width: 900px; margin-inline: auto; line-height: 1.5; }
      header { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; flex-wrap: wrap; }
      h1 { margin: 0 0 8px; }
      .muted { opacity: 0.75; }
      .grid { display: grid; gap: 16px; margin-top: 24px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
      .card { list-style: none; border: 1px solid currentColor; border-radius: 14px; padding: 16px; }
      .jp { font-size: 1.5rem; font-weight: 700; }
      .meta, .en { opacity: 0.8; }
      .examples { margin: 12px 0 0; padding-left: 18px; }
      .pill { display: inline-block; border: 1px solid currentColor; border-radius: 999px; padding: 4px 10px; margin-right: 8px; font-size: 0.9rem; }
      pre { white-space: pre-wrap; background: rgba(127,127,127,0.12); padding: 16px; border-radius: 12px; }
      a { color: inherit; }
      .ratings { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
      .ratings button { padding: 8px 12px; border-radius: 999px; border: 1px solid currentColor; background: transparent; color: inherit; cursor: pointer; }
      .ratings button:hover { background: rgba(127,127,127,0.16); }
      .columns { display: grid; gap: 24px; grid-template-columns: 2fr 1fr; margin-top: 24px; }
      .panel { border: 1px solid currentColor; border-radius: 14px; padding: 16px; }
      .panel ul { margin: 0; padding-left: 18px; }
    </style>
  </head>
  <body>
    <header>
      <div>
        <h1>Japanese Study App</h1>
        <div class="muted">Minimal daily lesson UI</div>
      </div>
      <div>
        <span class="pill">Lesson size: ${state.defaultLessonSize}</span>
        <span class="pill">Words: ${lesson.words.length}</span>
      </div>
    </header>

    <section class="grid">
      ${rows}
    </section>

    <section class="columns">
      <div class="panel">
        <h2>Summary</h2>
        <pre>${escapeHtml(summary.join('\n'))}</pre>
      </div>
      <div class="panel">
        <h2>Recent reviews</h2>
        <ul>${reviewLog || '<li>No reviews yet.</li>'}</ul>
      </div>
    </section>
  </body>
</html>`;
}

export function renderJsonPage(data) {
  return `<pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
