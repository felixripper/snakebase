export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Terms of Service
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US')}
            </div>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                📋 General Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Welcome to Snakebase! These terms of service explain the rules and responsibilities
                you must follow when using the Snakebase platform. By using the platform,
                you are considered to have accepted these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                🎮 Game Rules
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Game scores must be obtained fairly</li>
                <li>Use of cheats, exploits, or third-party software is prohibited</li>
                <li>Behavior that disturbs other players is not acceptable</li>
                <li>The in-game economy system must be used in accordance with rules</li>
                <li>The platform reserves the right to investigate and penalize suspicious activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                ⛓️ Blockchain and Web3
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Wallet Connection</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    You can access the platform by connecting your Web3 wallet. You are completely
                    responsible for wallet security.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Transaction Fees</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    You may need to pay gas fees for transactions on the Base Network.
                    These fees are determined by the blockchain protocol.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Smart Contracts</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    The platform uses smart contracts running on the Base Network.
                    Contracts are immutable and cannot be changed.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                💰 Payments and Rewards
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>In-game rewards are completely optional</li>
                <li>Reward distribution is subject to platform policies</li>
                <li>No guarantee of winning rewards</li>
                <li>Right to make changes in the reward system is reserved</li>
                <li>Earned rewards are recorded on the blockchain</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                🚫 Prohibited Activities
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Technical Violations</h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>• Use of cheat software</li>
                    <li>• API abuse</li>
                    <li>• DDoS attacks</li>
                    <li>• System exploits</li>
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Code of Conduct</h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>• Spam and troll behavior</li>
                    <li>• Profanity and insults</li>
                    <li>• Harassing other players</li>
                    <li>• Sharing illegal content</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                🛡️ Disclaimer
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                The Snakebase platform is provided &quot;as is&quot;. We are not responsible for any
                damages that may arise from the use of the platform:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Blockchain network outages</li>
                <li>Changes in gas fees</li>
                <li>Third-party wallet issues</li>
                <li>Security vulnerabilities (excluding user error)</li>
                <li>Data loss (user&apos;s own backup responsibility)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                🔄 Account Suspension
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Accounts that violate the rules may be temporarily or permanently suspended.
                Suspension decisions are final and there is no appeal process. Suspicious
                activities are automatically detected and investigated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                📞 Contact and Support
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                For questions about the terms of service:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-800 dark:text-gray-200">
                  <strong>Email:</strong> support@snakebase.app<br/>
                  <strong>GitHub:</strong> <a href="https://github.com/felixripper/snakebase" className="text-blue-600 hover:underline">Issues & Discussions</a>
                </p>
              </div>
            </section>

            <section className="border-t pt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                These terms of service apply to the Snakebase platform. When changes are made to the terms,
                users will be notified. Continuing to use the platform means you accept the updated terms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}