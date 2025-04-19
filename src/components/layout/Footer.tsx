
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setIsSubmitting(true);
    
    // Имитация отправки формы
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail('');
      toast({
        title: "Подписка оформлена",
        description: "Спасибо за подписку на нашу рассылку!",
      });
    }, 1000);
  };

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Магазин</h3>
            <ul className="space-y-2">
              <li><Link to="/category/women" className="text-gray-300 hover:text-white">Женщинам</Link></li>
              <li><Link to="/category/men" className="text-gray-300 hover:text-white">Мужчинам</Link></li>
              <li><Link to="/category/kids" className="text-gray-300 hover:text-white">Детям</Link></li>
              <li><Link to="/category/home" className="text-gray-300 hover:text-white">Дом</Link></li>
              <li><Link to="/category/electronics" className="text-gray-300 hover:text-white">Электроника</Link></li>
              <li><Link to="/category/beauty" className="text-gray-300 hover:text-white">Красота</Link></li>
              <li><Link to="/category/sports" className="text-gray-300 hover:text-white">Спорт</Link></li>
              <li><Link to="/category/shoes" className="text-gray-300 hover:text-white">Обувь</Link></li>
            </ul>
          </div>
          
          {/* Help Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Помощь</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Связаться с нами</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white">Частые вопросы</Link></li>
              <li><Link to="/help" className="text-gray-300 hover:text-white">Центр помощи</Link></li>
              <li><Link to="/faq#returns" className="text-gray-300 hover:text-white">Возврат</Link></li>
            </ul>
          </div>
          
          {/* About Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">О нас</h3>
            <ul className="space-y-2">
              <li><Link to="/about/history" className="text-gray-300 hover:text-white">Наша история</Link></li>
              <li><Link to="/about/careers" className="text-gray-300 hover:text-white">Вакансии</Link></li>
              <li><Link to="/about/press" className="text-gray-300 hover:text-white">Пресса</Link></li>
              <li><Link to="/about/sustainability" className="text-gray-300 hover:text-white">Устойчивое развитие</Link></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Будьте в курсе</h3>
            <p className="text-gray-300 mb-4">Подпишитесь на нашу рассылку для получения обновлений и предложений.</p>
            
            {isSubscribed ? (
              <div className="flex items-center text-green-400 mt-2">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Вы подписаны на рассылку!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ваш email" 
                    className="bg-gray-800 text-white px-4 py-2 rounded-md outline-none w-full"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-store-purple hover:bg-store-purple-dark px-4 py-2 rounded-md transition-colors whitespace-nowrap disabled:opacity-70"
                  >
                    {isSubmitting ? 'Отправка...' : 'Подписаться'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ВайлдСтор. Все права защищены.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <Link to="/terms" className="hover:text-white">Условия</Link>
            <Link to="/privacy" className="hover:text-white">Конфиденциальность</Link>
            <Link to="/cookies" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
