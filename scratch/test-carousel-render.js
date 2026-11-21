const { spawn, execFileSync } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

async function testCarousel() {
  console.log('Starting production server on port 3007...');
  const server = spawn('cmd.exe', ['/c', 'npx', 'next', 'start', '-p', '3007'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => process.stdout.write(d.toString()));
  server.stderr.on('data', (d) => process.stderr.write(d.toString()));

  let ready = false;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    try {
      await new Promise((resolve, reject) => {
        const req = http.get('http://localhost:3007', (res) => {
          if (res.statusCode === 200) {
            ready = true;
            resolve();
          } else reject(new Error('Status ' + res.statusCode));
        });
        req.on('error', reject);
      });
      if (ready) break;
    } catch (e) {}
  }

  if (!ready) {
    console.error('Server failed to start on 3007');
    server.kill();
    process.exit(1);
  }

  console.log('Server ready at http://localhost:3007');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const desktopOut = path.resolve(__dirname, '../public/carousel-desktop-1440.png');
  const mobileOut = path.resolve(__dirname, '../public/carousel-mobile-390.png');

  try {
    // Desktop screenshot (1440px width)
    execFileSync(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--window-size=1440,900',
      '--screenshot=' + desktopOut,
      'http://localhost:3007',
    ]);
    console.log('Desktop screenshot saved:', desktopOut);

    // Mobile screenshot (390px width)
    execFileSync(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--window-size=390,844',
      '--screenshot=' + mobileOut,
      'http://localhost:3007',
    ]);
    console.log('Mobile screenshot saved:', mobileOut);
  } catch (err) {
    console.error('Chrome screenshot error:', err);
  } finally {
    server.kill();
    console.log('Test completed.');
    process.exit(0);
  }
}

testCarousel();
