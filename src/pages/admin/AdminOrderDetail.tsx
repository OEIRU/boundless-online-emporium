
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Clock, 
  CreditCard, 
  MapPin, 
  Package, 
  Printer,
  Truck, 
  User 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock function to fetch a single order
const fetchOrder = async (orderId: string) => {
  // In a real application, you'd make a real API call here
  const mockOrder = {
    orderId: 'ORD-1001',
    userId: 'user123',
    customerName: 'Иван Иванов',
    customerEmail: 'ivan@example.com',
    customerPhone: '+7 (999) 123-45-67',
    total: 12500,
    subtotal: 12500,
    shipping: 0,
    status: 'pending',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    createdAt: '2023-06-10T10:30:00Z',
    shippingAddress: {
      street: 'ул. Ленина, 123',
      city: 'Москва',
      state: 'Московская область',
      zipCode: '123456',
      country: 'Россия'
    },
    billingAddress: {
      street: 'ул. Ленина, 123',
      city: 'Москва',
      state: 'Московская область',
      zipCode: '123456',
      country: 'Россия'
    },
    items: [
      { 
        id: 'prod1', 
        title: 'Смартфон XYZ',
        image: '/placeholder.svg',
        quantity: 1, 
        price: 10000,
        total: 10000
      },
      { 
        id: 'prod2', 
        title: 'Чехол для смартфона',
        image: '/placeholder.svg',
        quantity: 1, 
        price: 2500,
        total: 2500
      },
    ],
    timeline: [
      { status: 'created', date: '2023-06-10T10:30:00Z', description: 'Заказ создан' },
      { status: 'payment', date: '2023-06-10T10:35:00Z', description: 'Оплата получена' },
    ]
  };
  
  return mockOrder;
};

// Mock function to update order status
const updateOrderStatus = async ({ orderId, status }: { orderId: string, status: string }) => {
  // In a real application, you'd make a real API call here
  return { success: true, status };
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Helper function to get badge variant based on status
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return { label: 'Ожидает', variant: 'secondary' as const };
    case 'processing':
      // Changed from warning to secondary
      return { label: 'Обработка', variant: 'secondary' as const };
    case 'shipped':
      // Changed from primary to default
      return { label: 'Отправлен', variant: 'default' as const };
    case 'delivered':
      // Changed from success to default
      return { label: 'Доставлен', variant: 'default' as const };
    case 'cancelled':
      return { label: 'Отменен', variant: 'destructive' as const };
    default:
      return { label: status, variant: 'secondary' as const };
  }
};

const AdminOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newStatus, setNewStatus] = useState<string>('');

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['adminOrder', id],
    queryFn: () => fetchOrder(id || ''),
    enabled: !!id
  });

  const statusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrder', id] });
      toast({
        title: "Статус обновлен",
        description: "Статус заказа был успешно обновлен",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить статус заказа",
      });
    }
  });

  const handleStatusChange = () => {
    if (!newStatus || !id) return;
    
    statusMutation.mutate({ orderId: id, status: newStatus });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate('/admin/orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Назад к заказам
        </Button>
        <div className="text-center py-6 text-red-500">
          Ошибка при загрузке заказа. Заказ не найден.
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(order.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/admin/orders')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Назад к заказам
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Детали заказа {order.orderId}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" /> Печать
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Информация о заказе</CardTitle>
            <CardDescription>
              Создан {formatDate(order.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div>
                <Badge variant={statusBadge.variant} className="text-sm">
                  {statusBadge.label}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-3">
                <Select 
                  value={newStatus || order.status} 
                  onValueChange={setNewStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Изменить статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Ожидает</SelectItem>
                    <SelectItem value="processing">Обработка</SelectItem>
                    <SelectItem value="shipped">Отправлен</SelectItem>
                    <SelectItem value="delivered">Доставлен</SelectItem>
                    <SelectItem value="cancelled">Отменен</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleStatusChange}
                  disabled={!newStatus || newStatus === order.status || statusMutation.isPending}
                >
                  Обновить
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Товар
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Цена
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Кол-во
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Сумма
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-md" 
                              src={item.image} 
                              alt={item.title} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₽{item.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        ₽{item.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                      Подытог:
                    </td>
                    <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      ₽{order.subtotal.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                      Доставка:
                    </td>
                    <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      ₽{order.shipping.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                      Общая сумма:
                    </td>
                    <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                      ₽{order.total.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-4 w-4" /> Информация о клиенте
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.customerName}</p>
                <p className="text-sm text-gray-500">{order.customerEmail}</p>
                <p className="text-sm text-gray-500">{order.customerPhone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" /> Адрес доставки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4" /> Информация об оплате
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Метод:</span>
                  <span className="font-medium">
                    {order.paymentMethod === 'card' ? 'Карта' : 'Наличные'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Статус:</span>
                  <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                    {order.paymentStatus === 'paid' ? 'Оплачено' : 'Ожидает'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-4 w-4" /> История заказа
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1" />
                      {index < order.timeline.length - 1 && (
                        <div className="h-full w-px bg-border" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{event.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
