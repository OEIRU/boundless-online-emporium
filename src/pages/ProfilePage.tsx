import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  LogOut, 
  UserCircle, 
  ShoppingBag, 
  Heart, 
  Settings,
  Bell,
  Shield,
  Palette,
  MapPin,
  Image
} from 'lucide-react';

// Import profile components
import AccountSettingsForm from '@/components/profile/AccountSettingsForm';
import NotificationsForm from '@/components/profile/NotificationsForm';
import AddressList from '@/components/profile/AddressList';
import AvatarUpload from '@/components/profile/AvatarUpload';
import AppearanceSettings from '@/components/profile/AppearanceSettings';
import SecuritySettings from '@/components/profile/SecuritySettings';

const ProfilePage = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [activeSettingsTab, setActiveSettingsTab] = useState('account');

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <PageLayout showCategories={false}>
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-store-purple" />
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  // User metrics (fallback to zeros)
  const stats = user.stats || {};
  const moviesWatched = stats.moviesWatched || 0;
  const totalMinutes = stats.totalMinutesWatched || 0;
  const favorites = stats.favorites || 0;
  const listsCreated = stats.listsCreated || 0;
  const followers = stats.followers || 0;
  const following = stats.following || 0;

  return (
    <PageLayout showCategories={false}>
      <div className="container max-w-6xl py-10">
        {/* Карточка с приветствием, аватаром и метриками */}
        <Card className="mb-8 bg-gradient-to-tr from-white/60 to-purple-100/70 dark:from-gray-900/60 dark:to-purple-900/10 shadow-xl border-0">
          <CardContent className="flex flex-col md:flex-row items-center md:items-end justify-between py-8 md:py-8">
            <div className="flex gap-6 items-center">
              {/* Аватар пользователя */}
              <div className="relative">
                <div className="rounded-full bg-gradient-to-br from-purple-300 via-purple-400 to-purple-600 h-24 w-24 flex items-center justify-center shadow-xl overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <UserCircle className="w-16 h-16 text-white/60" />
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
                  Привет, {user.firstName}!
                </h2>
                <div className="text-gray-500 dark:text-gray-300 text-base">
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-auto mt-8 md:mt-0 flex gap-3 justify-between md:justify-end">
              <div className="flex flex-col items-center px-3">
                <span className="font-bold text-lg text-purple-600">{moviesWatched}</span>
                <span className="text-xs text-gray-500">Фильмы<br />просмотрено</span>
              </div>
              <div className="flex flex-col items-center px-3">
                <span className="font-bold text-lg text-purple-600">{listsCreated}</span>
                <span className="text-xs text-gray-500">Списков<br />создано</span>
              </div>
              <div className="flex flex-col items-center px-3">
                <span className="font-bold text-lg text-purple-600">{favorites}</span>
                <span className="text-xs text-gray-500">Любимых<br />фильмов</span>
              </div>
              <div className="flex flex-col items-center px-3">
                <span className="font-bold text-lg text-purple-600">{totalMinutes}</span>
                <span className="text-xs text-gray-500">Минут<br />просмотра</span>
              </div>
              <div className="flex flex-col items-center px-3">
                <span className="font-bold text-lg text-purple-600">{followers}</span>
                <span className="text-xs text-gray-500">Подписчиков</span>
              </div>
              <div className="flex flex-col items-center px-3">
                <span className="font-bold text-lg text-purple-600">{following}</span>
                <span className="text-xs text-gray-500">Подписок</span>
              </div>
            </div>
            <Button variant="outline" onClick={logout} className="flex items-center mt-8 md:mt-0 md:ml-8">
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full border-b pb-0 justify-start">
            <TabsTrigger value="profile" className="flex items-center">
              <UserCircle className="h-4 w-4 mr-2" />
              Мой профиль
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Мои заказы
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Избранное
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Фото профиля</CardTitle>
                  <CardDescription>
                    Вашу фотографию будут видеть другие пользователи
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AvatarUpload />
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Личная информация</CardTitle>
                  <CardDescription>
                    Обновите ваши персональные данные
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AccountSettingsForm />
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Адреса доставки</CardTitle>
                  <CardDescription>
                    Управляйте адресами доставки для ваших заказов
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AddressList />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>История заказов</CardTitle>
                <CardDescription>
                  Просмотрите все ваши предыдущие заказы
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-gray-500">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>У вас пока нет заказов</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle>Избранные товары</CardTitle>
                <CardDescription>
                  Просмотрите товары, добавленные в избранное
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-gray-500">
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>У вас пока нет товаров в избранном</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Настройки</h3>
                  <p className="text-sm text-gray-500">
                    Управляйте настройками аккаунта
                  </p>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-1">
                  <Button 
                    variant={activeSettingsTab === 'account' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveSettingsTab('account')}
                  >
                    <UserCircle className="h-4 w-4 mr-2" />
                    Аккаунт
                  </Button>
                  <Button 
                    variant={activeSettingsTab === 'security' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveSettingsTab('security')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Безопасность
                  </Button>
                  <Button 
                    variant={activeSettingsTab === 'notifications' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveSettingsTab('notifications')}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Уведомления
                  </Button>
                  <Button 
                    variant={activeSettingsTab === 'appearance' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveSettingsTab('appearance')}
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Внешний вид
                  </Button>
                  <Button 
                    variant={activeSettingsTab === 'addresses' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveSettingsTab('addresses')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Адреса
                  </Button>
                </div>
              </div>
              
              <div className="md:col-span-3">
                <Card>
                  {activeSettingsTab === 'account' && (
                    <>
                      <CardHeader>
                        <CardTitle>Настройки аккаунта</CardTitle>
                        <CardDescription>
                          Обновите ваши основные данные
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <AccountSettingsForm />
                      </CardContent>
                    </>
                  )}
                  
                  {activeSettingsTab === 'security' && (
                    <>
                      <CardHeader>
                        <CardTitle>Безопасность</CardTitle>
                        <CardDescription>
                          Обновите ваши пароль и настройки безопасности
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <SecuritySettings />
                      </CardContent>
                    </>
                  )}
                  
                  {activeSettingsTab === 'notifications' && (
                    <>
                      <CardHeader>
                        <CardTitle>Настройки уведомлений</CardTitle>
                        <CardDescription>
                          Выберите, какие уведомления вы хотите получать
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <NotificationsForm />
                      </CardContent>
                    </>
                  )}
                  
                  {activeSettingsTab === 'appearance' && (
                    <>
                      <CardHeader>
                        <CardTitle>Внешний вид</CardTitle>
                        <CardDescription>
                          Настройте внешний вид приложения
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <AppearanceSettings />
                      </CardContent>
                    </>
                  )}
                  
                  {activeSettingsTab === 'addresses' && (
                    <>
                      <CardHeader>
                        <CardTitle>Управление адресами</CardTitle>
                        <CardDescription>
                          Добавляйте и редактируйте ваши адреса доставки
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <AddressList />
                      </CardContent>
                    </>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
