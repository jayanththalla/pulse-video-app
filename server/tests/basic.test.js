const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runTests = async () => {
    console.log('🧪 Starting Basic API Tests...\n');

    try {
        // 1. Test Health/Auth (Register a temp user)
        const testUser = {
            username: `testuser_${Date.now()}`,
            password: 'password123',
            role: 'editor'
        };

        console.log(`[1] Testing Registration for ${testUser.username}...`);
        const regRes = await axios.post(`${API_URL}/auth/register`, testUser);

        if (regRes.status === 201 && regRes.data.token) {
            console.log('   ✅ Registration Successful. Token received.');
        } else {
            throw new Error('Registration failed');
        }

        const token = regRes.data.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Test Get Profile
        console.log('\n[2] Testing Get Profile...');
        const profileRes = await axios.get(`${API_URL}/auth/me`, config);
        if (profileRes.data.username === testUser.username) {
            console.log('   ✅ Profile Verified.');
        }

        // 3. Test Video List (Should be empty or array)
        console.log('\n[3] Testing Video List Fetch...');
        const videoRes = await axios.get(`${API_URL}/videos`, config);
        if (Array.isArray(videoRes.data)) {
            console.log(`   ✅ Video List/Access Verified. Found ${videoRes.data.length} videos.`);
        }

        console.log('\n🎉 ALL BASIC TESTS PASSED successfully.');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
};

runTests();
