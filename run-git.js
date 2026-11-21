const { execSync } = require('child_process');
const fs = require('fs');

try {
  if (fs.existsSync('commit-and-push.js')) {
    fs.unlinkSync('commit-and-push.js');
  }

  console.log('Staging files...');
  execSync('git add -A', { stdio: 'inherit' });

  console.log('Committing changes...');
  const msg = 'style: establish unified brand color tokens, eliminate AI styling and update footer contact link';
  execSync(`git commit -m "${msg}"`, { stdio: 'inherit' });

  console.log('Pushing to develop...');
  execSync('git push origin develop', { stdio: 'inherit' });

  console.log('Successfully committed and pushed!');
} catch (error) {
  console.error('Git execution failed:', error.message);
  process.exit(1);
} finally {
  if (fs.existsSync('run-git.js')) {
    fs.unlinkSync('run-git.js');
  }
}
