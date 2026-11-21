const { execFileSync } = require('child_process');
const path = require('path');

const cwd = path.resolve(__dirname, '..');

function run(cmd, args) {
  console.log(`> ${cmd} ${args.join(' ')}`);
  try {
    const out = execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['inherit', 'pipe', 'pipe'] });
    console.log(out);
    return out;
  } catch (err) {
    console.error(`Error executing ${cmd}:`, err.message);
    if (err.stdout) console.log('Stdout:', err.stdout);
    if (err.stderr) console.error('Stderr:', err.stderr);
    throw err;
  }
}

try {
  run('git', ['add', '.']);
  run('git', ['commit', '-m', 'feat: replace hero image with auto-rotating product carousel']);
  console.log('Pushing to develop branch on origin...');
  run('git', ['push', '-u', 'origin', 'develop']);
  console.log('Successfully pushed to develop!');
} catch (e) {
  process.exit(1);
}
