
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Loader2, LogOut, User, Settings, Bell, Shield, Palette, MapPin } from 'lucide-react';

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

  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      <div className="w-full max-w-2xl mx-auto py-8">
        {/* Profile Summary */}
        <div className="flex flex-col items-center rounded-2xl bg-gradient-to-br from-purple-300/70 via-primary/40 to-white/70 mb-6 shadow-md p-6 gap-4">
          <div className="relative">
            <div className="rounded-full bg-gradient-to-br from-primary via-purple-400 to-white h-28 w-28 flex items-center justify-center shadow-lg overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Аватар"
                  className="object-cover h-full w-full"
                />
              ) : (
                <User className="w-16 h-16 text-white/60" />
              )}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold text-gray-900 mb-0.5">
              {user.firstName}
            </h2>
            <div className="text-gray-500 text-base mb-2">{user.email}</div>
          </div>
          <Button variant="secondary" onClick={logout} className="flex items-center gap-2 px-4 py-2 text-sm rounded-full">
            <LogOut className="h-4 w-4" />
            Выйти
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="flex gap-2 bg-primary/20 rounded-lg mb-4 shadow-md p-1">
            <TabsTrigger value="profile" className="flex items-center gap-1 px-3 py-2 text-sm">
              <User className="h-4 w-4" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 px-3 py-2 text-sm">
              <Settings className="h-4 w-4" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Фото профиля</CardTitle>
                </CardHeader>
                <CardContent>
                  <AvatarUpload />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Личная информация</CardTitle>
                </CardHeader>
                <CardContent>
                  <AccountSettingsForm />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Адреса доставки</CardTitle>
                </CardHeader>
                <CardContent>
                  <AddressList />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="flex flex-row gap-6">
              <div className="w-36 flex flex-col gap-2 bg-primary/10 rounded-lg shadow-inner p-2 shrink-0">
                <Button 
                  variant={activeSettingsTab === 'account' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start text-xs" 
                  onClick={() => setActiveSettingsTab('account')}>
                  <User className="h-4 w-4 mr-2" />
                  Аккаунт
                </Button>
                <Button 
                  variant={activeSettingsTab === 'security' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start text-xs" 
                  onClick={() => setActiveSettingsTab('security')}>
                  <Shield className="h-4 w-4 mr-2" />
                  Безопасность
                </Button>
                <Button 
                  variant={activeSettingsTab === 'notifications' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start text-xs" 
                  onClick={() => setActiveSettingsTab('notifications')}>
                  <Bell className="h-4 w-4 mr-2" />
                  Уведомления
                </Button>
                <Button 
                  variant={activeSettingsTab === 'appearance' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start text-xs" 
                  onClick={() => setActiveSettingsTab('appearance')}>
                  <Palette className="h-4 w-4 mr-2" />
                  Внешний вид
                </Button>
                <Button 
                  variant={activeSettingsTab === 'addresses' ? 'secondary' : 'ghost'} 
                  className="w-full justify-start text-xs" 
                  onClick={() => setActiveSettingsTab('addresses')}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Адреса
                </Button>
              </div>
              <div className="flex-1 grid">
                {activeSettingsTab === 'account' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Основные данные</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AccountSettingsForm />
                    </CardContent>
                  </Card>
                )}
                {activeSettingsTab === 'security' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Безопасность</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SecuritySettings />
                    </CardContent>
                  </Card>
                )}
                {activeSettingsTab === 'notifications' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Уведомления</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <NotificationsForm />
                    </CardContent>
                  </Card>
                )}
                {activeSettingsTab === 'appearance' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Внешний вид</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AppearanceSettings />
                    </CardContent>
                  </Card>
                )}
                {activeSettingsTab === 'addresses' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Адреса доставки</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AddressList />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
