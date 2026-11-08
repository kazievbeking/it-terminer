import{t,local,storage,setLanguage}from './i18n.js';
import{initDictionary,refreshDictionary}from './dictionary.js';
import{initQuiz,renderQuiz}from './quiz.js';

let research, method = 'lexical';

const el = (tag, text, className) => {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (className) e.className = className;
  return e;
};

function renderResearch() {
  const tabs = document.querySelector('#methods');
  tabs.replaceChildren();

  research.methods.forEach(m => {
    const b = el('button', t(m.id), method === m.id ? 'active' : '');
    b.setAttribute('aria-pressed', m.id === method);
    b.onclick = () => { method = m.id; renderResearch(); };
    tabs.append(b);
  });

  const m = research.methods.find(x => x.id === method);
  const examples=el('ul',undefined,'method-examples');
  m.examples.forEach(example=>examples.append(el('li',example)));
  document.querySelector('#method-detail').replaceChildren(
    el('h3', t(m.id)),
    el('h4', t('methodRule')),
    el('p', local(m.explanation)),
    el('p', local(m.details)),
    el('h4', t('methodExamples')),
    examples
  );

  const charts = document.querySelector('#charts');
  charts.replaceChildren();

  research.charts.forEach(c => {
    const box = el('div', undefined, 'chart');
    box.append(el('h3', t(c.title)));

    c.rows.forEach(row => {
      const label = el('div', undefined, 'bar-label');
      label.append(
        el('span', row.key ? t(row.key) : row.label),
        el('strong', row.value.toLocaleString(document.documentElement.lang) + '%')
      );
      box.append(label);
    });

    charts.append(box);
  });

  document.querySelector('#pairs').replaceChildren(
    ...research.pairs.map(pair => {
      const row = el('div', undefined, 'pair');
      row.append(el('span', pair[0]), el('span', pair[1]));
      return row;
    })
  );
}


async function loadJSON(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`${path}: ${r.status}`);
  return r.json();
}

async function main() {
  const saved = storage.get('it-language', 'kk');
  await setLanguage(['kk', 'ru', 'en'].includes(saved) ? saved : 'kk');

  const [terms, data] = await Promise.all([
    loadJSON('data/terms.json'),
    loadJSON('data/research.json')
  ]);

  research = data;
  initDictionary(terms);
  initQuiz(terms,research.methods);
  renderResearch();

  document.querySelector('#art').onclick = e => e.currentTarget.classList.toggle('shift');

  document.querySelectorAll('[data-lang]').forEach(b => {
    b.onclick = async () => {
      try {
        await setLanguage(b.dataset.lang);
        refreshDictionary();
        renderResearch();
        renderQuiz();
      } catch {
        showLoadError(t('loadError'));
      }
    };
  });
}

function showLoadError(message) {
  const error = document.querySelector('#load-error');
  error.textContent = message;
  error.hidden = false;
}

main().catch(() => {
  showLoadError('Деректер жүктелмеді / Не удалось загрузить данные / Data could not be loaded. HTTP серверін қолданыңыз / Используйте HTTP-сервер / Use an HTTP server.');
});