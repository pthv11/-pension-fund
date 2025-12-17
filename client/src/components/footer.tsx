import { Shield } from "lucide-react";
import { FaTelegram, FaVk, FaOdnoklassniki } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold">ПенсионныйФонд.РФ</h3>
              </div>
            </div>
            <p className="text-slate-300 mb-4">Надежный партнер в обеспечении вашего будущего</p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <FaTelegram size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <FaVk size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <FaOdnoklassniki size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Услуги</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Пенсионные накопления</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Социальные выплаты</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Материнский капитал</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Инвестиционные программы</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Поддержка</h4>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#" className="hover:text-white transition-colors">Справочный центр</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Часто задаваемые вопросы</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Обратная связь</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Техническая поддержка</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                8-800-555-01-23
              </li>
              <li className="flex items-center">
                <span className="mr-2">✉️</span>
                info@pensionfund.ru
              </li>
              <li className="flex items-center">
                <span className="mr-2">📍</span>
                Москва, ул. Тверская, 15
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <p className="text-slate-400">&copy; 2023 ПенсионныйФонд.РФ. Все права защищены.</p>
            <div className="flex space-x-6 mt-4 lg:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Политика конфиденциальности</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Условия использования</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Карта сайта</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
