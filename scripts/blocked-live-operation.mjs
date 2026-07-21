const operation = process.argv[2] ?? 'unknown';

console.error(
  `Blocked ${operation}: this archived blockchain library is quarantined. ` +
  'Live RPC, wallet, transaction, and publishing operations are disabled.'
);
process.exit(2);
