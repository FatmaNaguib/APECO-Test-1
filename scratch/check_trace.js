const fs = require('fs');
const path = 'd:/AI/APECO-Test-1/test-results/Admin Initial approval-App-f10ef-lly-submits-return-workflow-chromium/unzipped_trace/3-trace.trace';
const lines = fs.readFileSync(path, 'utf8').split('\n').filter(Boolean);

for (const line of lines) {
  try {
    const obj = JSON.parse(line);
    if (obj.type === 'frame-snapshot') {
      const html = JSON.stringify(obj.snapshot);
      if (html.includes('Search Services')) {
        console.log('Found snapshot with Search Services! Length:', html.length);
        const matches = html.match(/<[^>]+class="[^"]*spin[^"]*"[^>]*>/gi);
        console.log('Spin elements:', matches);
        const loaderMatches = html.match(/<[^>]+(loading|spinner|loader)[^>]*>/gi);
        console.log('Loader elements:', loaderMatches);
      }
    }
  } catch (e) {}
}
