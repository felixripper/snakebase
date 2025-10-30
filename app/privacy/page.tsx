export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Gizlilik Politikası
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </div>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                🔒 Gizlilik Taahhüdümüz
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Snakebase olarak, kullanıcılarımızın gizliliğini korumak bizim için en yüksek önceliktir.
                Bu gizlilik politikası, Snakebase uygulamasını kullanırken hangi bilgileri topladığımızı,
                nasıl kullandığımızı ve koruduğumuzu açıklamaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                📊 Toplanan Bilgiler
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Web3 Cüzdan Bilgileri</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Cüzdan bağlantısı için gerekli olan genel cüzdan adresi ve işlem onayları.
                    Özel anahtarlarınız hiçbir zaman sunucularımızda saklanmaz.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Oyun Verileri</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Skorlar, oyun istatistikleri ve lider tablosu bilgileri. Bu veriler hem
                    off-chain (Redis) hem de on-chain (Base Network) olarak saklanır.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Teknik Veriler</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    IP adresi, tarayıcı bilgileri ve kullanım istatistikleri performans
                    optimizasyonu ve güvenlik için toplanır.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                🔐 Veri Güvenliği
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Tüm veriler end-to-end şifreleme ile korunur</li>
                <li>Blockchain verileri değiştirilemez ve şeffaftır</li>
                <li>Off-chain veriler Redis ile güvenli bir şekilde saklanır</li>
                <li>Hiçbir kişisel veri üçüncü taraflarla paylaşılmaz</li>
                <li>Veri erişimi sadece gerekli operasyonlar için sınırlıdır</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                🍪 Çerezler ve Takip
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Snakebase, kullanıcı deneyimini geliştirmek için gerekli minimum çerezleri kullanır.
                Üçüncü taraf takip araçları kullanılmaz. Oturum yönetimi için güvenli,
                httpOnly çerezler kullanılır.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                ⚖️ Yasal Haklarınız
              </h2>
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <p><strong>GDPR Hakları:</strong> Avrupa Birliği vatandaşları olarak verilerinizi görüntüleme, düzeltme, silme ve taşıma hakkınız vardır.</p>
                <p><strong>Erişim Hakkı:</strong> Toplanan verilerinizi istediğiniz zaman görüntüleyebilirsiniz.</p>
                <p><strong>Silme Hakkı:</strong> Hesabınızı ve tüm verilerinizi kalıcı olarak silebilirsiniz.</p>
                <p><strong>İtiraz Hakkı:</strong> Veri işleme işlemlerine istediğiniz zaman itiraz edebilirsiniz.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                📞 İletişim
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
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
                Bu gizlilik politikası Snakebase uygulaması için geçerlidir. Politikada değişiklik
                yapıldığında kullanıcılarımıza bildirilecektir.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}