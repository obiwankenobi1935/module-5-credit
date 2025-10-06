const axios = require('axios');

const BASE = process.env.BASE || 'http://localhost:3000'; // set to ALB DNS
const location = process.env.LOC || 'SeminarA';

function rand(min, max) { return Math.round(min + Math.random() * (max - min)); }

(async function loop() {
  try {
    const payload = {
      location,
      temperature: rand(20, 30),
      humidity: rand(40, 70),
      description: 'sim'
    };
    const { data } = await axios.post(`${BASE}/api/sensors`, payload, { timeout: 4000 });
    const who = await axios.get(`${BASE}/whoami`);
    console.log(`[POST] ${JSON.stringify(payload)} | served_by=${who.data.host}`);
  } catch (e) {
    console.log('post error:', e.message);
  } finally {
    setTimeout(loop, 2000);
  }
})();
