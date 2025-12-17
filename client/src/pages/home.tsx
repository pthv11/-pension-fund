import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Clock, TrendingUp, Smartphone, Users, FileText } from "lucide-react";
import { useLocation } from "wouter";

// Import Swiper styles and components
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

export default function Home() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    document.title = "ПенсионныйФонд.РФ - Главная";
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const slides = [
    {
      title: "Надежная защита вашего будущего",
      subtitle: "Современная система управления пенсионными накоплениями с полной цифровизацией процессов",
      image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600",
      alt: "Счастливая пожилая пара обнимается на природе",
      buttons: [
        { text: "Подать заявление", variant: "primary" },
        { text: "Узнать больше", variant: "outline" }
      ]
    },
    {
      title: "Цифровые услуги для каждого",
      subtitle: "Получайте государственные услуги онлайн 24/7 через удобный личный кабинет",
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600",
      alt: "Пожилой мужчина с улыбкой работает на компьютере",
      buttons: [
        { text: "Личный кабинет", variant: "primary" },
        { text: "Справочник услуг", variant: "outline" }
      ]
    },
    {
      title: "Прозрачная отчетность",
      subtitle: "Полная информация о ваших накоплениях и начислениях в реальном времени",
      image: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600",
      alt: "Семья трех поколений за обеденным столом",
      buttons: [
        { text: "Проверить баланс", variant: "primary" },
        { text: "Скачать отчет", variant: "outline" }
      ]
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Безопасность данных",
      description: "Многоуровневая защита персональных данных с использованием современных методов шифрования"
    },
    {
      icon: Clock,
      title: "24/7 Доступность",
      description: "Круглосуточный доступ к услугам через интернет без очередей и бумажной волокиты"
    },
    {
      icon: TrendingUp,
      title: "Аналитика",
      description: "Детальная аналитика и прогнозы по вашим пенсионным накоплениям"
    },
    {
      icon: Smartphone,
      title: "Мобильный доступ",
      description: "Удобное мобильное приложение для управления услугами в любое время"
    },
    {
      icon: Users,
      title: "Поддержка",
      description: "Квалифицированная техническая поддержка и консультации специалистов"
    },
    {
      icon: FileText,
      title: "Документооборот",
      description: "Электронный документооборот с цифровой подписью и архивом документов"
    }
  ];

  const stats = [
    { value: "40.8M", label: "Пенсионеров в России" },
    { value: "33+", label: "Лет работы фонда" },
    { value: "99.9%", label: "Время работы системы" },
    { value: "10.3 трлн₽", label: "Выплачено пенсий в год" }
  ];

  return (
    <div>
      {/* Hero Slider */}
      <div className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletActiveClass: "!bg-primary",
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          loop={true}
          className="hero-swiper h-[600px]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full flex items-center">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${slide.image}')`,
                  }}
                  role="img"
                  aria-label={slide.alt}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Fixed Content */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Надежная защита вашего будущего
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-2xl text-slate-200">
              Современная система управления пенсионными накоплениями с полной цифровизацией процессов
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                variant="default"
                className="bg-white text-primary hover:bg-slate-100 font-semibold px-8 py-4"
                onClick={() => handleNavigate("/contact")}
              >
                Подать заявление
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4"
                onClick={() => handleNavigate("/about")}
              >
                Узнать больше
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Преимущества нашей системы</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Современные технологии для эффективного управления пенсионными накоплениями
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-slate-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Наши достижения</h2>
            <p className="text-xl text-slate-600">Цифры, которые говорят о нашей надежности</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <p className="text-slate-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
