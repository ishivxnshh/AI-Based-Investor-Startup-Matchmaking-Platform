# Migration Guide: Email Case-Sensitivity Fix

## Overview

This guide helps you migrate existing data and code to use the new case-insensitive email handling system.

## What Changed?

### Before
```javascript
// Emails were stored as-is
const user = await User.create({ 
  email: "User@Example.COM" // Stored exactly as entered
});

// Lookups were case-sensitive
const found = await User.findOne({ email: "user@example.com" }); // Might not find
```

### After
```javascript
// Emails are normalized to lowercase
const user = await User.create({ 
  email: "user@example.com" // Always lowercase
});

// Lookups are case-insensitive
const found = await User.findOne({ 
  email: { $regex: new RegExp(`^${email}$`, 'i') } 
}); // Always finds regardless of case
```

## Migration Steps

### Step 1: Backup Database

```bash
# MongoDB backup
mongodump --db your_database --out backup_before_migration

# Verify backup
mongorestore --dry-run --db your_database backup_before_migration/your_database
```

### Step 2: Analyze Existing Data

```javascript
// Check for case variations
const users = await User.find({});
const emailMap = new Map();

users.forEach(user => {
  const normalized = user.email.toLowerCase();
  if (emailMap.has(normalized)) {
    console.log(`Duplicate found: ${user.email} matches ${emailMap.get(normalized)}`);
  } else {
    emailMap.set(normalized, user.email);
  }
});

console.log(`Total users: ${users.length}`);
console.log(`Unique emails (case-insensitive): ${emailMap.size}`);
console.log(`Duplicates: ${users.length - emailMap.size}`);
```

### Step 3: Handle Duplicates

#### Option A: Keep First Registration
```javascript
async function mergeDuplicates() {
  const users = await User.find({}).sort({ createdAt: 1 });
  const emailMap = new Map();
  const toDelete = [];

  for (const user of users) {
    const normalized = user.email.toLowerCase();
    
    if (emailMap.has(normalized)) {
      // Duplicate found - mark for deletion
      toDelete.push(user._id);
      console.log(`Marking duplicate for deletion: ${user.email} (${user._id})`);
    } else {
      emailMap.set(normalized, user);
    }
  }

  // Delete duplicates
  await User.deleteMany({ _id: { $in: toDelete } });
  console.log(`Deleted ${toDelete.length} duplicate users`);
}
```

#### Option B: Manual Review
```javascript
async function findDuplicatesForReview() {
  const users = await User.find({}).sort({ createdAt: 1 });
  const emailMap = new Map();
  const duplicates = [];

  for (const user of users) {
    const normalized = user.email.toLowerCase();
    
    if (emailMap.has(normalized)) {
      const original = emailMap.get(normalized);
      duplicates.push({
        original: {
          id: original._id,
          email: original.email,
          createdAt: original.createdAt,
          lastLogin: original.lastLogin
        },
        duplicate: {
          id: user._id,
          email: user.email,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      });
    } else {
      emailMap.set(normalized, user);
    }
  }

  // Export for manual review
  fs.writeFileSync('duplicates_review.json', JSON.stringify(duplicates, null, 2));
  console.log(`Found ${duplicates.length} duplicate pairs`);
  console.log('Review duplicates_review.json and delete manually');
}
```

### Step 4: Normalize Existing Emails

```javascript
async function normalizeAllEmails() {
  const users = await User.find({});
  let updated = 0;

  for (const user of users) {
    const normalized = user.email.toLowerCase().trim();
    
    if (user.email !== normalized) {
      await User.updateOne(
        { _id: user._id },
        { $set: { email: normalized } }
      );
      updated++;
      console.log(`Updated: ${user.email} -> ${normalized}`);
    }
  }

  console.log(`Updated ${updated} out of ${users.length} users`);
}
```

### Step 5: Verify Migration

```javascript
async function verifyMigration() {
  const users = await User.find({});
  const issues = [];

  users.forEach(user => {
    // Check 1: Email is lowercase
    if (user.email !== user.email.toLowerCase()) {
      issues.push({
        type: 'not_lowercase',
        email: user.email,
        id: user._id
      });
    }

    // Check 2: Email is trimmed
    if (user.email !== user.email.trim()) {
      issues.push({
        type: 'not_trimmed',
        email: user.email,
        id: user._id
      });
    }

    // Check 3: Valid format
    if (!user.email.includes('@') || !user.email.includes('.')) {
      issues.push({
        type: 'invalid_format',
        email: user.email,
        id: user._id
      });
    }
  });

  if (issues.length === 0) {
    console.log('✅ All emails are properly normalized');
  } else {
    console.log(`❌ Found ${issues.length} issues:`);
    console.log(JSON.stringify(issues, null, 2));
  }

  return issues.length === 0;
}
```

### Step 6: Test New Functionality

