
import { useState } from "react";
import { Search } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Данные FAQ
const faqData = {
  shipping: [
    {
      question: "Сколько времени займет доставка моего заказа?",
      answer: "Стандартная доставка обычно занимает 3-5 рабочих дней. Экспресс-доставка доступна за дополнительную плату и может быть выполнена в течение 1-2 рабочих дней. Международная доставка может занять 7-14 рабочих дней в зависимости от страны."
    },
    {
      question: "Могу ли я отслеживать свой заказ?",
      answer: "Да, после обработки вашего заказа вы получите электронное письмо с номером для отслеживания. Вы можете использовать этот номер на странице 'Отслеживание заказа' или в личном кабинете для проверки статуса доставки."
    },
    {
      question: "В какие регионы вы осуществляете доставку?",
      answer: "Мы доставляем товары по всей России. Для некоторых отдаленных регионов может потребоваться дополнительное время для доставки. Международная доставка доступна в большинство стран, но могут применяться ограничения."
    },
    {
      question: "Доставка бесплатная?",
      answer: "Мы предлагаем бесплатную доставку для заказов на сумму от 5000 рублей. Для заказов меньшей стоимости стоимость доставки составляет 499 рублей. Международная доставка и экспресс-доставка оплачиваются дополнительно."
    },
  ],
  returns: [
    {
      question: "Какова политика возврата?",
      answer: "Вы можете вернуть товар в течение 30 дней с момента получения. Товар должен быть в оригинальной упаковке и неиспользованным. Некоторые категории товаров, такие как нижнее белье и купальники, не подлежат возврату по гигиеническим причинам."
    },
    {
      question: "Как оформить возврат?",
      answer: "Чтобы оформить возврат, войдите в свой аккаунт, перейдите в раздел 'Мои заказы', выберите заказ и нажмите 'Вернуть товар'. Следуйте инструкциям для оформления возврата. Вы также можете связаться с нашей службой поддержки для помощи."
    },
    {
      question: "Сколько времени занимает обработка возврата?",
      answer: "После получения возвращенного товара нам требуется до 5 рабочих дней для проверки и обработки. После этого возврат средств будет произведен на исходный способ оплаты в течение 3-7 рабочих дней, в зависимости от вашего банка."
    },
    {
      question: "Кто оплачивает доставку при возврате?",
      answer: "Если вы возвращаете товар из-за нашей ошибки (например, был отправлен не тот товар или товар с дефектом), мы оплатим стоимость обратной доставки. В других случаях стоимость возврата оплачивается покупателем."
    },
  ],
  payment: [
    {
      question: "Какие способы оплаты вы принимаете?",
      answer: "Мы принимаем оплату кредитными/дебетовыми картами (Visa, MasterCard, МИР), через электронные кошельки (QIWI, Юмани), банковским переводом, с помощью системы быстрых платежей (СБП) и наличными при получении (только для доставки курьером)."
    },
    {
      question: "Безопасно ли оплачивать покупки на вашем сайте?",
      answer: "Да, наш сайт использует шифрование SSL для защиты ваших данных. Мы не храним полные данные ваших банковских карт. Все платежи обрабатываются через защищенные платежные шлюзы, соответствующие стандартам PCI DSS."
    },
    {
      question: "Когда происходит списание средств при оплате заказа?",
      answer: "При оплате картой средства списываются сразу после подтверждения заказа. При оплате наличными или через СБП оплата происходит в момент получения заказа."
    },
    {
      question: "Выдаете ли вы чеки при оплате?",
      answer: "Да, мы отправляем электронные чеки на указанный вами email адрес. При доставке курьером и оплате наличными вы получите бумажный чек. Вы также можете найти все чеки в вашем личном кабинете."
    },
  ],
  products: [
    {
      question: "Как определить свой размер?",
      answer: "На странице каждого товара есть таблица размеров с подробными измерениями. Вы можете использовать эту таблицу, чтобы сравнить ваши мерки с размерами нашей одежды и выбрать подходящий размер. Если у вас есть сомнения, выбирайте больший размер или свяжитесь с нашей службой поддержки."
    },
    {
      question: "Соответствуют ли цвета товаров на фотографиях их реальному виду?",
      answer: "Мы стараемся максимально точно передать цвета товаров на фотографиях, но из-за разных настроек мониторов и экранов может наблюдаться небольшая разница между фотографией и реальным товаром."
    },
    {
      question: "Из каких материалов изготовлена ваша одежда?",
      answer: "Информация о материалах указана на странице каждого товара в разделе 'Спецификации'. Мы используем различные материалы, включая хлопок, полиэстер, вискозу, лен и их смеси, в зависимости от типа одежды."
    },
    {
      question: "Как ухаживать за купленной у вас одеждой?",
      answer: "Инструкции по уходу указаны на этикетке каждого товара и на странице товара в разделе 'Уход'. Обычно мы рекомендуем стирку при низких температурах, использование мягких моющих средств и сушку в расправленном виде для сохранения формы и цвета одежды."
    },
  ],
  account: [
    {
      question: "Как создать аккаунт?",
      answer: "Чтобы создать аккаунт, нажмите на значок пользователя в верхнем правом углу и выберите 'Регистрация'. Заполните форму с вашими данными, создайте пароль и подтвердите регистрацию по ссылке, которую мы отправим на ваш email."
    },
    {
      question: "Что делать, если я забыл пароль?",
      answer: "Если вы забыли пароль, нажмите на ссылку 'Забыли пароль?' на странице входа. Введите email, связанный с вашим аккаунтом, и мы отправим вам инструкции по сбросу пароля."
    },
    {
      question: "Как изменить личную информацию в моем аккаунте?",
      answer: "Войдите в свой аккаунт, перейдите в раздел 'Профиль' и нажмите 'Редактировать'. Здесь вы можете изменить ваше имя, адрес доставки, контактную информацию и другие данные. Не забудьте сохранить изменения."
    },
    {
      question: "Можно ли удалить мой аккаунт?",
      answer: "Да, вы можете удалить свой аккаунт. Для этого войдите в аккаунт, перейдите в раздел 'Настройки', прокрутите вниз до секции 'Удаление аккаунта' и следуйте инструкциям. Обратите внимание, что это действие необратимо и приведет к удалению всей информации о ваших заказах и личных данных."
    },
  ],
};

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("shipping");

  // Функция фильтрации вопросов по поисковому запросу
  const filterFAQs = (faqs: Array<{ question: string; answer: string }>) => {
    if (!searchQuery.trim()) return faqs;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    return faqs.filter(
      faq => 
        faq.question.toLowerCase().includes(lowerCaseQuery) ||
        faq.answer.toLowerCase().includes(lowerCaseQuery)
    );
  };

  // Получаем отфильтрованные вопросы для активной категории
  const filteredFAQs = filterFAQs(faqData[activeTab as keyof typeof faqData]);

  return (
    <PageLayout showCategories={false}>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Частые вопросы</h1>
        <p className="text-gray-600 text-center mb-8">
          Найдите ответы на ваши вопросы о нашем магазине, товарах и услугах
        </p>

        {/* Поиск */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Поиск по частым вопросам..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Категории FAQ */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 overflow-x-auto flex mb-6">
            <TabsTrigger 
              value="shipping" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-store-purple data-[state=active]:bg-transparent py-3"
            >
              Доставка
            </TabsTrigger>
            <TabsTrigger 
              value="returns" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-store-purple data-[state=active]:bg-transparent py-3"
            >
              Возвраты
            </TabsTrigger>
            <TabsTrigger 
              value="payment" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-store-purple data-[state=active]:bg-transparent py-3"
            >
              Оплата
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-store-purple data-[state=active]:bg-transparent py-3"
            >
              Товары
            </TabsTrigger>
            <TabsTrigger 
              value="account" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-store-purple data-[state=active]:bg-transparent py-3"
            >
              Аккаунт
            </TabsTrigger>
          </TabsList>

          {/* Динамический контент для каждой категории */}
          {Object.keys(faqData).map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <Accordion type="single" collapsible className="w-full">
                {filterFAQs(faqData[category as keyof typeof faqData]).length > 0 ? (
                  filterFAQs(faqData[category as keyof typeof faqData]).map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left hover:no-underline hover:text-store-purple">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-6">
                    По вашему запросу ничего не найдено. Попробуйте изменить поисковый запрос.
                  </p>
                )}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>

        {/* Дополнительная информация */}
        <div className="mt-12 bg-gray-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-3">Не нашли ответ на свой вопрос?</h2>
          <p className="text-gray-600 mb-4">
            Свяжитесь с нашей командой поддержки, и мы с радостью поможем вам.
          </p>
          <div className="flex justify-center">
            <a 
              href="/contact" 
              className="inline-flex items-center bg-store-purple hover:bg-store-purple-dark text-white px-4 py-2 rounded"
            >
              Связаться с нами
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default FAQPage;
