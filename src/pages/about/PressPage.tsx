
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Download, ExternalLink, MessageSquare, Newspaper } from "lucide-react";

const PressPage = () => {
  const pressReleases = [
    {
      id: 1,
      title: "ВайлдСтор объявляет о выпуске новой экологичной коллекции одежды",
      date: "15 марта 2023",
      summary: "Новая коллекция одежды из переработанных материалов становится важным шагом компании в направлении устойчивого развития.",
      image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1011&q=80"
    },
    {
      id: 2,
      title: "ВайлдСтор открывает 100-й магазин в России",
      date: "5 октября 2022",
      summary: "Достигнут важный рубеж в развитии компании: открытие 100-го магазина в городе Казань отмечает новую веху в истории бренда.",
      image: "https://images.unsplash.com/photo-1482931455023-0c9e6603da5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    },
    {
      id: 3,
      title: "ВайлдСтор запускает программу переработки текстиля",
      date: "20 июля 2022",
      summary: "Инновационная программа переработки старой одежды и текстиля призвана сократить количество текстильных отходов и дать вторую жизнь материалам.",
      image: "https://images.unsplash.com/photo-1558234608-09841635896e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"
    },
    {
      id: 4,
      title: "ВайлдСтор получает награду 'Лучший интернет-магазин года'",
      date: "12 мая 2022",
      summary: "Престижная награда в области электронной коммерции подтверждает высокое качество онлайн-сервиса компании и инновационный подход к онлайн-шоппингу.",
      image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80"
    }
  ];
  
  const mediaAppearances = [
    {
      id: 1,
      title: "'Мода будущего': ВайлдСтор и инновации в розничной торговле",
      publication: "Бизнес Журнал",
      date: "10 апреля 2023",
      summary: "Обширная статья о технологических инновациях, внедряемых ВайлдСтор в своих магазинах, и о том, как это трансформирует покупательский опыт.",
      link: "#"
    },
    {
      id: 2,
      title: "Интервью с CEO ВайлдСтор: 'Мы создаем не просто одежду, а стиль жизни'",
      publication: "Эхо Моды",
      date: "25 февраля 2023",
      summary: "Эксклюзивное интервью с генеральным директором компании о стратегии развития, ценностях и будущих планах ВайлдСтор.",
      link: "#"
    },
    {
      id: 3,
      title: "ВайлдСтор: как российский бренд покоряет международный рынок",
      publication: "Forbes",
      date: "17 января 2023",
      summary: "История успеха российского бренда, стратегия международной экспансии и факторы, способствующие глобальному признанию.",
      link: "#"
    },
    {
      id: 4,
      title: "Устойчивое развитие в моде: опыт ВайлдСтор",
      publication: "Экология и Бизнес",
      date: "3 декабря 2022",
      summary: "Подробный анализ экологических инициатив ВайлдСтор и их влияния на отрасль моды в целом.",
      link: "#"
    }
  ];
  
  return (
    <PageLayout showCategories={false}>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Пресс-центр</h1>
        <p className="text-gray-600 text-center mb-10">Новости, пресс-релизы и публикации о ВайлдСтор</p>
        
        <div className="bg-gradient-to-r from-store-purple/10 to-purple-100 p-8 rounded-lg mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-2xl font-bold mb-4">Для представителей СМИ</h2>
              <p className="text-gray-700 mb-4">
                Если вы журналист или блогер и хотите получить дополнительную информацию о ВайлдСтор, 
                пожалуйста, свяжитесь с нашим пресс-центром. Мы готовы предоставить комментарии, 
                организовать интервью и помочь с подготовкой материалов.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-store-purple" />
                  <span className="text-gray-700">Email: press@wildstore.ru</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-store-purple" />
                  <span className="text-gray-700">Часы работы: Пн-Пт, 9:00-18:00</span>
                </div>
              </div>
              <div className="mt-6">
                <Button className="bg-store-purple hover:bg-store-purple-dark">
                  <Download className="mr-2 h-4 w-4" />
                  Скачать пресс-кит
                </Button>
              </div>
            </div>
            <div className="md:w-1/3">
              <img 
                src="https://images.unsplash.com/photo-1664575599618-8f6bd76fc670?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Press Center" 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="press-releases" className="mb-10">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="press-releases">Пресс-релизы</TabsTrigger>
            <TabsTrigger value="media">СМИ о нас</TabsTrigger>
          </TabsList>
          
          <TabsContent value="press-releases">
            <div className="space-y-6">
              {pressReleases.map((release) => (
                <Card key={release.id}>
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <img 
                        src={release.image} 
                        alt={release.title}
                        className="h-full w-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                        style={{ maxHeight: "220px" }}
                      />
                    </div>
                    <div className="md:w-2/3 flex flex-col">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{release.title}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <CalendarDays className="h-4 w-4 mr-1" /> {release.date}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{release.summary}</p>
                      </CardContent>
                      <CardFooter className="mt-auto">
                        <Button variant="outline">Читать полностью</Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="media">
            <div className="space-y-6">
              {mediaAppearances.map((media) => (
                <Card key={media.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{media.title}</CardTitle>
                        <CardDescription className="flex flex-col md:flex-row md:items-center mt-1">
                          <span className="flex items-center">
                            <Newspaper className="h-4 w-4 mr-1" /> {media.publication}
                          </span>
                          <span className="md:ml-4 flex items-center mt-1 md:mt-0">
                            <CalendarDays className="h-4 w-4 mr-1" /> {media.date}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{media.summary}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Перейти к статье
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">ВайлдСтор в цифрах</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-store-purple">15+</p>
              <p className="text-gray-600">Лет на рынке</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-store-purple">100+</p>
              <p className="text-gray-600">Магазинов</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-store-purple">5000+</p>
              <p className="text-gray-600">Сотрудников</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-store-purple">10+</p>
              <p className="text-gray-600">Стран присутствия</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PressPage;