```javascript
// Test 1: Registration with existing email (different case)
async function testDuplicateRegistration() {
  const existingUser = await User.findOne({});
  const testEmail = existingUser.email.toUpperCase();

  try {
    await User.create({
      email: testEmail,
      password: 'test123',
      fullName: 'Test User',
      role: 'investor'
    });
    console.log('❌ FAIL: Duplicate registration allowed');
  } catch (error) {
    console.log('✅ PASS: Duplicate registration blocked');
  }
}

// Test 2: Login with different case
async function testCaseInsensitiveLogin() {
  const user = await User.findOne({});
  const testEmail = user.email.toUpperCase();

  const found = await User.findOne({
    email: { $regex: new RegExp(`^${testEmail}$`, 'i') }
  });

  if (found && found._id.equals(user._id)) {
    console.log('✅ PASS: Case-insensitive login works');
  } else {
    console.log('❌ FAIL: Case-insensitive login failed');
  }
}

// Test 3: Email service integration
async function testEmailService() {
  const result = emailService.processEmail('TEST@EXAMPLE.COM');
  
  if (result.valid && result.normalized === 'test@example.com') {
    console.log('✅ PASS: Email service working correctly');
  } else {
    console.log('❌ FAIL: Email service not working');
  }
}

// Run all tests
async function runMigrationTests() {
  await testDuplicateRegistration();
  await testCaseInsensitiveLogin();
  await testEmailService();
}
```

## Complete Migration Script

```javascript
// migration.js
import mongoose from 'mongoose';
import User from './models/User.js';
import emailService from './services/emailService.js';

async function runFullMigration() {
  try {
    console.log('Starting email migration...\n');

    // Step 1: Analyze
    console.log('Step 1: Analyzing existing data...');
    const stats = await analyzeData();
    console.log(`  Total users: ${stats.total}`);
    console.log(`  Unique emails: ${stats.unique}`);
    console.log(`  Duplicates: ${stats.duplicates}\n`);

    if (stats.duplicates > 0) {
      console.log('⚠️  Duplicates found! Please review and handle manually.');
      await findDuplicatesForReview();
      console.log('Check duplicates_review.json\n');
      return;
    }

    // Step 2: Normalize
    console.log('Step 2: Normalizing emails...');
    await normalizeAllEmails();
    console.log('✅ Normalization complete\n');

    // Step 3: Verify
    console.log('Step 3: Verifying migration...');
    const success = await verifyMigration();
    if (!success) {
      console.log('❌ Verification failed! Check issues above.\n');
      return;
    }
    console.log('✅ Verification complete\n');

    // Step 4: Test
    console.log('Step 4: Running tests...');
    await runMigrationTests();
    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('Database may be in inconsistent state - restore from backup!');
  }
}

// Run migration
runFullMigration().then(() => {
  mongoose.connection.close();
});
```

## Run Migration

```bash
# 1. Backup database
mongodump --db your_database --out backup_before_migration

# 2. Run migration script
node migration.js

# 3. If successful, deploy new code
git pull origin main
npm install
pm2 restart your-app

# 4. If failed, restore backup
mongorestore --db your_database backup_before_migration/your_database
```

## Rollback Plan

If issues occur after migration:

```bash
# 1. Stop application
pm2 stop your-app

# 2. Restore database
mongorestore --drop --db your_database backup_before_migration/your_database

# 3. Revert code
git revert HEAD
git push origin main

# 4. Restart application
pm2 start your-app
```

## Post-Migration Monitoring

### Monitor for Issues

```javascript
// Add middleware to log email-related errors
router.post('/register', async (req, res) => {
  try {
    // ... registration code
  } catch (error) {
    if (error.code === 11000) {
      logger.warn(`Duplicate email attempt: ${emailService.sanitizeForLogging(req.body.email)}`);
    }
    // ... error handling
  }
});
```

### Check Logs

```bash
# Look for duplicate attempts
grep "Duplicate email attempt" logs/app.log

# Look for invalid email formats
grep "Invalid email format" logs/app.log

# Look for registration errors
grep "Registration error" logs/app.log
```

## Troubleshooting

### Issue: Migration script fails

**Cause**: Database connection timeout
**Solution**: Increase timeout in mongoose connection:
```javascript
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000
});
```

### Issue: Duplicates found

**Cause**: Users registered with same email in different cases
**Solution**: Review duplicates_review.json and:
1. Keep most recently active account
2. Merge data if needed
3. Notify affected users

### Issue: Tests fail after migration

**Cause**: Existing test data not migrated
**Solution**: Clear test database and reseed:
```bash
NODE_ENV=test npm run db:reset
NODE_ENV=test npm run db:seed
npm test
```

## FAQ

**Q: Will existing users be affected?**
A: No, migration is backward compatible. Users can login with any case variation.

**Q: What happens to existing sessions?**
A: Existing sessions remain valid. Email normalization only affects new registrations and logins.

**Q: Do I need to notify users?**
A: Not required. The change is transparent to users.

**Q: What if I have millions of users?**
A: Run migration in batches:
```javascript
async function normalizeInBatches(batchSize = 1000) {
  let processed = 0;
  const total = await User.countDocuments();

  while (processed < total) {
    const users = await User.find({})
      .skip(processed)
      .limit(batchSize);

    for (const user of users) {
      const normalized = user.email.toLowerCase().trim();
      if (user.email !== normalized) {
        await User.updateOne({ _id: user._id }, { $set: { email: normalized } });
      }
    }

    processed += batchSize;
    console.log(`Progress: ${processed}/${total}`);
  }
}
```

## Success Criteria

- ✅ All emails normalized to lowercase
- ✅ No duplicates exist (case-insensitive)
- ✅ Registration blocks case-insensitive duplicates
- ✅ Login works with any case variation
- ✅ All tests passing
- ✅ No user complaints

## Support

If you encounter issues during migration:
1. Check the troubleshooting section above
2. Review logs for specific errors
3. Restore from backup if needed
4. Contact development team for assistance
