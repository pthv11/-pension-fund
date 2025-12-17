import { useEffect } from "react";
import { Check, Eye, Heart } from "lucide-react";

export default function About() {
  useEffect(() => {
    document.title = "О нас - ПенсионныйФонд.РФ";
  }, []);

  const timeline = [
    {
      year: "1990",
      title: "Основание",
      description: "Создание Пенсионного фонда Российской Федерации (Постановление ВС РСФСР № 442-1 от 22.12.1990) и начало деятельности по управлению пенсионными накоплениями"
    },
    {
      year: "2015",
      title: "Цифровизация",
      description: "Запуск первой версии онлайн-платформы для клиентского обслуживания"
    },
    {
      year: "2020",
      title: "Модернизация",
      description: "Полное обновление IT-системы и внедрение современных технологий безопасности"
    },
    {
      year: "2023",
      title: "Настоящее",
      description: "Запуск новой платформы с расширенными возможностями и мобильным приложением"
    }
  ];

  return (
    <div>
      {/* Main About Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">О нашем фонде</h1>
              <p className="text-xl text-slate-600 mb-8">
                В Российской Федерации насчитывается около 40,8 млн пенсионеров. В прошлом году выплачено пенсий на общую сумму ≈ 10,3 трлн рублей. Пенсионный фонд работает более 33 лет.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="text-primary" size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Миссия</h3>
                    <p className="text-slate-600">
                      Обеспечить достойную старость каждого гражданина через надежную и прозрачную пенсионную систему
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Eye className="text-primary" size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Видение</h3>
                    <p className="text-slate-600">
                      Стать лидером в области цифровых пенсионных услуг с высочайшими стандартами качества
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="text-primary" size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Ценности</h3>
                    <p className="text-slate-600">
                      Надежность, прозрачность, инновации и забота о каждом клиенте
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-6 mt-12 lg:mt-0">
              <img
                src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Флаг Российской Федерации"
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">История развития</h2>
            <p className="text-xl text-slate-600">Ключевые этапы нашего развития</p>
          </div>
          
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-center space-x-6">
                <div className="w-4 h-4 bg-primary rounded-full flex-shrink-0"></div>
                <div className="bg-white rounded-lg p-6 shadow-sm flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{item.year} год</h3>
                    <span className="text-sm text-slate-500">{item.title}</span>
                  </div>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
