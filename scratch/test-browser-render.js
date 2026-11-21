const { spawn, execFileSync } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

async function testPage() {
  console.log('Starting production server on port 3006...');
  const server = spawn('cmd.exe', ['/c', 'npx', 'next', 'start', '-p', '3006'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => process.stdout.write(d.toString()));
  server.stderr.on('data', (d) => process.stderr.write(d.toString()));

  // Wait for server to be responsive
  let ready = false;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    try {
      await new Promise((resolve, reject) => {
        const req = http.get('http://localhost:3006/custom/3d-printing', (res) => {
          if (res.statusCode === 200) {
            ready = true;
            resolve();
          } else reject(new Error('Status ' + res.statusCode));
        });
        req.on('error', reject);
      });
      if (ready) break;
    } catch (e) {
      // retry
    }
  }

  if (!ready) {
    console.error('Server failed to start on 3006');
    server.kill();
    process.exit(1);
  }

  console.log('Server ready at http://localhost:3006/custom/3d-printing');

  // Capture desktop screenshot using Headless Chrome
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const outPath = path.resolve(__dirname, '../public/test-custom-3d-printing.png');

  try {
    execFileSync(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--window-size=1440,1600',
      '--screenshot=' + outPath,
      'http://localhost:3006/custom/3d-printing',
    ]);
    console.log('Screenshot successfully captured to:', outPath);
  } catch (err) {
    console.error('Chrome screenshot error:', err);
  } finally {
    server.kill();
    process.exit(0);
  }
}

testPage();
