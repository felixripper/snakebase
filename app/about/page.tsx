export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Snakebase Hakkında
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                🎮 Proje Hakkında
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Snakebase, Base ağında çalışan yenilikçi bir blockchain oyunudur. Klasik Snake oyununu
                modern web teknolojileri ve blockchain entegrasyonu ile birleştirerek, oyunculara
                benzersiz bir deneyim sunar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                🚀 Özellikler
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Web3 cüzdan entegrasyonu ile güvenli giriş</li>
                <li>On-chain skor kayıtları ve lider tabloları</li>
                <li>Gerçek zamanlı çok oyunculu deneyim</li>
                <li>Farcaster Mini App desteği</li>
                <li>Modern ve responsive tasarım</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                🛠️ Teknoloji Stack
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                  <span className="font-medium text-blue-700 dark:text-blue-300">Next.js 15</span>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                  <span className="font-medium text-green-700 dark:text-green-300">Base Network</span>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                  <span className="font-medium text-purple-700 dark:text-purple-300">OnchainKit</span>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-center">
                  <span className="font-medium text-yellow-700 dark:text-yellow-300">TypeScript</span>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
                  <span className="font-medium text-red-700 dark:text-red-300">Solidity</span>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg text-center">
                  <span className="font-medium text-indigo-700 dark:text-indigo-300">Tailwind CSS</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                📞 İletişim
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Sorularınız ve önerileriniz için GitHub repository&apos;mizi ziyaret edebilirsiniz.
              </p>
              <div className="mt-4">
                <a
                  href="https://github.com/felixripper/snakebase"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub Repository
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}