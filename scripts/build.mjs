import { mkdir,copyFile,cp,rm,access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
await rm(root+'dist/assets',{recursive:true,force:true});
await mkdir(root+'dist',{recursive:true});
for(const name of ['index.html','app.css','app.js','treinos.css','treinos.js','experience.js','videos.js'])await copyFile(root+name,root+'dist/'+name);
try{await access(root+'qa.html');await copyFile(root+'qa.html',root+'dist/qa.html');}catch{}
await cp(root+'assets',root+'dist/assets',{recursive:true});
console.log('Static site prepared.');
