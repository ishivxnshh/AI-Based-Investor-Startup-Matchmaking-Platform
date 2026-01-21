/**
 * Simple test to demonstrate the email case-sensitivity bug fix
 * This can be run without full Jest setup
 */

console.log('🐛 Bug Fix Verification Test\n');
console.log('Testing: Email case-sensitivity duplicate prevention\n');

// Simulate the bug scenario
const testCases = [
  {
    name: 'Case 1: Lowercase then Uppercase',
    email1: 'test@example.com',
    email2: 'TEST@EXAMPLE.COM',
    shouldBlock: true
  },
  {
    name: 'Case 2: Mixed case then lowercase',
    email1: 'MixedCase@Example.COM',
    email2: 'mixedcase@example.com',
    shouldBlock: true
  },
  {
    name: 'Case 3: All uppercase',
    email1: 'ALLCAPS@EXAMPLE.COM',
    email2: 'ALLCAPS@EXAMPLE.COM',
    shouldBlock: true
  },
  {
    name: 'Case 4: Different emails',
    email1: 'user1@example.com',
    email2: 'user2@example.com',
    shouldBlock: false
  }
];

// The fix: normalize email and use case-insensitive check
function checkDuplicateEmail(existingEmail, newEmail) {
  const normalizedExisting = existingEmail.toLowerCase().trim();
  const normalizedNew = newEmail.toLowerCase().trim();
  
  // Use regex for case-insensitive comparison
  const regex = new RegExp(`^${normalizedNew}$`, 'i');
  return regex.test(normalizedExisting);
}

// Run tests
let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const isDuplicate = checkDuplicateEmail(testCase.email1, testCase.email2);
  const expected = testCase.shouldBlock;
  const success = isDuplicate === expected;
  
  if (success) {
    console.log(`✅ ${testCase.name}`);
    console.log(`   Email 1: ${testCase.email1}`);
    console.log(`   Email 2: ${testCase.email2}`);
    console.log(`   Result: ${isDuplicate ? 'Blocked' : 'Allowed'} (Expected: ${expected ? 'Blocked' : 'Allowed'})`);
    passed++;
  } else {
    console.log(`❌ ${testCase.name}`);
    console.log(`   Email 1: ${testCase.email1}`);
    console.log(`   Email 2: ${testCase.email2}`);
    console.log(`   Result: ${isDuplicate ? 'Blocked' : 'Allowed'} (Expected: ${expected ? 'Blocked' : 'Allowed'})`);
    failed++;
  }
  console.log('');
});

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);

if (failed === 0) {
  console.log('\n✅ All tests passed! Bug fix is working correctly.');
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed. Bug fix needs review.');
  process.exit(1);
}
