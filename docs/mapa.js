/* Painted atlas with exploration mask. No movement or puzzle hints. */
(()=>{'use strict';
const points={clearing:[358,342,'Rozcestí'],mill:[133,300,'Mlýn'],bridge:[354,212,'Most'],tower:[354,144,'Nádvoří'],crypt:[208,129,'Krypta'],observatory:[354,65,'Hvězdárna'],cave:[475,40,'Jeskyně']};
const edges=[['clearing','mill'],['clearing','bridge'],['bridge','tower'],['tower','crypt'],['tower','observatory'],['tower','cave']];
const art=new Image();let latest=null,ready=false,failed=false;
art.onload=()=>{ready=true;if(latest)draw(...latest)};
art.onerror=()=>{failed=true;if(latest)draw(...latest)};
art.src='assets/mapa_udoli.png';
function draw(state,rooms,crt){
 const canvas=document.getElementById('mapCanvas'),ctx=canvas.getContext('2d');
 const seen=new Set([...state.visited,state.room]);const W=640,H=427;
 ctx.imageSmoothingEnabled=false;ctx.fillStyle='#090e22';ctx.fillRect(0,0,W,H);
 // Deterministic stippled unexplored terrain, not a view of undiscovered buildings.
 for(let y=0;y<H;y+=4)for(let x=0;x<W;x+=4){let n=(x*137+y*71+x*y)%29;ctx.fillStyle=n<5?'#141c35':n<12?'#10172c':'#0b1024';ctx.fillRect(x,y,2,2)}
 if(ready){
 ctx.save();ctx.beginPath();
 if(seen.size===7)ctx.rect(0,0,W,H);
 for(const id of seen){const p=points[id];if(!p)continue;ctx.moveTo(p[0]+74,p[1]);ctx.ellipse(p[0],p[1],74,id==='observatory'?38:54,0,0,Math.PI*2)}
 for(const [a,b] of edges){if(!seen.has(a)||!seen.has(b))continue;const [x,y]=points[a],[u,v]=points[b];const dx=u-x,dy=v-y,L=Math.hypot(dx,dy),nx=-dy/L*19,ny=dx/L*19;ctx.moveTo(x-nx,y-ny);ctx.lineTo(u-nx,v-ny);ctx.lineTo(u+nx,v+ny);ctx.lineTo(x+nx,y+ny);ctx.closePath()}
 ctx.clip();ctx.drawImage(art,0,0,W,H);ctx.restore();
 }
 ctx.font='12px "Courier New",monospace';ctx.textAlign='center';ctx.textBaseline='middle';
 for(const id of seen){const p=points[id];if(!p)continue;const [x,y,label]=p;const current=id===state.room;
 ctx.fillStyle=current?'#f8d584':'#b4e9ed';ctx.fillRect(x-2,y-2,5,5);
 if(current){ctx.strokeStyle='#ffe1a0';ctx.lineWidth=2;ctx.strokeRect(x-6,y-6,13,13)}
 const ly=y+(id==='observatory'?-26:21),w=ctx.measureText(label).width+12;
 ctx.fillStyle='#090e22e8';ctx.fillRect(x-w/2,ly-9,w,18);ctx.fillStyle=current?'#ffe4a2':'#c1e7f4';ctx.fillText(label,x,ly);
 }
 if(crt){ctx.fillStyle='#02041136';for(let y=1;y<H;y+=3)ctx.fillRect(0,y,W,1)}
 document.getElementById('mapPosition').textContent='Jsi zde: '+rooms[state.room].title;
 document.getElementById('mapStatus').textContent=failed?'Kresbu mapy se nepodařilo načíst.':ready?'Zaznamenaná místa · '+seen.size+' / 7':'Rozvíjíš mapu…';
 canvas.setAttribute('aria-label','Mapa. '+rooms[state.room].title+'. Navštívená místa: '+[...seen].filter(id=>rooms[id]).map(id=>rooms[id].title).join(', '));
}
globalThis.openWorldMap=(state,rooms,crt)=>{latest=[JSON.parse(JSON.stringify(state)),rooms,crt];draw(...latest);document.getElementById('mapDialog').showModal()};
document.getElementById('mapClose').onclick=()=>document.getElementById('mapDialog').close();
})();
