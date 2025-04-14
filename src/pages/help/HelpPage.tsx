
import { HelpCircle, Mail, MessagesSquare } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const HelpPage = () => {
  return (
    <PageLayout showCategories={false}>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Центр помощи</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/faq">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-store-purple" />
                  Частые вопросы
                </CardTitle>
                <CardDescription>Ответы на популярные вопросы о наших товарах и услугах</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Найдите ответы на популярные вопросы о доставке, возврате, оплате и других аспектах работы нашего магазина.
                </p>
                <div className="flex justify-end mt-4">
                  <span className="text-store-purple font-medium">Подробнее &rarr;</span>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/contact">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-store-purple" />
                  Связаться с нами
                </CardTitle>
                <CardDescription>Свяжитесь с нашей службой поддержки</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Не нашли ответ на свой вопрос? Свяжитесь с нашей командой поддержки, и мы поможем вам в кратчайшие сроки.
                </p>
                <div className="flex justify-end mt-4">
                  <span className="text-store-purple font-medium">Подробнее &rarr;</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start gap-4 mb-4">
            <MessagesSquare className="h-6 w-6 text-store-purple mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Часы работы поддержки</h2>
              <p className="text-gray-600">
                Наша служба поддержки работает с 9:00 до 21:00 по московскому времени, 7 дней в неделю.
                Мы стремимся отвечать на все запросы в течение 24 часов.
              </p>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p className="text-center">
              Для срочных вопросов, пожалуйста, позвоните по номеру: 
              <a href="tel:+78001234567" className="text-store-purple ml-1 font-medium">8 (800) 123-45-67</a>
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HelpPage;
