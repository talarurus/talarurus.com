// Progressive enhancement. Navigation and content work without JavaScript.
(() => {
 document.documentElement.classList.add('js');
 const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
 function close(){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false')}
 toggle.hidden=false;
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){close();toggle.focus()}});
 nav.addEventListener('click',e=>{if(e.target.closest('a'))close()});
 matchMedia('(min-width:681px)').addEventListener('change',close);
 document.querySelectorAll('.report').forEach(report=>{
  const tabs=[...report.querySelectorAll('[role=tab]')];
  function select(tab){report.querySelector('[data-copy]').dataset.copy=tab.textContent==='JSON'?'hammerhead audit ./demo-repository --output json':'hammerhead audit ./demo-repository --quiet';for(const t of tabs){const chosen=t===tab;t.setAttribute('aria-selected',String(chosen));t.tabIndex=chosen?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!chosen}}
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(tab));tab.addEventListener('keydown',e=>{let index;if(e.key==='ArrowRight')index=(i+1)%tabs.length;else if(e.key==='ArrowLeft')index=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=tabs.length-1;else return;e.preventDefault();select(tabs[index]);tabs[index].focus()})});
 });
 if(navigator.clipboard&&isSecureContext)document.querySelectorAll('[data-copy]').forEach(b=>{
  b.hidden=false;let timer;const original=b.textContent;
  b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);b.textContent='Copied';document.getElementById('copy-status').textContent='Copied to clipboard.';clearTimeout(timer);timer=setTimeout(()=>{b.textContent=original;document.getElementById('copy-status').textContent=''},2000)}catch{document.getElementById('copy-status').textContent='Copy unavailable. Select the command instead.'}});
 });
})();
