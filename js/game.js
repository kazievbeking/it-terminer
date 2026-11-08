import{t}from './i18n.js';

let vocabulary=[],deck=[],opened=[],matched=new Set(),moves=0,startedAt=0,elapsed=0,locked=false,interval=null,pending=null;
const PAIRS=6;
const root=document.querySelector('#memory-game');
const shuffle=items=>{const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy};
const el=(tag,text,className)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(className)e.className=className;return e};
export function createDeck(terms){return shuffle(shuffle(terms).slice(0,PAIRS).flatMap(term=>['kk','en'].map(language=>({key:`${term.id}-${language}`,termId:term.id,language,text:term[language]}))))}
function seconds(){return startedAt?Math.floor((Date.now()-startedAt)/1000):elapsed}
function time(){const value=seconds();return `${Math.floor(value/60).toString().padStart(2,'0')}:${(value%60).toString().padStart(2,'0')}`}
function stopClock(){if(interval!==null)clearInterval(interval);interval=null}
function start(){stopClock();if(pending!==null)clearTimeout(pending);pending=null;deck=createDeck(vocabulary);opened=[];matched=new Set();moves=0;startedAt=0;elapsed=0;locked=false;renderGame();root.querySelector('.memory-card')?.focus()}
function flip(key){
 const card=deck.find(x=>x.key===key);
 if(!card||locked||matched.has(card.termId)||opened.includes(key))return;
 if(!startedAt){startedAt=Date.now();interval=setInterval(()=>{const clock=root.querySelector('.game-time');if(clock)clock.textContent=time()},1000)}
 opened.push(key);
 if(opened.length===2){moves++;const first=deck.find(x=>x.key===opened[0]);
  if(first.termId===card.termId){matched.add(card.termId);opened=[];
   if(matched.size===PAIRS){elapsed=seconds();startedAt=0;stopClock()}
  }else{locked=true;pending=setTimeout(()=>{opened=[];locked=false;pending=null;renderGame()},1100)}
 }
 renderGame();
}
export function initGame(terms){vocabulary=terms;renderGame()}
export function renderGame(){
 const focused=document.activeElement?.dataset?.gameCard;
 root.replaceChildren();
 const header=el('div',undefined,'game-toolbar'),stats=el('div',undefined,'game-stats');
 [['gamePairs',`${matched.size} / ${PAIRS}`],['gameMoves',String(moves)],['gameTime',time()]].forEach(([key,value])=>{const stat=el('div');stat.append(el('span',t(key)),el('strong',value,key==='gameTime'?'game-time':undefined));stats.append(stat)});
 header.append(stats);
 const restart=el('button',t(deck.length?'gameRestart':'gameStart'),'secondary');restart.type='button';restart.onclick=start;header.append(restart);root.append(header);
 if(!deck.length){const intro=el('div',undefined,'game-intro');intro.append(el('span','KZ ↔ EN','game-intro-symbol'),el('h3',t('gameReady')),el('p',t('gameInstructions')));root.append(intro);return}
 const grid=el('div',undefined,'memory-grid');grid.setAttribute('role','group');grid.setAttribute('aria-label',t('gameTitle'));
 deck.forEach((card,index)=>{
  const found=matched.has(card.termId),revealed=found||opened.includes(card.key);
  const b=el('button',undefined,`memory-card${revealed?' is-open':''}${found?' is-matched':''}`);b.type='button';b.dataset.gameCard=card.key;
  b.setAttribute('aria-pressed',String(revealed));b.setAttribute('aria-disabled',String(found||locked));
  b.setAttribute('aria-label',revealed?`${card.language.toUpperCase()}: ${card.text}${found?' · '+t('gameMatched'):''}`:`${t('gameCard')} ${index+1} · ${t('gameReveal')}`);
  if(revealed)b.append(el('small',card.language==='kk'?'KZ':'EN'),el('strong',card.text),el('span',found?'✓':'↔','memory-mark'));
  else b.append(el('span','{ }','memory-back'),el('small',t('gameReveal')));
  b.onclick=()=>flip(card.key);grid.append(b);
 });root.append(grid);
 const done=matched.size===PAIRS,status=el('p',done?`${t('gameWin')} ${t('gameMoves')}: ${moves} · ${t('gameTime')}: ${time()}`:locked?t('gameTryAgain'):t('gameInstructions'),done?'game-status game-win':'game-status');status.setAttribute('role','status');root.append(status);
 if(focused)root.querySelector(`[data-game-card="${focused}"]`)?.focus();
}
