import http from 'http';

const req = http.request({
    hostname: 'localhost',
    port: 8000,
    path: '/api/notifications',
    method: 'DELETE',
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('STATUS:', res.statusCode, 'DATA:', data));
});
req.on('error', console.error);
req.end();
