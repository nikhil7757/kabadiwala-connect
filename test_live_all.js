const BASE = 'https://kabadiwala-connect-henna.vercel.app/api/v1';

async function testAll() {
  console.log('--- 1. Testing Staff / Admin Login ---');
  const adminLoginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@sample.kc', password: 'Demo@1234' }),
  });
  const adminData = await adminLoginRes.json();
  console.log(`[${adminLoginRes.status}] Admin Login:`, adminData.data ? `User: ${adminData.data.user.name} (${adminData.data.user.role})` : adminData.error);

  if (adminData.data?.token) {
    const adminToken = adminData.data.token;
    const authHeader = { Authorization: `Bearer ${adminToken}` };

    const meRes = await fetch(`${BASE}/auth/me`, { headers: authHeader });
    const meData = await meRes.json();
    console.log(`[${meRes.status}] /auth/me:`, meData.data);

    const statsRes = await fetch(`${BASE}/admin/stats`, { headers: authHeader });
    const statsData = await statsRes.json();
    console.log(`[${statsRes.status}] /admin/stats:`, 'totalLots:', statsData.data?.totalLots, 'verifiedRecyclers:', statsData.data?.verifiedRecyclers);

    const recyclersRes = await fetch(`${BASE}/admin/recyclers`, { headers: authHeader });
    const recyclersData = await recyclersRes.json();
    console.log(`[${recyclersRes.status}] /admin/recyclers: count =`, recyclersData.data?.length);

    const flagsRes = await fetch(`${BASE}/admin/flags`, { headers: authHeader });
    const flagsData = await flagsRes.json();
    console.log(`[${flagsRes.status}] /admin/flags: count =`, flagsData.data?.length);
  }

  console.log('\n--- 2. Testing Recycler Login ---');
  const recLoginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'pune.recycler@ecorecycle.com', password: 'Demo@1234' }),
  });
  const recData = await recLoginRes.json();
  console.log(`[${recLoginRes.status}] Recycler Login:`, recData.data ? `User: ${recData.data.user.name} (${recData.data.user.role})` : recData.error);

  console.log('\n--- 3. Testing Public Endpoints ---');
  const materialsRes = await fetch(`${BASE}/materials`);
  const materialsData = await materialsRes.json();
  console.log(`[${materialsRes.status}] /materials: count =`, materialsData.data?.length);

  const priceRes = await fetch(`${BASE}/prices/board?district=Pune`);
  const priceData = await priceRes.json();
  console.log(`[${priceRes.status}] /prices/board: count =`, priceData.data?.length);

  const safetyRes = await fetch(`${BASE}/safety`);
  const safetyData = await safetyRes.json();
  console.log(`[${safetyRes.status}] /safety: count =`, safetyData.data?.length);

  console.log('\n--- 4. Testing Collector OTP Auth Flow ---');
  const reqRes = await fetch(`${BASE}/auth/otp/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '9000000001' }),
  });
  console.log(`[${reqRes.status}] /auth/otp/request:`, await reqRes.json());

  const verifyRes = await fetch(`${BASE}/auth/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '9000000001', otp: '123456', preferredLanguage: 'HI' }),
  });
  const verifyData = await verifyRes.json();
  console.log(`[${verifyRes.status}] /auth/otp/verify:`, verifyData.data ? `Collector ID: ${verifyData.data.collector.id}, Token present: ${!!verifyData.data.token}` : verifyData.error);
}

testAll();
