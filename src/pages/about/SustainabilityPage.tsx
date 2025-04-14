
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Recycle, Factory, Droplets, Wind, Globe } from "lucide-react";

const SustainabilityPage = () => {
  return (
    <PageLayout showCategories={false}>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Устойчивое развитие</h1>
        <p className="text-gray-600 text-center mb-10">Наши инициативы и обязательства по защите планеты</p>
        
        <div className="mb-16">
          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-2xl font-bold mb-4">Наша миссия</h2>
              <p className="text-gray-700 mb-4">
                ВайлдСтор стремится стать лидером в области устойчивой моды, создавая продукты, 
                которые не только стильные и качественные, но и произведены с заботой об окружающей среде 
                и социальной ответственностью.
              </p>
              <p className="text-gray-700">
                Мы верим, что мода может быть одновременно красивой и ответственной, и работаем над тем, 
                чтобы каждый наш продукт отражал эту философию.
              </p>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Sustainability Mission" 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <Recycle className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">Переработка и материалы</h3>
                <p className="text-gray-600 text-center">
                  Мы используем переработанные и экологически чистые материалы во всех наших коллекциях.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <Factory className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">Ответственное производство</h3>
                <p className="text-gray-600 text-center">
                  Наши фабрики соответствуют самым высоким стандартам экологической и социальной ответственности.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <Globe className="h-12 w-12 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">Глобальное влияние</h3>
                <p className="text-gray-600 text-center">
                  Мы поддерживаем глобальные инициативы по защите окружающей среды и справедливой торговле.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Tabs defaultValue="goals" className="mb-16">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="goals">Наши цели</TabsTrigger>
            <TabsTrigger value="initiatives">Инициативы</TabsTrigger>
            <TabsTrigger value="progress">Прогресс</TabsTrigger>
          </TabsList>
          
          <TabsContent value="goals">
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-green-100 p-3">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Снижение углеродного следа</h3>
                    <p className="text-gray-700 mb-3">
                      Мы стремимся сократить наш углеродный след на 50% к 2030 году за счет оптимизации 
                      производства, логистики и использования возобновляемых источников энергии.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Прогресс к 2030 году</span>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Droplets className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Рациональное использование воды</h3>
                    <p className="text-gray-700 mb-3">
                      Наша цель — сократить потребление воды на 60% к 2030 году за счет внедрения 
                      инновационных технологий и замкнутых циклов в производстве.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Прогресс к 2030 году</span>
                        <span className="text-sm font-medium">40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-purple-100 p-3">
                    <Recycle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Циркулярная экономика</h3>
                    <p className="text-gray-700 mb-3">
                      К 2030 году мы планируем перейти на полностью циркулярную модель, при которой 
                      все наши товары будут производиться из переработанных или возобновляемых материалов.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Прогресс к 2030 году</span>
                        <span className="text-sm font-medium">30%</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="initiatives">
            <div className="space-y-8">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                      alt="Recycling Program" 
                      className="h-full w-full object-cover"
                      style={{ maxHeight: "250px" }}
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <h3 className="text-lg font-semibold mb-2">Программа переработки текстиля</h3>
                    <p className="text-gray-700 mb-4">
                      Наша программа по сбору и переработке старой одежды действует во всех магазинах сети. 
                      Принесите ненужные вещи, и мы дадим им вторую жизнь или переработаем в новые материалы.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Переработка</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Отходы</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Материалы</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" 
                      alt="Water Conservation" 
                      className="h-full w-full object-cover"
                      style={{ maxHeight: "250px" }}
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <h3 className="text-lg font-semibold mb-2">Водосберегающее производство</h3>
                    <p className="text-gray-700 mb-4">
                      Мы инвестируем в инновационные технологии окрашивания и обработки тканей, которые 
                      используют до 80% меньше воды по сравнению с традиционными методами.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Вода</span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Производство</span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Технологии</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src="https://images.unsplash.com/photo-1473646590311-c48e1bc77b44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                      alt="Renewable Energy" 
                      className="h-full w-full object-cover"
                      style={{ maxHeight: "250px" }}
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <h3 className="text-lg font-semibold mb-2">Переход на возобновляемую энергию</h3>
                    <p className="text-gray-700 mb-4">
                      Все наши магазины и склады постепенно переходят на использование энергии из 
                      возобновляемых источников — солнца, ветра и воды.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Энергия</span>
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Климат</span>
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Инновации</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="progress">
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Наши достижения к 2023 году</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span>Переработанные материалы в производстве</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span>Сокращение выбросов CO2</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span>Экономия воды в производстве</span>
                      <span className="font-medium">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span>Возобновляемая энергия в магазинах</span>
                      <span className="font-medium">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span>Переработано текстильных отходов</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                  <Wind className="h-10 w-10 text-store-purple mx-auto mb-2" />
                  <p className="text-3xl font-bold">75%</p>
                  <p className="text-gray-600">Сокращение использования пластика в упаковке</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                  <Factory className="h-10 w-10 text-store-purple mx-auto mb-2" />
                  <p className="text-3xl font-bold">100%</p>
                  <p className="text-gray-600">Аудит всех производственных партнеров</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm text-center">
                  <Recycle className="h-10 w-10 text-store-purple mx-auto mb-2" />
                  <p className="text-3xl font-bold">200т</p>
                  <p className="text-gray-600">Текстиля собрано и переработано</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-green-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Присоединяйтесь к нам</h2>
          <p className="text-gray-700 text-center mb-6 max-w-2xl mx-auto">
            Устойчивое развитие — это путешествие, а не пункт назначения. Мы постоянно учимся, 
            адаптируемся и улучшаем наши методы. Мы приглашаем вас присоединиться к нам в этом пути.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
            <Card className="bg-white">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2 text-center">Как вы можете помочь</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Leaf className="h-5 w-5 mr-2 text-green-600 shrink-0 mt-0.5" /> 
                    Приносите старую одежду в наши магазины для переработки
                  </li>
                  <li className="flex items-start">
                    <Leaf className="h-5 w-5 mr-2 text-green-600 shrink-0 mt-0.5" /> 
                    Выбирайте товары из нашей экологичной коллекции
                  </li>
                  <li className="flex items-start">
                    <Leaf className="h-5 w-5 mr-2 text-green-600 shrink-0 mt-0.5" /> 
                    Делитесь информацией о наших инициативах
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2 text-center">Наши партнеры</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <Globe className="h-5 w-5 mr-2 text-blue-600 shrink-0 mt-0.5" /> 
                    WWF России
                  </li>
                  <li className="flex items-start">
                    <Globe className="h-5 w-5 mr-2 text-blue-600 shrink-0 mt-0.5" /> 
                    Фонд "Чистые моря"
                  </li>
                  <li className="flex items-start">
                    <Globe className="h-5 w-5 mr-2 text-blue-600 shrink-0 mt-0.5" /> 
                    Альянс устойчивой моды
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SustainabilityPage;
