import { loadLocalStaticFiles } from './covid-data-load-local-static-files';

// note: to rebuild, drop and create desired tables then run

(async () => {
  try {
    await loadLocalStaticFiles();
  } catch (err) {
    console.log('error:', err.message);
    process.exit(1); // ??? see ttd links in readme to improve the approach
  }
})();
