
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Users, Award } from "lucide-react";

const HistoryPage = () => {
  return (
    <PageLayout showCategories={false}>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Наша история</h1>
        
        <div className="prose prose-lg max-w-none mb-10">
          <p className="text-lg text-gray-600 leading-relaxed">
            Компания <strong>ВайлдСтор</strong> начала свой путь в 2008 году как небольшой магазин одежды в центре Москвы. 
            Наша цель всегда оставалась неизменной — предлагать клиентам качественные товары по доступным ценам и обеспечивать 
            исключительный сервис на каждом этапе взаимодействия.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <CalendarDays className="h-12 w-12 text-store-purple" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">2008</h3>
              <p className="text-gray-600 text-center">Открытие первого магазина в Москве</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-store-purple" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">2014</h3>
              <p className="text-gray-600 text-center">Расширение до 25 магазинов по всей России</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-store-purple" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">2020</h3>
              <p className="text-gray-600 text-center">Запуск онлайн-платформы и международное расширение</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Наше путешествие</h2>
          <div className="space-y-8">
            <div className="relative pl-8 pb-8 border-l-2 border-gray-200">
              <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-store-purple"></div>
              <h3 className="font-bold text-lg">2008-2010: Первые шаги</h3>
              <p className="text-gray-600 mt-2">
                Открыв первый магазин, мы сосредоточились на создании уникального ассортимента одежды 
                для молодежи. Наш первый магазин быстро стал популярным местом для модников Москвы.
              </p>
            </div>
            
            <div className="relative pl-8 pb-8 border-l-2 border-gray-200">
              <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-store-purple"></div>
              <h3 className="font-bold text-lg">2011-2015: Время роста</h3>
              <p className="text-gray-600 mt-2">
                В этот период мы расширили наш ассортимент и открыли магазины во всех крупных городах России. 
                К 2015 году у нас было уже более 40 магазинов, и мы начали разрабатывать собственные коллекции.
              </p>
            </div>
            
            <div className="relative pl-8 pb-8 border-l-2 border-gray-200">
              <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-store-purple"></div>
              <h3 className="font-bold text-lg">2016-2019: Инновации и технологии</h3>
              <p className="text-gray-600 mt-2">
                Мы внедрили новые технологии в наш бизнес, от интерактивных примерочных до систем умного учета товаров. 
                В 2019 году мы запустили наш первый мобильный приложение.
              </p>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-store-purple"></div>
              <h3 className="font-bold text-lg">2020-Настоящее время: Цифровая трансформация</h3>
              <p className="text-gray-600 mt-2">
                Пандемия ускорила наше развитие в области электронной коммерции. Мы запустили полноценную 
                онлайн-платформу, которая сегодня обслуживает клиентов по всему миру, и продолжаем расширять 
                наше физическое присутствие.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Наши ценности</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-2">Качество</h3>
              <p className="text-gray-600">
                Мы тщательно отбираем каждый товар и сотрудничаем только с надежными производителями, 
                чтобы гарантировать высокое качество.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-2">Доступность</h3>
              <p className="text-gray-600">
                Мы верим, что стильная и качественная одежда должна быть доступна каждому, 
                поэтому постоянно работаем над оптимизацией наших цен.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-2">Инновации</h3>
              <p className="text-gray-600">
                Мы всегда в поиске новых технологий и решений, которые могут улучшить 
                опыт покупок наших клиентов.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-2">Устойчивое развитие</h3>
              <p className="text-gray-600">
                Мы заботимся о планете и стремимся минимизировать наше воздействие на окружающую среду 
                через ответственный подход к производству и упаковке.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HistoryPage;
