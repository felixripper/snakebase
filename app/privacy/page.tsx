export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Privacy Policy
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US')}
            </div>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                🔒 Our Privacy Commitment
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                At Snakebase, protecting our users' privacy is our highest priority.
                This privacy policy explains what information we collect when you use the Snakebase application,
                how we use it, and how we protect it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                📊 Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Web3 Wallet Information</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Public wallet address and transaction confirmations required for wallet connection.
                    Your private keys are never stored on our servers.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Game Data</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Scores, game statistics, and leaderboard information. This data is stored both
                    off-chain (Redis) and on-chain (Base Network).
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Technical Data</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    IP address, browser information, and usage statistics are collected for
                    performance optimization and security.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                🔐 Data Security
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>All data is protected with end-to-end encryption</li>
                <li>Blockchain data is immutable and transparent</li>
                <li>Off-chain data is securely stored with Redis</li>
                <li>No personal data is shared with third parties</li>
                <li>Data access is limited to necessary operations only</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                🍪 Cookies and Tracking
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Snakebase uses only the minimum necessary cookies to enhance user experience.
                Third-party tracking tools are not used. Secure, httpOnly cookies are used for session management.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                ⚖️ Your Legal Rights
              </h2>
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <p><strong>GDPR Rights:</strong> As EU citizens, you have the right to view, correct, delete, and transfer your data.</p>
                <p><strong>Access Right:</strong> You can view your collected data at any time.</p>
                <p><strong>Deletion Right:</strong> You can permanently delete your account and all data.</p>
                <p><strong>Objection Right:</strong> You can object to data processing operations at any time.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                📞 Contact
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                For questions about our privacy policy, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-800 dark:text-gray-200">
                  <strong>Email:</strong> privacy@snakebase.app<br/>
                  <strong>GitHub:</strong> <a href="https://github.com/felixripper/snakebase" className="text-blue-600 hover:underline">Issues</a>
                </p>
              </div>
            </section>

            <section className="border-t pt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This privacy policy applies to the Snakebase application. Users will be notified
                when changes are made to the policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}