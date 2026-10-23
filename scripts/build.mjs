import {cp, mkdir, rm} from 'node:fs/promises';
await rm('dist', {recursive: true, force: true});
await mkdir('dist');
for (const file of ['index.html', 'styles/site.css', 'js/app.js', 'js/projects.js', 'images', 'fonts', 'videos']) {
  await cp(file, `dist/${file}`, {recursive: true});
}
console.log('Built static portfolio in dist/');
