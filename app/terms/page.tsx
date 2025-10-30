export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Kullanım Koşulları
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </div>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                📋 Genel Koşullar
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Snakebase&apos;a hoş geldiniz! Bu kullanım koşulları, Snakebase platformunu kullanırken
                uymanız gereken kuralları ve sorumlulukları açıklamaktadır. Platformu kullanarak
                bu koşulları kabul etmiş sayılırsınız.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                🎮 Oyun Kuralları
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Oyun skorları dürüst bir şekilde elde edilmelidir</li>
                <li>Hile, exploit veya üçüncü taraf yazılımlar kullanımı yasaktır</li>
                <li>Diğer oyuncuları rahatsız eden davranışlar kabul edilmez</li>
                <li>Oyun içi ekonomi sistemi kurallara uygun kullanılmalıdır</li>
                <li>Platform, şüpheli aktiviteleri araştırma ve cezalandırma hakkını saklı tutar</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                ⛓️ Blockchain ve Web3
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Cüzdan Bağlantısı</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Web3 cüzdanınızı bağlayarak platforma erişebilirsiniz. Cüzdan güvenliğinden
                    tamamen siz sorumlusunuz.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">İşlem Ücretleri</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Base Network üzerindeki işlemler için gas ücretleri ödemeniz gerekebilir.
                    Bu ücretler blockchain protokolü tarafından belirlenir.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Akıllı Sözleşmeler</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Platform, Base Network üzerinde çalışan akıllı sözleşmeleri kullanır.
                    Sözleşmeler immutable&apos;dır ve değiştirilemez.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                💰 Ödemeler ve Ödüller
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Oyun içi ödüller tamamen isteğe bağlıdır</li>
                <li>Ödül dağıtımı platform politikalarına tabidir</li>
                <li>Ödül kazanma garantisi verilmez</li>
                <li>Ödül sisteminde değişiklik yapma hakkı saklıdır</li>
                <li>Kazanılan ödüller blockchain üzerinde kayıtlıdır</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                🚫 Yasaklanan Faaliyetler
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Teknik İhlaller</h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>• Hile yazılımları kullanımı</li>
                    <li>• API abuse</li>
                    <li>• DDoS saldırıları</li>
                    <li>• Sistem exploit&apos;leri</li>
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Davranış Kuralları</h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>• Spam ve troll davranışları</li>
                    <li>• Küfür ve hakaret</li>
                    <li>• Diğer oyuncuları rahatsız etme</li>
                    <li>• Yasadışı içerik paylaşımı</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                🛡️ Sorumluluk Reddi
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Snakebase platformu &quot;olduğu gibi&quot; sunulmaktadır. Platformun kullanımından
                doğabilecek herhangi bir zarardan sorumlu değiliz:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Blockchain network kesintileri</li>
                <li>Gas ücretlerindeki değişiklikler</li>
                <li>Üçüncü taraf cüzdan sorunları</li>
                <li>Güvenlik açıkları (kullanıcı hatası hariç)</li>
                <li>Veri kaybı (kullanıcının kendi yedekleme sorumluluğu)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                🔄 Hesap Askıya Alma
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Kuralları ihlal eden hesaplar geçici veya kalıcı olarak askıya alınabilir.
                Askıya alma kararları nihai olup itiraz süreci bulunmamaktadır. Şüpheli
                aktiviteler otomatik olarak tespit edilip incelenir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                📞 İletişim ve Destek
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Kullanım koşulları hakkında sorularınız için:
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
                Bu kullanım koşulları Snakebase platformu için geçerlidir. Koşullarda değişiklik
                yapıldığında kullanıcılarımıza bildirim gönderilecektir. Platformu kullanmaya
                devam etmek, güncellenmiş koşulları kabul ettiğiniz anlamına gelir.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}