// Volitelná kontrola před publikací: node VERIFY_PAGES.cjs
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const docs=path.join(__dirname,'docs');
const html=fs.readFileSync(path.join(docs,'HRA.html'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(docs,'manifest.webmanifest'),'utf8'));
const worker=fs.readFileSync(path.join(docs,'sw.js'),'utf8');
const registry={install:null,activate:null,fetch:null};
const self={location:{origin:'https://example.github.io'},registration:{scope:'https://example.github.io/jeskyne/'},addEventListener:(name,fn)=>registry[name]=fn};
const files=vm.runInNewContext(worker+'\nFILES;', {self,caches:{},URL,Response,Promise,console});
let checks=0;
assert(fs.existsSync(path.join(docs,'.nojekyll')));checks++;
assert(fs.readFileSync(path.join(docs,'index.html'),'utf8').includes('HRA.html'));checks++;
for(const url of files){
 assert(!url.startsWith('/')&&!url.includes('..'),`Non-relative path ${url}`);
 const target=path.join(docs,url);
 if(url!=='./')assert(fs.statSync(target).isFile(),`Missing offline file: ${url}`);
 checks+=2;
}
for(const [,src] of html.matchAll(/<script\s+(?:defer\s+)?src="([^"]+)"/g)){
 assert(files.includes('./'+src),`Script missing from offline cache: ${src}`);checks++;
}
for(const [,href]of html.matchAll(/(?:href)="([^"]+)"/g)){
 if(href.startsWith('http'))continue;
 assert(fs.existsSync(path.join(docs,href)),`Missing linked file ${href}`);checks++;
}
assert.equal(manifest.start_url,'./HRA.html');assert.equal(manifest.scope,'./');checks+=2;
for(const icon of manifest.icons){assert(files.includes('./'+icon.src));checks++}
for(const file of fs.readdirSync(path.join(docs,'assets'))){
 assert(files.includes('./assets/'+file),`Asset not included in offline snapshot: ${file}`);checks++;
}
assert(Object.values(registry).every(v=>typeof v==='function'),'Service worker event handlers missing');checks++;
assert(html.includes('id="mobileNav"')&&html.includes('viewport-fit=cover'),'Mobile UI not present');checks++;
assert(!html.includes('MOBILE_NAVOD.txt'),'Old LAN-only instructions leaked');checks++;
console.log('PASSED '+checks+' checks: relative GitHub Pages paths, PWA pre-cache, manifests, assets, mobile UI.');
