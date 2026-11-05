(()=>{'use strict';
const dialog=document.querySelector('.b-viewer'),view=dialog.querySelector('.b-viewport'),img=view.querySelector('img'),caption=dialog.querySelector('.b-caption');
let scale=1,tx=0,ty=0,origin=null,focusBefore=null,points=new Map(),pinch=null;
const clamp=n=>Math.min(6,Math.max(1,n));
function paint(){img.style.transform=`translate(${tx}px,${ty}px) scale(${scale})`;}
function reset(){scale=1;tx=ty=0;paint();}
function zoom(factor){scale=clamp(scale*factor);if(scale===1)tx=ty=0;paint();}
function position(b){scale=clamp(Number(b.dataset.scale)||1);tx=(.5-Number(b.dataset.x||.5))*img.offsetWidth*scale;ty=(.5-Number(b.dataset.y||.5))*img.offsetHeight*scale;paint();}
document.querySelectorAll('[data-image]').forEach(b=>b.addEventListener('click',()=>{
 focusBefore=b;points.clear();pinch=null;reset();caption.textContent=b.dataset.caption;img.alt=b.getAttribute('aria-label')||'';img.onload=()=>position(b);img.src=b.dataset.image;dialog.showModal();document.body.classList.add('b-modal-open');requestAnimationFrame(()=>{if(img.complete)position(b);});
}));
dialog.querySelector('.b-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.classList.remove('b-modal-open');points.clear();if(focusBefore)focusBefore.focus();});
dialog.querySelectorAll('[data-zoom]').forEach(b=>b.addEventListener('click',()=>b.dataset.zoom==='reset'?reset():zoom(b.dataset.zoom==='plus'?1.3:1/1.3)));
view.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?1.12:1/1.12);},{passive:false});
view.addEventListener('pointerdown',e=>{view.setPointerCapture(e.pointerId);points.set(e.pointerId,{x:e.clientX,y:e.clientY});origin={x:e.clientX,y:e.clientY,tx,ty};if(points.size===2){const p=[...points.values()];pinch={dist:Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y),scale};}});
view.addEventListener('pointermove',e=>{if(!points.has(e.pointerId))return;points.set(e.pointerId,{x:e.clientX,y:e.clientY});if(points.size===2&&pinch){const p=[...points.values()];scale=clamp(pinch.scale*Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)/pinch.dist);paint();}else if(origin&&scale>1){tx=origin.tx+e.clientX-origin.x;ty=origin.ty+e.clientY-origin.y;paint();}});
function end(e){points.delete(e.pointerId);pinch=null;if(points.size===1){const p=[...points.values()][0];origin={x:p.x,y:p.y,tx,ty};}else origin=null;}
view.addEventListener('pointerup',end);view.addEventListener('pointercancel',end);
})();
