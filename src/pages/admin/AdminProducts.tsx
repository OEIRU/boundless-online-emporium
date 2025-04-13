
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Edit, Plus, Search, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ProductFormDialog from "@/components/admin/ProductFormDialog";
import { useToast } from "@/components/ui/use-toast";

// Mock function to fetch products
const fetchProducts = async () => {
  const response = await fetch('/api/products?limit=100');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

// Mock function to delete a product
const deleteProduct = async (id: string) => {
  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
  
  return response.json();
};

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productsToDelete, setProductsToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: fetchProducts
  });

  const products = data?.products || [];
  
  const filteredProducts = products.filter((product: any) => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (productId: string) => {
    setProductsToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  const handleEditClick = (product: any) => {
    setSelectedProduct(product);
    setIsFormDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productsToDelete) return;
    
    try {
      await deleteProduct(productsToDelete);
      toast({
        title: "Товар удален",
        description: "Товар был успешно удален",
      });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось удалить товар",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setProductsToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Товары</h2>
          <p className="text-muted-foreground">
            Управление товарами в вашем магазине
          </p>
        </div>
        <Button onClick={() => {
          setSelectedProduct(null);
          setIsFormDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Создать товар
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список товаров</CardTitle>
          <CardDescription>
            Всего товаров: {products.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4 space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск товаров..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="clothing">Одежда</SelectItem>
                <SelectItem value="electronics">Электроника</SelectItem>
                <SelectItem value="furniture">Мебель</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-6">Загрузка...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">Ошибка при загрузке товаров</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Остаток</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        Товары не найдены
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product: any) => (
                      <TableRow key={product._id}>
                        <TableCell className="font-medium">
                          {product.title}
                        </TableCell>
                        <TableCell>
                          {product.category?.name || 'Без категории'}
                        </TableCell>
                        <TableCell>₽{product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditClick(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteClick(product._id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтвердите удаление</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот товар? Это действие невозможно отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Form Dialog */}
      <ProductFormDialog 
        open={isFormDialogOpen} 
        onOpenChange={setIsFormDialogOpen}
        product={selectedProduct}
        onSuccess={() => {
          refetch();
          setIsFormDialogOpen(false);
        }}
      />
    </div>
  );
};

export default AdminProducts;
