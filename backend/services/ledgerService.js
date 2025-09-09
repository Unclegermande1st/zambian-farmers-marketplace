// backend/services/ledgerService.js
const crypto = require('crypto');
const { db } = require('../firebase');

// Get latest ledger entry
const getLatestLedgerEntry = async () => {
  const snapshot = await db.collection('ledger')
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get();

  return snapshot.empty ? null : snapshot.docs[0].data();
};

// Generate SHA-256 hash
const hashTransaction = (data) => {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
};

// Log transaction to ledger
const logToLedger = async (orderId, currentHash) => {
  const prevEntry = await getLatestLedgerEntry();
  const prevHash = prevEntry?.currentHash || '0'.repeat(64); // Genesis block

  const ledgerEntry = {
    orderId,
    previousHash: prevHash,
    currentHash,
    timestamp: new Date(),
  };

  await db.collection('ledger').add(ledgerEntry);
};

module.exports = { hashTransaction, logToLedger };