const spawn = require('child_process').spawn;

function spawnPromise(cmd, args, message) {
  return new Promise((resolve, reject) => {
    let child = spawn(cmd, args);

    if (message) {
      console.log(message);
    }

    child.stdout.on('data', function (data) {
      console.log(data.toString());
    });

    child.on('close', resolve);
    child.on('error', reject);

    child.stderr.on('data', function (err) {
      console.error(err.toString());
    });
  });
}

module.exports = spawnPromise;
