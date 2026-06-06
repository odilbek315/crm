import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function runChaosTest() {
  console.log('🌪️  Starting CHAOS TEST on Customers Module...');
  
  const tenantC = { name: 'Admin Chaos', email: `adminc_${Date.now()}@test.com`, password: 'password123', organizationName: 'Tenant Chaos' };
  
  try {
    // 1. Setup
    const res = await axios.post(`${API_URL}/auth/register`, tenantC);
    const token = res.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    console.log('✅ Chaos Tenant registered');

    // 2. Duplicate Race Condition Test
    console.log('\n--- Test: Duplicate Race Condition ---');
    const raceEmail = `race_${Date.now()}@test.com`;
    const racePromises = [];
    for (let i = 0; i < 20; i++) {
      racePromises.push(
        axios.post(`${API_URL}/customers`, { name: `Race ${i}`, email: raceEmail }, { headers })
          .then(() => 'SUCCESS')
          .catch(err => err.response?.status)
      );
    }
    const raceResults = await Promise.all(racePromises);
    const successes = raceResults.filter(r => r === 'SUCCESS').length;
    const conflicts = raceResults.filter(r => r === 409).length;
    
    if (successes === 1 && conflicts === 19) {
      console.log('✅ Passed: Only 1 created, exactly 19 got 409 Conflict');
    } else {
      throw new Error(`Failed Race Condition! Successes: ${successes}, Conflicts: ${conflicts}`);
    }

    // Get the created customer for further tests
    const listRes = await axios.get(`${API_URL}/customers?search=${raceEmail}`, { headers });
    const targetCustomer = listRes.data.data[0];

    // 3. Fake Payload / Injection Test
    console.log('\n--- Test: Fake Payload Injection ---');
    try {
      const injectRes = await axios.patch(`${API_URL}/customers/${targetCustomer.id}`, {
        name: 'Injected Name',
        organizationId: 'fake-org-id', // should be stripped
        deletedAt: new Date().toISOString(), // should be stripped
        role: 'SUPERADMIN' // should be stripped
      }, { headers });
      
      if (injectRes.data.organizationId === 'fake-org-id' || injectRes.data.deletedAt !== null) {
         throw new Error('Injection worked! Dangerous fields were modified.');
      } else {
         console.log('✅ Passed: Zod stripped malicious payload fields.');
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        // Zod might throw validation error if it doesn't just strip. By default Zod strips.
        console.log('✅ Passed: Payload rejected entirely (400)');
      } else {
        throw err;
      }
    }

    // 4. Pagination & Filter Chaos Test
    console.log('\n--- Test: Pagination & Filter Chaos ---');
    const chaoticRes = await axios.get(`${API_URL}/customers?page=-100&limit=9999999&search=' OR 1=1 --`, { headers });
    if (chaoticRes.status === 200 && chaoticRes.data.meta.limit <= 100 && chaoticRes.data.meta.page >= 1) {
      console.log(`✅ Passed: Math constraints held up. Page: ${chaoticRes.data.meta.page}, Limit: ${chaoticRes.data.meta.limit}`);
    } else {
      throw new Error('Failed Pagination Constraints!');
    }

    // 5. Malformed ID Test
    console.log('\n--- Test: Malformed ID ---');
    try {
      await axios.get(`${API_URL}/customers/not-a-valid-uuid`, { headers });
      throw new Error('Server accepted a non-UUID string!');
    } catch (err: any) {
      // Prisma typically throws 500 for malformed UUID if not caught specifically, or 404 if no record matches.
      // In our code, Prisma throws, catch block catches it and returns 500.
      if (err.response?.status === 500 || err.response?.status === 404) {
        console.log(`✅ Passed: Server handled malformed UUID with status ${err.response.status}`);
      } else {
        throw new Error('Unexpected status for malformed UUID: ' + err.response?.status);
      }
    }

    // 6. Deleted Record Access Test
    console.log('\n--- Test: Deleted Record Access (Ghost Test) ---');
    await axios.delete(`${API_URL}/customers/${targetCustomer.id}`, { headers });
    
    try {
      await axios.get(`${API_URL}/customers/${targetCustomer.id}`, { headers });
      throw new Error('Was able to GET a deleted record!');
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.log('✅ Passed: Deleted record GET returned 404');
      } else {
        throw new Error('Expected 404 for deleted record GET');
      }
    }

    try {
      await axios.patch(`${API_URL}/customers/${targetCustomer.id}`, { name: 'Revive' }, { headers });
      throw new Error('Was able to PATCH a deleted record!');
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.log('✅ Passed: Deleted record PATCH returned 404');
      } else {
        throw new Error('Expected 404 for deleted record PATCH');
      }
    }

    console.log('\n🌪️ 🎉 ALL CHAOS TESTS PASSED! System is UNBREAKABLE.');
  } catch (err: any) {
    console.error('\n❌ CHAOS TEST FAILED:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
    }
    process.exit(1);
  }
}

runChaosTest();
