
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Building2, Briefcase, Users, BarChart, Zap, Heart, Sparkles } from "lucide-react";

const CareersPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("vacancies");
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    toast({
      title: "Заявка отправлена",
      description: "Спасибо за интерес к нашей компании! Мы рассмотрим ваше резюме и свяжемся с вами в ближайшее время.",
      duration: 5000,
    });
  };
  
  const jobListings = [
    {
      id: 1,
      title: "Менеджер по продажам",
      location: "Москва",
      type: "Полная занятость",
      department: "Продажи",
      description: "Мы ищем энергичного менеджера по продажам для работы в нашем флагманском магазине в Москве.",
      requirements: [
        "Опыт работы в розничных продажах от 2 лет",
        "Отличные коммуникативные навыки",
        "Опыт в модной индустрии приветствуется",
        "Знание техник продаж и обслуживания клиентов"
      ]
    },
    {
      id: 2,
      title: "Разработчик веб-приложений",
      location: "Удаленно",
      type: "Полная занятость",
      department: "IT",
      description: "Разработка и поддержка нашей электронной платформы для обеспечения лучшего пользовательского опыта.",
      requirements: [
        "React, TypeScript, Node.js",
        "Опыт разработки от 3 лет",
        "Понимание UX/UI принципов",
        "Опыт работы с REST API"
      ]
    },
    {
      id: 3,
      title: "Маркетолог",
      location: "Санкт-Петербург",
      type: "Полная занятость",
      department: "Маркетинг",
      description: "Разработка и реализация маркетинговых кампаний для привлечения новых клиентов и продвижения бренда.",
      requirements: [
        "Опыт в digital-маркетинге от 2 лет",
        "Знание инструментов аналитики",
        "Опыт работы с социальными медиа",
        "Креативное мышление и аналитический склад ума"
      ]
    },
    {
      id: 4,
      title: "Дизайнер одежды",
      location: "Москва",
      type: "Полная занятость",
      department: "Дизайн",
      description: "Разработка новых коллекций одежды, следование трендам и создание уникальных дизайнов для нашего бренда.",
      requirements: [
        "Образование в области дизайна одежды",
        "Портфолио с предыдущими работами",
        "Знание текущих трендов в моде",
        "Опыт работы с программами для дизайна"
      ]
    }
  ];
  
  return (
    <PageLayout showCategories={false}>
      <div className="max-w-5xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Карьера в ВайлдСтор</h1>
        <p className="text-gray-600 text-center mb-10">Присоединяйтесь к нашей команде и развивайтесь вместе с нами</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center pb-2">
              <Sparkles className="h-10 w-10 text-store-purple mx-auto mb-2" />
              <CardTitle>Инновации</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Мы постоянно внедряем новые технологии и идеи, чтобы быть впереди.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center pb-2">
              <Users className="h-10 w-10 text-store-purple mx-auto mb-2" />
              <CardTitle>Командная работа</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Мы верим в силу сотрудничества и взаимной поддержки.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center pb-2">
              <Heart className="h-10 w-10 text-store-purple mx-auto mb-2" />
              <CardTitle>Забота о сотрудниках</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Мы обеспечиваем комфортные условия работы и возможности для роста.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="vacancies">Вакансии</TabsTrigger>
            <TabsTrigger value="benefits">Преимущества</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vacancies">
            <div className="space-y-6">
              {jobListings.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="flex items-center text-sm text-gray-600">
                              <Building2 className="h-4 w-4 mr-1" /> {job.location}
                            </span>
                            <span className="flex items-center text-sm text-gray-600">
                              <Briefcase className="h-4 w-4 mr-1" /> {job.type}
                            </span>
                            <span className="flex items-center text-sm text-gray-600">
                              <Zap className="h-4 w-4 mr-1" /> {job.department}
                            </span>
                          </div>
                        </CardDescription>
                      </div>
                      <Button variant="outline" className="px-4">Подробнее</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{job.description}</p>
                    <div>
                      <h4 className="font-semibold mb-2">Требования:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button className="bg-store-purple hover:bg-store-purple-dark">Откликнуться</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="benefits">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-store-purple" />
                    Профессиональный рост
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Программы наставничества и обучения</li>
                    <li>• Регулярные тренинги и семинары</li>
                    <li>• Возможности продвижения внутри компании</li>
                    <li>• Индивидуальные планы развития для сотрудников</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-store-purple" />
                    Благополучие сотрудников
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Медицинская страховка для вас и вашей семьи</li>
                    <li>• Гибкий рабочий график</li>
                    <li>• Возможность удаленной работы</li>
                    <li>• Комфортные офисы и зоны отдыха</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-store-purple" />
                    Финансовые бонусы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Конкурентная заработная плата</li>
                    <li>• Квартальные бонусы за достижение целей</li>
                    <li>• Скидки на все товары нашего магазина</li>
                    <li>• Оплата спортивных занятий</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-store-purple" />
                    Корпоративная культура
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Дружный коллектив единомышленников</li>
                    <li>• Регулярные командные мероприятия</li>
                    <li>• Программы признания и награждения</li>
                    <li>• Корпоративные праздники и выезды</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Отправить резюме</h2>
          
          {formSubmitted ? (
            <div className="text-center py-8">
              <Sparkles className="h-16 w-16 text-store-purple mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Спасибо за вашу заявку!</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Мы рассмотрим ваше резюме и свяжемся с вами в ближайшее время для обсуждения деталей.
              </p>
              <Button 
                className="mt-6 bg-store-purple hover:bg-store-purple-dark"
                onClick={() => setFormSubmitted(false)}
              >
                Отправить еще заявку
              </Button>
            </div>
          ) : (
            <form onSubmit={handleApplicationSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя и Фамилия *</Label>
                  <Input id="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input id="phone" type="tel" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Интересующая вакансия *</Label>
                  <Input id="position" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Сопроводительное письмо</Label>
                <Textarea 
                  id="message" 
                  placeholder="Расскажите о себе и о том, почему вы хотите работать с нами"
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resume">Резюме *</Label>
                <Input id="resume" type="file" accept=".pdf,.doc,.docx" required />
                <p className="text-xs text-gray-500">Принимаются файлы в форматах PDF, DOC или DOCX</p>
              </div>
              
              <div className="pt-4">
                <Button type="submit" className="w-full bg-store-purple hover:bg-store-purple-dark">
                  Отправить заявку
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default CareersPage;
