
import PageLayout from "@/components/layout/PageLayout";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Cookie, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const CookiesPage = () => {
  const { toast } = useToast();
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: false,
  });
  
  const handleSavePreferences = () => {
    toast({
      title: "Настройки сохранены",
      description: "Ваши предпочтения по использованию cookies успешно сохранены.",
      duration: 3000,
    });
  };
  
  const handleToggleAll = (value: boolean) => {
    setCookiePreferences({
      ...cookiePreferences,
      functional: value,
      analytics: value,
      marketing: value,
    });
  };
  
  return (
    <PageLayout showCategories={false}>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center mb-8">
          <Cookie className="h-6 w-6 text-store-purple mr-2" />
          <h1 className="text-3xl font-bold">Политика использования cookies</h1>
        </div>
        
        <Tabs defaultValue="about">
          <TabsList className="mb-8">
            <TabsTrigger value="about">О cookies</TabsTrigger>
            <TabsTrigger value="types">Типы cookies</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-500 mb-6">Последнее обновление: 15 марта 2023</p>
              
              <div className="prose prose-sm max-w-none text-gray-700">
                <h2 className="text-xl font-semibold mb-4">Что такое cookies?</h2>
                <p>
                  Cookies — это небольшие текстовые файлы, которые сохраняются в вашем браузере или на жестком диске вашего компьютера при посещении нашего сайта. Cookies позволяют нам распознавать ваш браузер и запоминать определенную информацию о ваших предпочтениях, чтобы персонализировать ваш опыт использования нашего сайта.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-4">Почему мы используем cookies?</h2>
                <p>
                  Мы используем cookies по нескольким причинам:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Для обеспечения правильной работы нашего сайта</li>
                  <li>Для сохранения ваших предпочтений и персонализации контента</li>
                  <li>Для анализа посещаемости и улучшения работы сайта</li>
                  <li>Для предоставления релевантной рекламы и маркетинговых материалов</li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-6 mb-4">Как управлять cookies?</h2>
                <p>
                  Большинство веб-браузеров автоматически принимают cookies, но вы можете изменить настройки своего браузера так, чтобы отклонять cookies или предупреждать вас, когда cookies отправляются на ваше устройство.
                </p>
                <p>
                  Ниже приведены ссылки на инструкции по управлению cookies в популярных браузерах:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><a href="#" className="text-store-purple hover:underline">Google Chrome</a></li>
                  <li><a href="#" className="text-store-purple hover:underline">Mozilla Firefox</a></li>
                  <li><a href="#" className="text-store-purple hover:underline">Safari</a></li>
                  <li><a href="#" className="text-store-purple hover:underline">Microsoft Edge</a></li>
                </ul>
                <p>
                  Пожалуйста, обратите внимание, что отключение cookies может повлиять на функциональность нашего сайта и ограничить ваш доступ к некоторым функциям или услугам.
                </p>
                
                <h2 className="text-xl font-semibold mt-6 mb-4">Как долго хранятся cookies?</h2>
                <p>
                  Срок хранения cookies зависит от их типа:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Сессионные cookies:</strong> временные файлы, которые удаляются, когда вы закрываете браузер. Они помогают сайту "запомнить", что вы делали на предыдущей странице, что позволяет избежать повторного ввода информации.
                  </li>
                  <li>
                    <strong>Постоянные cookies:</strong> остаются на вашем устройстве до истечения срока их действия или до удаления вами. Они помогают запомнить ваши предпочтения для будущих посещений, ускоряют и улучшают ваш опыт работы с сайтом.
                  </li>
                </ul>
                
                <h2 className="text-xl font-semibold mt-6 mb-4">Изменения в политике использования cookies</h2>
                <p>
                  Мы оставляем за собой право вносить изменения в нашу политику использования cookies. Любые изменения будут опубликованы на этой странице. Мы рекомендуем периодически проверять эту страницу, чтобы быть в курсе последних изменений.
                </p>
                <p>
                  Используя наш сайт после публикации изменений, вы соглашаетесь с обновленной политикой использования cookies.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="types">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Типы cookies, которые мы используем</h2>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Необходимые cookies</CardTitle>
                    <CardDescription>
                      Эти cookies необходимы для функционирования нашего сайта и не могут быть отключены.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-medium mb-1">session_cookie</h4>
                        <p className="text-sm text-gray-600">Используется для поддержания вашей сессии на сайте.</p>
                        <p className="text-xs text-gray-500 mt-1">Срок хранения: до закрытия браузера</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-medium mb-1">cart_cookie</h4>
                        <p className="text-sm text-gray-600">Сохраняет информацию о товарах в вашей корзине.</p>
                        <p className="text-xs text-gray-500 mt-1">Срок хранения: 30 дней</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-medium mb-1">csrf_token</h4>
                        <p className="text-sm text-gray-600">Защищает от подделки межсайтовых запросов.</p>
                        <p className="text-xs text-gray-500 mt-1">Срок хранения: до закрытия браузера</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Функциональные cookies</CardTitle>
                    <CardDescription>
                      Эти cookies позволяют нашему сайту запоминать выбранные вами настройки и предпочтения.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-medium mb-1">preferences_cookie</h4>
                        <p className="text-sm text-gray-600">Сохраняет ваши настройки и предпочтения.</p>
                        <p className="text-xs text-gray-500 mt-1">Срок хранения: 1 год</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-medium mb-1">language_cookie</h4>
                        <p className="text-sm text-gray-600">Запоминает выбранный вами язык.</p>
                        <p className="text-xs text-gray-500 mt-1">Срок хранения: 1 год</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-medium mb-1">recently_viewed</h4>
                        <p className="text-sm text-gray-600">Сохраняет информацию о просмотренных вами товарах.</p>
                        <p className="text-xs text-gray-500 mt-1">Срок хранения: 30 дней</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Аналитические cookies</CardTitle>
                    <CardDescription>
                      Эти cookies помогают нам собирать статистические данные о посещаемости сайта.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-medium mb-1">_ga, _gid (Google Analytics)</h4>
                        <p className="text-sm text-gray-600">Используется для сбора статистических данных о посещаемости сайта.</p>
                        <p className="text-xs text-gray-500 mt-1">Срок хранения: 2 года, 24 часа</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-medium mb-1">_ym_uid, _ym_d (Yandex Metrika)</h4>
                        <p className="text-sm text-gray-600">Используется для идентификации пользователя и даты его первого посещения.</p>
                        <p className="text-xs text-gray-500 mt-1">Срок хранения: 1 год</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Маркетинговые cookies</CardTitle>
                    <CardDescription>
                      Эти cookies используются для показа релевантной рекламы и отслеживания ее эффективности.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-medium mb-1">_fbp (Facebook)</h4>
                        <p className="text-sm text-gray-600">Используется для отслеживания конверсий из рекламы Facebook.</p>
                        <p className="text-xs text-gray-500 mt-1">Срок хранения: 3 месяца</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-medium mb-1">IDE (Google DoubleClick)</h4>
                        <p className="text-sm text-gray-600">Используется для показа релевантной рекламы в сети Google.</p>
                        <p className="text-xs text-gray-500 mt-1">Срок хранения: 1 год</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Настройки cookies</h2>
              <p className="text-gray-600 mb-6">
                Вы можете настроить свои предпочтения по использованию cookies на нашем сайте. Обратите внимание, что отключение некоторых типов cookies может повлиять на функциональность сайта.
              </p>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6 pb-6 border-b">
                  <div>
                    <h3 className="font-medium">Все cookies</h3>
                    <p className="text-sm text-gray-600">Включить или отключить все опциональные cookies</p>
                  </div>
                  <div className="flex space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={() => handleToggleAll(false)}
                    >
                      Отклонить все
                    </Button>
                    <Button 
                      onClick={() => handleToggleAll(true)}
                      className="bg-store-purple hover:bg-store-purple-dark"
                    >
                      Принять все
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="necessary-cookies" className="font-medium">Необходимые cookies</Label>
                      <p className="text-sm text-gray-600">Требуются для работы сайта</p>
                    </div>
                    <Switch 
                      id="necessary-cookies" 
                      checked={cookiePreferences.necessary}
                      disabled
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="functional-cookies" className="font-medium">Функциональные cookies</Label>
                      <p className="text-sm text-gray-600">Улучшают работу сайта и персонализируют опыт</p>
                    </div>
                    <Switch 
                      id="functional-cookies" 
                      checked={cookiePreferences.functional}
                      onCheckedChange={(checked) => setCookiePreferences({...cookiePreferences, functional: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="analytics-cookies" className="font-medium">Аналитические cookies</Label>
                      <p className="text-sm text-gray-600">Помогают анализировать использование сайта</p>
                    </div>
                    <Switch 
                      id="analytics-cookies" 
                      checked={cookiePreferences.analytics}
                      onCheckedChange={(checked) => setCookiePreferences({...cookiePreferences, analytics: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-cookies" className="font-medium">Маркетинговые cookies</Label>
                      <p className="text-sm text-gray-600">Используются для показа релевантной рекламы</p>
                    </div>
                    <Switch 
                      id="marketing-cookies" 
                      checked={cookiePreferences.marketing}
                      onCheckedChange={(checked) => setCookiePreferences({...cookiePreferences, marketing: checked})}
                    />
                  </div>
                </div>
                
                <div className="pt-6 text-right">
                  <Button 
                    onClick={handleSavePreferences}
                    className="bg-store-purple hover:bg-store-purple-dark"
                  >
                    Сохранить настройки
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="h-5 w-5 text-store-purple" />
            <h3 className="text-lg font-semibold">Нужна помощь?</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Если у вас есть вопросы относительно использования cookies на нашем сайте или вам нужна дополнительная информация, наша команда поддержки всегда готова помочь.
          </p>
          <div className="flex items-center gap-2">
            <a href="/contact" className="text-store-purple hover:underline font-medium">Связаться с нами</a>
            <Separator orientation="vertical" className="h-4" />
            <a href="/faq" className="text-store-purple hover:underline font-medium">Частые вопросы</a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CookiesPage;
