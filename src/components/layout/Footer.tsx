
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Магазин</h3>
            <ul className="space-y-2">
              <li><Link to="/category/women" className="text-gray-300 hover:text-white">Женщинам</Link></li>
              <li><Link to="/category/men" className="text-gray-300 hover:text-white">Мужчинам</Link></li>
              <li><Link to="/category/kids" className="text-gray-300 hover:text-white">Детям</Link></li>
              <li><Link to="/category/home" className="text-gray-300 hover:text-white">Дом</Link></li>
            </ul>
          </div>
          
          {/* Help Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Помощь</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Связаться с нами</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white">Частые вопросы</Link></li>
              <li><Link to="/shipping" className="text-gray-300 hover:text-white">Доставка</Link></li>
              <li><Link to="/returns" className="text-gray-300 hover:text-white">Возврат</Link></li>
            </ul>
          </div>
          
          {/* About Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">О нас</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white">Наша история</Link></li>
              <li><Link to="/careers" className="text-gray-300 hover:text-white">Вакансии</Link></li>
              <li><Link to="/press" className="text-gray-300 hover:text-white">Пресса</Link></li>
              <li><Link to="/sustainability" className="text-gray-300 hover:text-white">Устойчивое развитие</Link></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Будьте в курсе</h3>
            <p className="text-gray-300 mb-4">Подпишитесь на нашу рассылку для получения обновлений и предложений.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Ваш email" 
                className="bg-gray-800 text-white px-4 py-2 rounded-l outline-none flex-1"
              />
              <button 
                className="bg-store-purple hover:bg-store-purple-dark px-4 py-2 rounded-r transition-colors"
              >
                Подписаться
              </button>
            </div>
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
