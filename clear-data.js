const { kvGet, kvSet } = require('./lib/redis');

async function clearTestData() {
  console.log('Clearing test data...');

  try {
    // Clear leaderboard data
    const walletsKey = 'scores:wallets';
    const walletsRaw = await kvGet(walletsKey);
    if (walletsRaw) {
      const wallets = JSON.parse(walletsRaw);
      console.log('Clearing scores for wallets:', wallets);

      for (const wallet of wallets) {
        await kvSet('scores:high:' + wallet, '0');
        await kvSet('scores:display:' + wallet, '');
        await kvSet('scores:history:' + wallet, '[]');
      }

      await kvSet(walletsKey, '[]');
      console.log('Leaderboard data cleared');
    } else {
      console.log('No leaderboard data found');
    }

    // Clear any cached leaderboard data
    console.log('Test data clearing completed');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

clearTestData().then(() => {
  console.log('Done');
  process.exit(0);
}).catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});