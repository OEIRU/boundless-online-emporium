
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

const addressFormSchema = z.object({
  street: z.string().min(2, 'Улица должна быть не менее 2 символов'),
  city: z.string().min(2, 'Город должен быть не менее 2 символов'),
  state: z.string().min(2, 'Область должна быть не менее 2 символов'),
  zipCode: z.string().min(4, 'Почтовый индекс должен быть не менее 4 символов'),
  country: z.string().min(2, 'Страна должна быть не менее 2 символов'),
  isDefault: z.boolean().default(false),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;

interface AddressFormProps {
  defaultValues?: Partial<AddressFormValues>;
  onSubmit: (values: AddressFormValues) => Promise<void>;
  onCancel?: () => void;
  isEdit?: boolean;
}

const AddressForm = ({ 
  defaultValues, 
  onSubmit, 
  onCancel, 
  isEdit = false 
}: AddressFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      street: defaultValues?.street || '',
      city: defaultValues?.city || '',
      state: defaultValues?.state || '',
      zipCode: defaultValues?.zipCode || '',
      country: defaultValues?.country || 'Россия',
      isDefault: defaultValues?.isDefault || false,
    },
  });

  const handleSubmit = async (values: AddressFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      form.reset(); // Reset the form after successful submission if not editing
    } catch (error) {
      console.error('Ошибка сохранения адреса:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Улица и номер дома</FormLabel>
              <FormControl>
                <Input {...field} placeholder="ул. Пушкина, д. 10, кв. 5" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Город</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Москва" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Область/Регион</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Московская область" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Почтовый индекс</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="123456" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Страна</FormLabel>
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
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Адрес по умолчанию</FormLabel>
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
        
        <div className="flex justify-end space-x-4 pt-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Отмена
            </Button>
          )}
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? 'Обновление...' : 'Сохранение...'}
              </>
            ) : (
              isEdit ? 'Обновить адрес' : 'Добавить адрес'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddressForm;
