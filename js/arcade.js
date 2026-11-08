import{t,storage}from './i18n.js';
const levels={easy:{pairs:4,seconds:60},normal:{pairs:5,seconds:60},hard:{pairs:6,seconds:45}};
let terms=[],level='easy',phase='ready',score=0,combo=0,lives=3,solved=0,round=1,left=[],right=[],matched=new Set(),selected={en:null,kk:null},remaining=60000,deadline=0,ticker=null,pending=null,locked=false,feedback='',opener=null,lastIds=[];
const dialog=document.querySelector('#game-dialog'),root=document.querySelector('#arcade');
const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e};
const shuffle=items=>{const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}return result};
function button(label,action,cls='secondary'){const b=el('button',label,cls);b.type='button';b.onclick=action;return b}
function clearTimers(){if(ticker!==null)clearInterval(ticker);if(pending!==null)clearTimeout(pending);ticker=null;pending=null}
function newBoard(){const fresh=shuffle(terms.filter(x=>!lastIds.includes(x.id))),rest=shuffle(terms.filter(x=>lastIds.includes(x.id)));left=[...fresh,...rest].slice(0,levels[level].pairs);right=shuffle(left);lastIds=left.map(x=>x.id);matched=new Set();selected={en:null,kk:null};locked=false}
function tick(){if(phase!=='playing')return;remaining=Math.max(0,deadline-Date.now());if(!remaining){finish();return}const time=root.querySelector('.arcade-clock');if(time)time.textContent=String(Math.ceil(remaining/1000));const bar=root.querySelector('.arcade-timer-fill');if(bar)bar.style.width=`${remaining/(levels[level].seconds*1000)*100}%`}
function startClock(){deadline=Date.now()+remaining;ticker=setInterval(tick,150)}
function start(){clearTimers();score=0;combo=0;lives=3;solved=0;round=1;lastIds=[];remaining=levels[level].seconds*1000;phase='playing';feedback='';newBoard();startClock();renderGame()}
function pause(){if(phase!=='playing')return;remaining=Math.max(0,deadline-Date.now());clearTimers();locked=false;selected={en:null,kk:null};phase=remaining>0?'paused':'finished';if(phase==='finished')finish();else renderGame()}
function resume(){if(phase!=='paused')return;if(matched.size===left.length){round++;newBoard()}phase='playing';startClock();renderGame()}
function finish(){clearTimers();phase='finished';locked=false;const best=Number(storage.get(`it-arcade-best-${level}`,'0'))||0;if(score>best)storage.set(`it-arcade-best-${level}`,String(score));renderGame()}
function choose(language,id){
 if(phase!=='playing'||locked||matched.has(id))return;
 if(Date.now()>=deadline){remaining=0;finish();return}
 selected[language]=selected[language]===id?null:id;
 if(selected.en!==null&&selected.kk!==null){
  if(selected.en===selected.kk){combo++;solved++;score+=100*Math.min(3,1+Math.floor((combo-1)/3));matched.add(id);const term=terms.find(x=>x.id===id);feedback=`${term.en} ↔ ${term.kk} · +${100*Math.min(3,1+Math.floor((combo-1)/3))}`;selected={en:null,kk:null};
   if(matched.size===left.length){locked=true;pending=setTimeout(()=>{pending=null;if(phase==='playing'){round++;newBoard();renderGame()}},600)}
  }else{combo=0;lives--;feedback='miss';selected={en:null,kk:null};if(!lives){finish();return}}
 }
 renderGame();
 const buttons=[...root.querySelectorAll('.arcade-tile')];(buttons.find(b=>b.dataset.arcadeKey===`${language}-${id}`&&!b.disabled)||buttons.find(b=>!b.disabled))?.focus();
}
export function initGame(data){terms=data;document.querySelector('#open-game').onclick=e=>{opener=e.currentTarget;dialog.showModal();renderGame()};document.querySelector('#close-game').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{pause();opener?.focus()});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});renderGame()}
export function renderGame(){
 document.querySelector('#close-game').setAttribute('aria-label',t('close'));root.replaceChildren();
 const header=el('div',undefined,'arcade-heading');const title=el('h2',t('arcadeTitle'));title.id='arcade-title';header.append(el('span','KZ ↔ EN','arcade-badge'),title,el('p',t('arcadeRules')));root.append(header);
 if(phase==='ready'){
  const modes=el('div',undefined,'arcade-levels');Object.keys(levels).forEach(id=>{const b=button(t('arcade_'+id),()=>{level=id;renderGame()},level===id?'arcade-level active':'arcade-level');b.setAttribute('aria-pressed',String(level===id));b.append(el('small',`${levels[id].pairs} ${t('gamePairs')} · ${levels[id].seconds} ${t('arcadeSeconds')}`));modes.append(b)});
  root.append(modes,el('p',t('arcadeScoring'),'arcade-hint'),button(t('gameStart'),start,'primary arcade-start'));return;
 }
 const stats=el('div',undefined,'arcade-stats');[['arcadeScore',score],['arcadeCombo',`×${Math.min(3,1+Math.floor((combo-1)/3))||1}`],['arcadeLives',`${lives} / 3`],['gameTime',Math.ceil(remaining/1000)]].forEach(([key,value])=>{const cell=el('div');cell.append(el('small',t(key)),el('strong',String(value),key==='gameTime'?'arcade-clock':undefined));stats.append(cell)});root.append(stats);
 if(phase==='finished'){
  root.append(el('div','✦','arcade-trophy'),el('h3',t(lives?'arcadeTimeUp':'arcadeNoLives')),el('p',`${t('arcadeSolved')}: ${solved} · ${t('arcadeBest')}: ${storage.get(`it-arcade-best-${level}`,'0')}`),button(t('gameRestart'),start,'primary arcade-start'),button(t('arcadeModes'),()=>{phase='ready';renderGame()}));return;
 }
 if(phase==='paused'){root.append(el('h3',t('arcadePaused')),el('p',t('arcadePausedHint')),button(t('arcadeResume'),resume,'primary arcade-start'));return}
 const timer=el('div',undefined,'arcade-timer');const fill=el('div',undefined,'arcade-timer-fill');fill.style.width=`${remaining/(levels[level].seconds*1000)*100}%`;timer.append(fill);root.append(timer);
 const board=el('div',undefined,'arcade-board');[['en',left],['kk',right]].forEach(([language,list])=>{const col=el('div',undefined,'arcade-column');col.append(el('h3',language==='en'?'ENGLISH':'ҚАЗАҚША'));list.forEach(term=>{const found=matched.has(term.id),active=selected[language]===term.id;const b=button(term[language]+(found?' ✓':''),()=>choose(language,term.id),`arcade-tile${found?' matched':''}${active?' selected':''}`);b.dataset.arcadeKey=`${language}-${term.id}`;b.setAttribute('aria-pressed',String(active));b.disabled=found||locked;col.append(b)});board.append(col)});root.append(board);
 const status=el('p',feedback==='miss'?t('arcadeMiss'):feedback||t('arcadeChoose'),'arcade-feedback');status.setAttribute('role','status');root.append(status,button(t('arcadePause'),pause));
}
