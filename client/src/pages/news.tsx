import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Users, TrendingUp } from "lucide-react";

interface NewsArticle {
  id: number;
  title: string;
  description: string;
  publishedAt: string;
  source: string;
  category: string;
  image: string;
}

export default function News() {
  useEffect(() => {
    document.title = "Новости - ПенсионныйФонд.РФ";
  }, []);

  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      title: "Индексация социальных пенсий с 1 апреля 2025 года",
      description: "С 1 апреля 2025 года социальные пенсии в России были проиндексированы на 14,75%. Это повышение затронуло более 4,2 миллиона граждан, включая инвалидов, детей-сирот и пенсионеров, не имеющих достаточного трудового стажа для получения страховой пенсии. Средний размер социальной пенсии после индексации составил 15 456 рублей.",
      publishedAt: "2025-04-01",
      source: "ТАСС",
      category: "Индексация",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    },
    {
      id: 2,
      title: "Повышение страховых пенсий в январе 2025 года",
      description: "С 1 января 2025 года страховые пенсии были проиндексированы на 7,3%, а в феврале — дополнительно до 9,5%. Эти меры затронули более 38 миллионов получателей страховых пенсий, включая 33,4 миллиона получателей пенсий по старости. В результате средний размер страховой пенсии по старости составил около 25 000 рублей в месяц.",
      publishedAt: "2025-01-15",
      source: "РБК",
      category: "Индексация",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    },
    {
      id: 3,
      title: "Программа долгосрочных сбережений — инвестиции в ваше будущее",
      description: "С апреля 2024 года в России действует Программа долгосрочных сбережений (ПДС), позволяющая гражданам формировать дополнительные накопления к будущей пенсии. К 1 апреля 2025 года в ПДС уже вступили более 4 миллионов человек, а общая сумма привлечённых средств достигла почти 300 миллиардов рублей.",
      publishedAt: "2025-04-01",
      source: "Социальный фонд России",
      category: "Накопления",
      image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    },
    {
      id: 4,
      title: "Социальная доплата к пенсии — обеспечение прожиточного минимума",
      description: "Если сумма вашей пенсии ниже установленного прожиточного минимума пенсионера в вашем регионе, вы имеете право на социальную доплату. Эта мера гарантирует, что общий доход пенсионера не будет ниже прожиточного минимума, установленного в субъекте Российской Федерации.",
      publishedAt: "2025-03-20",
      source: "Интерфакс Россия",
      category: "Социальная поддержка",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    },
    {
      id: 5,
      title: "Электронные сервисы Пенсионного фонда — удобно и быстро",
      description: "Пенсионный фонд России предлагает широкий спектр электронных услуг, доступных через личный кабинет на официальном сайте. Вы можете подать заявление на назначение пенсии, заказать справки, узнать информацию о начислениях и стаже, а также отслеживать статус поданных заявлений.",
      publishedAt: "2025-03-15",
      source: "ПФР",
      category: "Цифровизация",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    },
    {
      id: 6,
      title: "Пенсионные баллы — что это и как они начисляются",
      description: "Пенсионные баллы — это единицы, используемые для расчёта страховой пенсии. Количество баллов зависит от размера уплаченных страховых взносов и продолжительности трудового стажа. Чем больше баллов вы накопите за период трудовой деятельности, тем выше будет размер вашей будущей пенсии.",
      publishedAt: "2025-03-10",
      source: "ПФР",
      category: "Информация",
      image: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    },
    {
      id: 7,
      title: "Досрочный выход на пенсию — кто имеет право",
      description: "Некоторые категории граждан имеют право на досрочный выход на пенсию: работники, занятые на работах с вредными или опасными условиями труда; граждане, имеющие длительный трудовой стаж (для женщин — 37 лет, для мужчин — 42 года); многодетные матери, воспитавшие пятерых и более детей.",
      publishedAt: "2025-03-05",
      source: "РБК",
      category: "Льготы",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    },
    {
      id: 8,
      title: "Пенсия по инвалидности — порядок оформления",
      description: "Граждане, признанные инвалидами, имеют право на получение пенсии по инвалидности. Размер пенсии зависит от группы инвалидности, наличия трудового стажа и других факторов. Для оформления пенсии необходимо предоставить медицинское заключение и другие документы в отделение Пенсионного фонда.",
      publishedAt: "2025-02-28",
      source: "Социальный фонд России",
      category: "Социальная поддержка",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    },
    {
      id: 9,
      title: "Пенсия по потере кормильца — поддержка для семей",
      description: "Пенсия по потере кормильца назначается нетрудоспособным членам семьи умершего застрахованного лица. К таким членам семьи относятся несовершеннолетние дети, супруги, родители и другие иждивенцы. Для назначения пенсии необходимо обратиться в отделение Пенсионного фонда с соответствующими документами.",
      publishedAt: "2025-02-20",
      source: "Социальный фонд России",
      category: "Социальная поддержка",
      image: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    },
    {
      id: 10,
      title: "Работающие пенсионеры — особенности начисления пенсии",
      description: "Пенсионеры, продолжающие трудовую деятельность, получают страховую пенсию без индексации до момента прекращения работы. После завершения трудовой деятельности пенсия будет проиндексирована с учётом всех пропущенных индексаций. Важно своевременно уведомлять Пенсионный фонд о прекращении работы.",
      publishedAt: "2025-02-15",
      source: "ПФР",
      category: "Информация",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Индексация":
        return <TrendingUp size={16} className="text-green-600" />;
      case "Социальная поддержка":
        return <Users size={16} className="text-blue-600" />;
      default:
        return <Calendar size={16} className="text-slate-600" />;
    }
  };

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Новости пенсионной системы
          </h1>
          <p className="text-xl text-slate-600">
            Актуальная информация о пенсионном обеспечении в России
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={article.image}
                alt={article.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {getCategoryIcon(article.category)}
                    <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full ml-2">
                      {article.category}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <Calendar size={16} className="mr-1" />
                    {formatDate(article.publishedAt)}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {article.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">
                    Источник: {article.source}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      alert("Для получения подробной информации обратитесь в ближайшее отделение ПФР");
                    }}
                  >
                    Подробнее
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}