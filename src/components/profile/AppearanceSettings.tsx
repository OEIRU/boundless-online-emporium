
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Loader2, Sun, Moon, Monitor } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const appearanceFormSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

const AppearanceSettings = () => {
  const { user, isLoading, updatePreferences } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: (user?.preferences?.theme as 'light' | 'dark' | 'system') || 'system',
    },
  });

  // Update form when user data loads or changes
  React.useEffect(() => {
    if (user?.preferences?.theme) {
      form.reset({
        theme: user.preferences.theme as 'light' | 'dark' | 'system',
      });
    }
  }, [user, form]);

  const onSubmit = async (values: AppearanceFormValues) => {
    try {
      setIsSubmitting(true);
      
      const currentNotifications = user?.preferences?.notifications || {
        email: true,
        sms: false,
        promotions: true,
        orderUpdates: true
      };
      
      await updatePreferences({
        notifications: currentNotifications,
        theme: values.theme
      });
    } catch (error) {
      console.error('Ошибка обновления внешнего вида:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Тема оформления</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="light" />
                    </FormControl>
                    <FormLabel className="font-normal flex items-center cursor-pointer">
                      <Sun className="h-4 w-4 mr-2" />
                      Светлая
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="dark" />
                    </FormControl>
                    <FormLabel className="font-normal flex items-center cursor-pointer">
                      <Moon className="h-4 w-4 mr-2" />
                      Темная
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="system" />
                    </FormControl>
                    <FormLabel className="font-normal flex items-center cursor-pointer">
                      <Monitor className="h-4 w-4 mr-2" />
                      Системная
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        
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

export default AppearanceSettings;
