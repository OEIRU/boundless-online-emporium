
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { CheckCircle, Film, Twitter, Instagram, Facebook, GitHub } from 'lucide-react';
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
    <footer className="bg-gray-900 text-white py-10 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Навигация */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Навигация</h3>
            <ul className="space-y-2">
              <li><Link to="/movies" className="text-gray-300 hover:text-white transition-colors">Фильмы</Link></li>
              <li><Link to="/popular" className="text-gray-300 hover:text-white transition-colors">Популярное</Link></li>
              <li><Link to="/genres" className="text-gray-300 hover:text-white transition-colors">Жанры</Link></li>
              <li><Link to="/lists" className="text-gray-300 hover:text-white transition-colors">Списки</Link></li>
              <li><Link to="/calendar" className="text-gray-300 hover:text-white transition-colors">Календарь релизов</Link></li>
              <li><Link to="/search" className="text-gray-300 hover:text-white transition-colors">Поиск</Link></li>
            </ul>
          </div>
          
          {/* Сообщество */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">Сообщество</h3>
            <ul className="space-y-2">
              <li><Link to="/users" className="text-gray-300 hover:text-white transition-colors">Пользователи</Link></li>
              <li><Link to="/forums" className="text-gray-300 hover:text-white transition-colors">Форумы</Link></li>
              <li><Link to="/support" className="text-gray-300 hover:text-white transition-colors">Поддержка</Link></li>
              <li><Link to="/guidelines" className="text-gray-300 hover:text-white transition-colors">Правила</Link></li>
            </ul>
          </div>
          
          {/* О нас */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-400">О нас</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">О проекте</Link></li>
              <li><Link to="/api" className="text-gray-300 hover:text-white transition-colors">API</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Связаться с нами</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Конфиденциальность</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Условия использования</Link></li>
            </ul>
          </div>
          
          {/* Подписка */}
          <div>
            <div className="flex items-center mb-4">
              <Film className="w-6 h-6 text-purple-400 mr-2" />
              <h3 className="text-lg font-semibold text-purple-400">CinemaVerse</h3>
            </div>
            <p className="text-gray-300 mb-4">Отслеживайте просмотренные фильмы, создавайте списки и делитесь впечатлениями с друзьями.</p>
            
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
                    className="bg-gray-800 text-white px-4 py-2 rounded-md outline-none w-full focus:ring-1 focus:ring-purple-500"
                    required
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md transition-colors whitespace-nowrap disabled:opacity-70"
                  >
                    {isSubmitting ? 'Отправка...' : 'Подписаться'}
                  </button>
                </div>
              </form>
            )}
            
            {/* Социальные сети */}
            <div className="flex space-x-4 mt-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <GitHub className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} CinemaVerse. Все права защищены.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <Link to="/terms" className="hover:text-white transition-colors">Условия</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Конфиденциальность</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
