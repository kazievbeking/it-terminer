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
  document.querySelector('#method-detail').replaceChildren(
    el('h3', t(m.id)),
    el('p', local(m.explanation)),
    el('p', `${t('illustration')}: ${m.example}.`)
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

    const source = el('a', t('chartSource') + ' · TILTANYM 2023 · ' + t('pageLabel') + ' ' + c.sourcePage, 'chart-source');
    source.href = research.source.pdf + '#page=' + c.sourcePage;
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    box.append(source);
    
    charts.append(box);
  });

  renderStatisticsSource();

  document.querySelector('#pairs').replaceChildren(
    ...research.pairs.map(pair => {
      const row = el('div', undefined, 'pair');
      row.append(el('span', pair[0]), el('span', pair[1]));
      return row;
    })
  );
}

function renderStatisticsSource() {
  const source = research.source;
  const root = document.querySelector('#statistics-source');
  
  const pdf = el('a', t('sourceOpen'));
  pdf.href = source.pdf + '#page=169';
  pdf.target = '_blank';
  pdf.rel = 'noopener noreferrer';
  
  const doi = el('a', t('sourceDOI'));
  doi.href = source.doi;
  doi.target = '_blank';
  doi.rel = 'noopener noreferrer';
  
  const links = el('div', undefined, 'source-links');
  links.append(pdf, doi);
  
  root.replaceChildren(
    el('h3', t('sourceHeading')),
    el('p', source.authors),
    el('p', source.title),
    el('p', source.publication),
    el('p', t('sourcePages')),
    links
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
  initQuiz(terms);
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
