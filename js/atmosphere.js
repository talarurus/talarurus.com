// ascii.rest 0.3.0, pinned and self-hosted. Full MIT notice is in assets/vendor.
import {mount} from '/assets/vendor/ascii-rest/0.3.0/mount.js';
import * as saptarishi from '/assets/vendor/ascii-rest/0.3.0/saptarishi.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
for(const el of document.querySelectorAll('[data-ascii="saptarishi"]')) {
 const canvas=el.querySelector('canvas'),button=el.querySelector('button');
 let stop,paused=false;
 function start(){stop=mount(canvas,saptarishi,{fps:12})}
 try {
  canvas.hidden=false;start();el.classList.add('is-ready');button.hidden=reduced.matches;
  button.addEventListener('click',()=>{paused=!paused;if(paused)stop?.();else start();button.textContent=paused?'Resume stars':'Pause stars';button.setAttribute('aria-pressed',String(paused))});
  reduced.addEventListener('change',()=>{button.hidden=reduced.matches});
  addEventListener('pagehide',()=>stop?.());
  addEventListener('pageshow',e=>{if(e.persisted&&!paused)start()});
 } catch {canvas.hidden=true;el.classList.remove('is-ready');button.hidden=true}
}
