const lt = require('localtunnel');
const opts = {"port":3000};
lt(opts).then(t => {
  console.log('TUNNEL_URL=' + t.url);
  process.stdin.resume();
  t.on('close', () => process.exit(0));
}).catch(e => {
  console.error('TUNNEL_ERROR=' + e.message);
  process.exit(1);
});