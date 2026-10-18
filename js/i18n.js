export let lang='kk';
let messages={};
export const t=key=>messages[key]??key;
export const local=value=>typeof value==='object'?(value[lang]??value.kk):value;
export const storage={get(key,fallback=null){try{return localStorage.getItem(key)??fallback}catch{return fallback}},set(key,value){try{localStorage.setItem(key,value)}catch{}}};
export async function setLanguage(next){
 const response=await fetch(`locales/${next}.json`);if(!response.ok)throw new Error('Locale unavailable');
 messages=await response.json();lang=next;document.documentElement.lang=lang;storage.set('it-language',lang);
 document.querySelectorAll('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));
 document.querySelectorAll('[data-placeholder]').forEach(el=>el.placeholder=t(el.dataset.placeholder));
 document.querySelectorAll('[data-lang]').forEach(el=>{el.classList.toggle('active',el.dataset.lang===lang);el.setAttribute('aria-pressed',el.dataset.lang===lang)});
 document.querySelector('#close-dialog').setAttribute('aria-label',t('close'));
}
