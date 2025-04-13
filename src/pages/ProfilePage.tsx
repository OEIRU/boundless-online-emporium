
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { Loader2, LogOut, UserCircle, ShoppingBag, Heart } from 'lucide-react';

const profileFormSchema = z.object({
  firstName: z.string().min(2, 'Имя должно быть не менее 2 символов'),
  lastName: z.string().min(2, 'Фамилия должна быть не менее 2 символов'),
  email: z.string().email('Введите корректный email'),
  phoneNumber: z.string().optional(),
});

const ProfilePage = () => {
  const { user, isLoading, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: '',
    },
  });

  // Update form when user data loads
  React.useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: '',
      });
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      setIsSubmitting(true);
      await updateProfile(values);
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <PageLayout showCategories={false}>
      <div className="container max-w-4xl py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Личный кабинет</h1>
          <Button variant="outline" onClick={logout} className="flex items-center">
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
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
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Личная информация</CardTitle>
                <CardDescription>
                  Обновите вашу личную информацию здесь.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Имя</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Фамилия</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Телефон (необязательно)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="bg-store-purple hover:bg-store-purple-dark"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        'Сохранить изменения'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>История заказов</CardTitle>
                <CardDescription>
                  Просмотрите все ваши предыдущие заказы.
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
                  Просмотрите товары, добавленные в избранное.
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
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
