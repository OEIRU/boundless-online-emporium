
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// Schema for product form
const productSchema = z.object({
  title: z.string().min(3, "Название должно быть не менее 3 символов"),
  description: z.string().min(10, "Описание должно быть не менее 10 символов"),
  price: z.coerce.number().min(0, "Цена должна быть положительным числом"),
  originalPrice: z.coerce.number().min(0).optional(),
  category: z.string().min(1, "Выберите категорию"),
  stock: z.coerce.number().int().min(0, "Количество должно быть не отрицательным числом"),
  features: z.string().optional(),
  images: z.string().optional(),
});

// Type for form values
type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
  onSuccess: () => void;
}

// Mock function to fetch categories
const fetchCategories = async () => {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

const ProductFormDialog = ({ 
  open, 
  onOpenChange, 
  product,
  onSuccess
}: ProductFormDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const categories = categoriesData?.categories || [];

  // Initialize form with existing product data or defaults
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      title: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      category: product.category?._id || '',
      stock: product.stock,
      features: product.features?.join(", ") || "",
      images: product.images?.join(", ") || "",
    } : {
      title: "",
      description: "",
      price: 0,
      originalPrice: 0,
      category: "",
      stock: 0,
      features: "",
      images: "",
    }
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Transform data
      const productData = {
        ...values,
        features: values.features ? values.features.split(",").map(f => f.trim()) : [],
        images: values.images ? values.images.split(",").map(img => img.trim()) : [],
      };
      
      // Determine if we're creating or updating
      const isUpdate = !!product;
      const url = isUpdate ? `/api/products/${product._id}` : '/api/products';
      const method = isUpdate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save product');
      }
      
      toast({
        title: isUpdate ? "Товар обновлен" : "Товар создан",
        description: isUpdate 
          ? "Товар был успешно обновлен" 
          : "Новый товар был успешно создан",
      });
      
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сохранить товар",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {product ? "Редактировать товар" : "Создать новый товар"}
          </DialogTitle>
          <DialogDescription>
            Заполните форму, чтобы {product ? "обновить" : "создать"} товар.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Название товара" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Описание товара" rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Изначальная цена (опционально)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category: any) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Характеристики (через запятую)</FormLabel>
                  <FormControl>
                    <Input placeholder="Характеристика 1, Характеристика 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL изображений (через запятую)</FormLabel>
                  <FormControl>
                    <Input placeholder="URL1, URL2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  product ? "Обновить" : "Создать"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
