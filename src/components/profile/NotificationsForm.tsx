
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

const notificationsFormSchema = z.object({
  email: z.boolean().default(true),
  sms: z.boolean().default(false),
  promotions: z.boolean().default(true),
  orderUpdates: z.boolean().default(true),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

const NotificationsForm = () => {
  const { user, isLoading, updatePreferences } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: NotificationsFormValues = {
    email: user?.preferences?.notifications?.email ?? true,
    sms: user?.preferences?.notifications?.sms ?? false,
    promotions: user?.preferences?.notifications?.promotions ?? true,
    orderUpdates: user?.preferences?.notifications?.orderUpdates ?? true,
  };

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  });

  // Update form when user data loads or changes
  React.useEffect(() => {
    if (user?.preferences?.notifications) {
      form.reset({
        email: user.preferences.notifications.email,
        sms: user.preferences.notifications.sms,
        promotions: user.preferences.notifications.promotions,
        orderUpdates: user.preferences.notifications.orderUpdates,
      });
    }
  }, [user, form]);

  const onSubmit = async (values: NotificationsFormValues) => {
    try {
      setIsSubmitting(true);
      
      const currentTheme = user?.preferences?.theme || 'system';
      await updatePreferences({
        notifications: values,
        theme: currentTheme
      });
    } catch (error) {
      console.error('Ошибка обновления настроек уведомлений:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Email уведомления</FormLabel>
                  <FormDescription>
                    Получать уведомления по электронной почте
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">SMS уведомления</FormLabel>
                  <FormDescription>
                    Получать текстовые уведомления на ваш телефон
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="promotions"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Акции и скидки</FormLabel>
                  <FormDescription>
                    Получать информацию о специальных предложениях
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="orderUpdates"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Обновления заказов</FormLabel>
                  <FormDescription>
                    Получать обновления о статусе ваших заказов
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Сохранение...
            </>
          ) : (
            'Сохранить настройки'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default NotificationsForm;
