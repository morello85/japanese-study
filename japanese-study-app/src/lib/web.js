export function renderLessonPage({ lesson, summary, state }) {
  const rows = lesson.words
    .map((word) => `
      <li class="card">
        <div class="jp">${escapeHtml(word.kanji || word.reading || word.id)}</div>
        <div class="meta">${escapeHtml([word.reading, word.jlptLevel].filter(Boolean).join(' • '))}</div>
        <div class="en">${escapeHtml(word.english || '')}</div>
        ${word.examples?.length ? `<ul class="examples">${word.examples.slice(0, 2).map((ex) => `<li>${escapeHtml(ex)}</li>`).join('')}</ul>` : ''}
      </li>
    `)
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

    <section style="margin-top: 24px;">
      <h2>Summary</h2>
      <pre>${escapeHtml(summary.join('\n'))}</pre>
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
