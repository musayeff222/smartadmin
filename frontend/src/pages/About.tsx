import { useState } from 'react';

const About = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'POS Restaurant nedir?',
      answer: 'POS Restaurant, restoranlar için geliştirilmiş modern bir satış noktası (POS) uygulamasıdır. Sipariş yönetimi, stok takibi, raporlama ve daha birçok özellik sunar.',
    },
    {
      question: 'Nasıl başlayabilirim?',
      answer: 'Paketler sayfasından size uygun paketi seçebilir ve hemen kayıt olabilirsiniz. 7 günlük ücretsiz deneme süresi ile başlayabilirsiniz.',
    },
    {
      question: 'Hangi cihazlarda çalışır?',
      answer: 'POS Restaurant, web tabanlı bir uygulamadır ve tüm modern cihazlarda (bilgisayar, tablet, telefon) çalışır. İnternet bağlantısı olan her yerden erişebilirsiniz.',
    },
    {
      question: 'Verilerim güvende mi?',
      answer: 'Evet, tüm verileriniz SSL şifreleme ile korunur ve düzenli olarak yedeklenir. Veri güvenliği bizim önceliğimizdir.',
    },
    {
      question: 'Destek alabilir miyim?',
      answer: 'Evet, 7/24 teknik destek hizmetimiz mevcuttur. İletişim sayfasından veya admin panelinden destek talebinde bulunabilirsiniz.',
    },
    {
      question: 'Paket değiştirebilir miyim?',
      answer: 'Evet, istediğiniz zaman paketinizi yükseltebilir veya düşürebilirsiniz. Değişiklikler anında geçerli olur.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Hakkımızda
          </h1>
          <p className="text-xl sm:text-2xl text-indigo-100 max-w-3xl mx-auto">
            Restoran işletmenizi dijitalleştirerek, modern teknoloji ile güçlendirilmiş çözümler sunuyoruz.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* About Content */}
      <section className="py-20 -mt-12 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz</h2>
              <p className="text-gray-600 leading-relaxed">
                Restoran işletmelerini dijitalleştirerek, onlara modern teknoloji ile güçlendirilmiş çözümler sunmak. Her restoranın başarılı olması için gereken araçları sağlamak.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Misyonumuz</h2>
              <p className="text-gray-600 leading-relaxed">
                Kullanıcı dostu, güvenilir ve yenilikçi POS çözümleri ile restoran sahiplerinin işlerini kolaylaştırmak ve büyümelerine katkıda bulunmak.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Geliştirme Süreci</h2>
              <p className="text-gray-600 leading-relaxed">
                Restoran sahipleri ve işletme yöneticileri ile yapılan kapsamlı araştırmalar sonucunda geliştirilmiştir. Kullanıcı geri bildirimlerini sürekli olarak değerlendiriyoruz.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Sıkça Sorulan Sorular</h2>
              <p className="text-lg text-gray-600">Merak ettiklerinizin cevapları burada</p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white transition-all"
                  >
                    <h3 className="text-lg font-bold text-gray-900 pr-4">{faq.question}</h3>
                    <svg
                      className={`w-6 h-6 text-gray-600 flex-shrink-0 transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 py-4 bg-white border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
