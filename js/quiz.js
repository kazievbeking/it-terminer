import{t,local,storage}from './i18n.js';
let terms=[],methods=[],questions=[],index=0,answers=[],started=false,draft={};
const panel=document.querySelector('#quiz-panel');
export function shuffled(items){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}return result}
const element=(tag,text,className)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(className)e.className=className;return e};
function button(text,fn,primary=false){const b=element('button',text,primary?'primary':undefined);b.type='button';b.onclick=fn;return b}
export function buildQuestions(vocabulary,formationMethods){
 const selected=shuffled(vocabulary).slice(0,10);
 const choices=term=>shuffled([term,...shuffled(vocabulary.filter(x=>x.id!==term.id)).slice(0,3)]);
 const translation=selected.slice(0,5).map(term=>({type:'translation',term,options:choices(term),from:Math.random()<.5?'en':'ru'}));
 const matching=[0,1].map(n=>{const pairs=shuffled(vocabulary).slice(0,3);return{type:'matching',pairs,options:shuffled(pairs),from:n===0?'en':'ru'}});
 const formation=shuffled(formationMethods.flatMap(m=>(m.quizExamples||[]).map(example=>({type:'formation',method:m,example,options:shuffled([m,...shuffled(formationMethods.filter(x=>x.id!==m.id)).slice(0,3)])})))).slice(0,2);
 const term=selected[5];return shuffled([...translation,...matching,...formation,{type:'definition',term,options:choices(term)}]);
}
export function initQuiz(data,formationMethods){terms=data;methods=formationMethods;renderQuiz()}
function start(){questions=buildQuestions(terms,methods);index=0;answers=[];draft={};started=true;renderQuiz()}
function submit(value){const q=questions[index];let correct;
 if(q.type==='matching')correct=q.pairs.every(x=>String(value[x.id])===String(x.id));
 else correct=String(value)===String(q.type==='formation'?q.method.id:q.term.id);
 answers[index]={value,correct};renderQuiz();panel.querySelector('.feedback')?.focus();
}
function showLastResult(){let last;try{last=JSON.parse(storage.get('it-last-v2','null'))}catch{}document.querySelector('#last-result').textContent=last?`${t('lastResult')}: ${last.score}/${last.total}`:''}
function renderMatching(q,answered){
 const rows=element('div',undefined,'matching-rows');
 q.pairs.forEach(term=>{const row=element('label',undefined,'matching-row');row.append(element('span',term[q.from]));
  const select=element('select');select.setAttribute('aria-label',`${t('matchSelect')} ${term[q.from]}`);
  const placeholder=element('option',t('matchSelect'));placeholder.value='';select.append(placeholder);
  q.options.forEach(x=>{const o=element('option',x.kk);o.value=String(x.id);select.append(o)});
  select.value=String((answered?answers[index].value:draft)[term.id]??'');select.disabled=answered;
  select.onchange=()=>{draft[term.id]=select.value;check.disabled=!q.pairs.every(x=>draft[x.id])};row.append(select);rows.append(row);
 });panel.append(rows);
 const check=button(t('checkAnswer'),()=>submit({...draft}),true);check.disabled=!q.pairs.every(x=>draft[x.id]);if(!answered)panel.append(check);
}
export function renderQuiz(){
 showLastResult();panel.replaceChildren();
 if(!started){panel.append(element('p',t('quizReady')),button(t('start'),start,true));return}
 if(index===questions.length){const score=answers.filter(x=>x.correct).length;storage.set('it-last-v2',JSON.stringify({score,total:questions.length}));showLastResult();panel.append(element('h3',`${t('result')}: ${score} / ${questions.length}`),element('p',t('resultHint')),button(t('retry'),start,true));return}
 const q=questions[index],answered=Boolean(answers[index]);panel.append(element('p',`${t('question')} ${index+1} / ${questions.length}`,'eyebrow'),element('span',t('type_'+q.type),'quiz-type'));
 let prompt;if(q.type==='translation')prompt=`${t('chooseEquivalent')} «${q.term[q.from]}»`;if(q.type==='matching')prompt=t('matchPrompt');if(q.type==='definition')prompt=t('definitionPrompt');if(q.type==='formation')prompt=`${t('formationPrompt')} «${q.example}»`;
 panel.append(element('h3',prompt));if(q.type==='definition')panel.append(element('p',local(q.term.definition),'quiz-definition'));
 if(q.type==='matching')renderMatching(q,answered);
 else q.options.forEach(x=>{const b=button(q.type==='formation'?t(x.id):x.kk,()=>submit(x.id));b.disabled=answered;if(answered&&String(answers[index].value)===String(x.id))b.className='chosen';panel.append(b)});
 if(answered){const feedback=element('div',undefined,'feedback');feedback.setAttribute('role','status');feedback.setAttribute('tabindex','-1');feedback.append(element('strong',answers[index].correct?t('correct'):t('incorrect')));
  if(q.type==='matching'){const list=element('ul');q.pairs.forEach(x=>list.append(element('li',`${x[q.from]} — ${x.kk}`)));feedback.append(list)}
  else if(q.type==='formation')feedback.append(element('p',`${t(q.method.id)}. ${local(q.method.explanation)}`));
  else feedback.append(element('p',`${q.term.kk} — ${q.term.ru} — ${q.term.en}. ${local(q.term.definition)}`));
  panel.append(feedback,button(t(index===questions.length-1?'finish':'next'),()=>{index++;draft={};renderQuiz();panel.querySelector('h3')?.setAttribute('tabindex','-1');panel.querySelector('h3')?.focus()},true));
 }
}
