import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Eye, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fetchOrders = async () => {
  const mockOrders = [
    {
      orderId: 'ORD-1001',
      userId: 'user123',
      customerName: 'Иван Иванов',
      total: 12500,
      status: 'pending',
      paymentMethod: 'card',
      createdAt: '2023-06-10T10:30:00Z',
      items: [
        { id: 'prod1', title: 'Смартфон XYZ', quantity: 1, price: 10000 },
        { id: 'prod2', title: 'Чехол для смартфона', quantity: 1, price: 2500 },
      ]
    },
    {
      orderId: 'ORD-1002',
      userId: 'user456',
      customerName: 'Мария Петрова',
      total: 5400,
      status: 'processing',
      paymentMethod: 'card',
      createdAt: '2023-06-11T14:20:00Z',
      items: [
        { id: 'prod3', title: 'Наушники Bluetooth', quantity: 1, price: 5400 },
      ]
    },
    {
      orderId: 'ORD-1003',
      userId: 'user789',
      customerName: 'Алексей Сидоров',
      total: 18750,
      status: 'shipped',
      paymentMethod: 'cash',
      createdAt: '2023-06-12T09:15:00Z',
      items: [
        { id: 'prod4', title: 'Ноутбук', quantity: 1, price: 18750 },
      ]
    },
    {
      orderId: 'ORD-1004',
      userId: 'user101',
      customerName: 'Елена Смирнова',
      total: 3200,
      status: 'delivered',
      paymentMethod: 'card',
      createdAt: '2023-06-13T16:45:00Z',
      items: [
        { id: 'prod5', title: 'Клавиатура', quantity: 1, price: 2000 },
        { id: 'prod6', title: 'Мышь', quantity: 1, price: 1200 },
      ]
    },
    {
      orderId: 'ORD-1005',
      userId: 'user202',
      customerName: 'Дмитрий Козлов',
      total: 7500,
      status: 'cancelled',
      paymentMethod: 'card',
      createdAt: '2023-06-14T11:30:00Z',
      items: [
        { id: 'prod7', title: 'Монитор', quantity: 1, price: 7500 },
      ]
    }
  ];
  
  return { orders: mockOrders };
};

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

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return { label: 'Ожидает', variant: 'secondary' as const };
    case 'processing':
      return { label: 'Обработка', variant: 'secondary' as const };
    case 'shipped':
      return { label: 'Отправлен', variant: 'default' as const };
    case 'delivered':
      return { label: 'Доставлен', variant: 'default' as const };
    case 'cancelled':
      return { label: 'Отменен', variant: 'destructive' as const };
    default:
      return { label: status, variant: 'secondary' as const };
  }
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: fetchOrders
  });

  const orders = data?.orders || [];
  
  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Заказы</h2>
        <p className="text-muted-foreground">
          Управление заказами из вашего магазина
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список заказов</CardTitle>
          <CardDescription>
            Всего заказов: {orders.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4 space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по номеру заказа или имени клиента..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="pending">Ожидает</SelectItem>
                <SelectItem value="processing">Обработка</SelectItem>
                <SelectItem value="shipped">Отправлен</SelectItem>
                <SelectItem value="delivered">Доставлен</SelectItem>
                <SelectItem value="cancelled">Отменен</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-6">Загрузка...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">Ошибка при загрузке заказов</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>№ Заказа</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        Заказы не найдены
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order: any) => {
                      const statusBadge = getStatusBadge(order.status);
                      
                      return (
                        <TableRow key={order.orderId}>
                          <TableCell className="font-medium">
                            {order.orderId}
                          </TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>₽{order.total.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={statusBadge.variant}>
                              {statusBadge.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
