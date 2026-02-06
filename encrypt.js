/**
 * Valentine Week - Offline Encryption Helper
 * 
 * Usage: node encrypt.js
 * 
 * This script generates encrypted vault entries for personalized experiences.
 * Run this locally - NEVER commit real names to git!
 */

const crypto = require('crypto');
const readline = require('readline');

// Configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 16;
const ITERATIONS = 100000;

/**
 * Generate a random URL-safe hash
 */
function generateHash(length = 8) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        result += chars[randomBytes[i] % chars.length];
    }
    return result;
}

/**
 * Derive encryption key from hash using PBKDF2
 */
function deriveKey(hash, salt) {
    return crypto.pbkdf2Sync(hash, salt, ITERATIONS, KEY_LENGTH, 'sha256');
}

/**
 * Encrypt data with AES-256-GCM
 */
function encrypt(data, hash) {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = deriveKey(hash, salt);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    const authTag = cipher.getAuthTag();
    
    return {
        salt: salt.toString('base64'),
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        data: encrypted
    };
}

/**
 * Decrypt data (for testing)
 */
function decrypt(encryptedObj, hash) {
    const salt = Buffer.from(encryptedObj.salt, 'base64');
    const iv = Buffer.from(encryptedObj.iv, 'base64');
    const authTag = Buffer.from(encryptedObj.authTag, 'base64');
    const key = deriveKey(hash, salt);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedObj.data, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
}

/**
 * Test encryption/decryption round-trip
 */
function runTest() {
    console.log('\n🔐 Testing encryption/decryption round-trip...\n');
    
    const testData = {
        name: 'TestName',
        customMessage: 'This is a test message 💕'
    };
    
    const hash = generateHash();
    const encrypted = encrypt(testData, hash);
    const decrypted = decrypt(encrypted, hash);
    
    const passed = JSON.stringify(testData) === JSON.stringify(decrypted);
    
    if (passed) {
        console.log('✅ Encryption/decryption round-trip: PASSED');
        console.log(`   Hash: ${hash}`);
        console.log(`   Original: ${JSON.stringify(testData)}`);
        console.log(`   Decrypted: ${JSON.stringify(decrypted)}`);
    } else {
        console.log('❌ Encryption/decryption round-trip: FAILED');
    }
    
    return passed;
}

/**
 * Interactive mode - create a new vault entry
 */
async function interactiveMode() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

    console.log('\n💝 Valentine Week - Encryption Helper\n');
    console.log('This will generate an encrypted entry for vault.json\n');

    const name = await question('Enter her name: ');
    const customMessage = await question('Custom final message (optional, press Enter to skip): ');

    const hash = generateHash();
    const data = {
        name: name.trim(),
        ...(customMessage.trim() && { customMessage: customMessage.trim() })
    };

    const encrypted = encrypt(data, hash);

    console.log('\n' + '='.repeat(60));
    console.log('🔗 URL to share:');
    console.log(`   https://YOUR-USERNAME.github.io/jgti/feb-love/#${hash}`);
    console.log('='.repeat(60));
    
    console.log('\n📋 Add this to vault.json:\n');
    console.log(JSON.stringify({ [hash]: encrypted }, null, 2));
    
    console.log('\n⚠️  IMPORTANT: Never commit the name or this output to git!');
    console.log('    Only commit the vault.json with encrypted entries.\n');

    rl.close();
}

// Main
const args = process.argv.slice(2);

if (args.includes('--test')) {
    runTest();
} else if (args.includes('--help')) {
    console.log(`
Valentine Week Encryption Helper

Usage:
  node encrypt.js          Interactive mode - create new vault entry
  node encrypt.js --test   Test encryption/decryption
  node encrypt.js --help   Show this help

Output:
  - Unique URL hash for sharing
  - Encrypted vault entry to add to vault.json
`);
} else {
    interactiveMode();
}
