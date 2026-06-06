import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3000/api';

async function runTest() {
  console.log('🚀 Starting Core Hardening Customers Module Test...');
  
  const tenantA = { name: 'Admin A', email: `admina_${Date.now()}@test.com`, password: 'password123', organizationName: 'Tenant A' };
  const tenantB = { name: 'Admin B', email: `adminb_${Date.now()}@test.com`, password: 'password123', organizationName: 'Tenant B' };
  const userAEmail = `usera_${Date.now()}@test.com`;

  try {
    // 1. Register Tenants
    console.log('\n--- 1. Registering Tenants ---');
    const resA = await axios.post(`${API_URL}/auth/register`, tenantA);
    const tokenAdminA = resA.data.token;
    const orgIdA = resA.data.user.organizationId;

    const resB = await axios.post(`${API_URL}/auth/register`, tenantB);
    const tokenAdminB = resB.data.token;

    // Create a regular user in Tenant A
    const passwordHash = await bcrypt.hash('password123', 12);
    await prisma.user.create({
      data: {
        email: userAEmail,
        name: 'Regular User A',
        passwordHash,
        role: 'USER',
        organizationId: orgIdA
      }
    });

    const loginRes = await axios.post(`${API_URL}/auth/login`, { email: userAEmail, password: 'password123' });
    const tokenUserA = loginRes.data.token;

    console.log('✅ Tenants and users registered successfully');

    const headersAdminA = { Authorization: `Bearer ${tokenAdminA}` };
    const headersAdminB = { Authorization: `Bearer ${tokenAdminB}` };
    const headersUserA = { Authorization: `Bearer ${tokenUserA}` };

    // 2. Duplicate Validation Edge Case
    console.log('\n--- 2. Testing Duplicate Email Validation ---');
    await axios.post(`${API_URL}/customers`, { name: 'Dup 1', email: 'dup@test.com' }, { headers: headersAdminA });
    try {
      await axios.post(`${API_URL}/customers`, { name: 'Dup 2', email: 'dup@test.com' }, { headers: headersAdminA });
      throw new Error('Allowed duplicate email!');
    } catch (err: any) {
      if (err.response?.status === 409) {
        console.log('✅ Duplicate email correctly rejected with 409 Conflict');
      } else {
        throw new Error('Expected 409 Conflict for duplicate email, got: ' + err.response?.status);
      }
    }

    // 3. Stress Test: 100 Customers
    console.log('\n--- 3. Stress Testing: 100 Customers ---');
    const createPromises = [];
    for (let i = 1; i <= 100; i++) {
      createPromises.push(
        axios.post(`${API_URL}/customers`, {
          name: `Stress Customer ${i}`,
          email: `stress${i}_${Date.now()}@test.com`,
          company: i % 2 === 0 ? 'Even Corp' : 'Odd Inc',
          status: i % 3 === 0 ? 'Inactive' : 'Active',
          value: i * 100
        }, { headers: headersAdminA })
      );
    }
    const startCreate = Date.now();
    await Promise.all(createPromises);
    console.log(`✅ 100 customers created successfully in ${Date.now() - startCreate}ms`);

    // 4. Performance Search
    console.log('\n--- 4. Performance Search ---');
    const startSearch = Date.now();
    const searchRes = await axios.get(`${API_URL}/customers?search=Stress&limit=50`, { headers: headersAdminA });
    const searchTime = Date.now() - startSearch;
    console.log(`✅ Fast search executed in ${searchTime}ms. Fetched: ${searchRes.data.data.length}`);
    if (searchTime > 500) {
      console.warn('⚠️ Search is taking longer than expected! Time:', searchTime);
    }

    // 5. Role Check
    console.log('\n--- 5. Testing Role Authorization (DELETE) ---');
    const firstCustomer = searchRes.data.data[0];
    try {
      await axios.delete(`${API_URL}/customers/${firstCustomer.id}`, { headers: headersUserA });
      throw new Error('User was able to delete a customer!');
    } catch (err: any) {
      if (err.response?.status === 403) {
        console.log('✅ Regular USER correctly blocked from deleting (403 Forbidden)');
      } else {
        throw new Error('Expected 403 for unauthorized delete');
      }
    }

    // 6. Delete via Admin
    console.log('\n--- 6. Deleting Customer as Admin ---');
    await axios.delete(`${API_URL}/customers/${firstCustomer.id}`, { headers: headersAdminA });
    console.log('✅ Admin successfully deleted customer');

    // 7. Audit Log Check
    console.log('\n--- 7. Verifying Audit Logs ---');
    const logs = await prisma.auditLog.findMany({
      where: { entityType: 'CUSTOMER', entityId: firstCustomer.id }
    });
    const hasCreate = logs.some(l => l.action === 'CREATE');
    const hasDelete = logs.some(l => l.action === 'DELETE');
    if (hasCreate && hasDelete) {
      console.log('✅ Audit logs correctly recorded CREATE and DELETE actions');
    } else {
      throw new Error('Audit logs missing');
    }

    console.log('\n🎉 ALL HARDENING TESTS PASSED! Module ROCK SOLID.');
  } catch (err: any) {
    console.error('\n❌ TEST FAILED:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTest();
