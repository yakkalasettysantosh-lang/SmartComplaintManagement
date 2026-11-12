/**
 * In-Process End-to-End Test Suite Runner
 * Starts server, executes all API assertions asynchronously, shuts down.
 */

async function main() {
  console.log('====================================================');
  console.log(' Booting Server for End-to-End Verification Suite');
  console.log('====================================================\n');

  // Load server module
  require('../server');

  // Wait for server health
  let ready = false;
  for (let i = 0; i < 25; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const res = await fetch('http://localhost:5000/api/health');
      const data = await res.json();
      if (data.status === 'online') {
        ready = true;
        break;
      }
    } catch (e) {
      // waiting for server boot...
    }
  }

  if (!ready) {
    console.error(' Server failed to respond to health check within timeout.');
    process.exit(1);
  }

  console.log(' Server is online and ready.');
  console.log(' Running test assertions asynchronously...\n');

  // Import and run test suite asynchronously so Express event loop is free!
  const { runTests } = require('./e2e-verification');
  await runTests();

  console.log('\n Test suite finished successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n Test execution failed:', err);
  process.exit(1);
});
