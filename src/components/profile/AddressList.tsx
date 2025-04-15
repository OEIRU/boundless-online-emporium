
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, Home, Edit, Trash2 } from 'lucide-react';
import AddressForm, { AddressFormValues } from './AddressForm';
import { Badge } from '@/components/ui/badge';

const AddressList = () => {
  const { user, addAddress, updateAddress, deleteAddress } = useAuth();
  const [editingAddress, setEditingAddress] = useState<{id: string, data: AddressFormValues} | null>(null);
  const [isAddNewOpen, setIsAddNewOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const handleAddAddress = async (values: AddressFormValues) => {
    await addAddress(values);
    setIsAddNewOpen(false);
  };

  const handleUpdateAddress = async (values: AddressFormValues) => {
    if (editingAddress?.id) {
      await updateAddress(editingAddress.id, values);
      setEditingAddress(null);
    }
  };

  const handleDeleteAddress = async () => {
    if (addressToDelete) {
      await deleteAddress(addressToDelete);
      setAddressToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Мои адреса</h3>
        <Sheet open={isAddNewOpen} onOpenChange={setIsAddNewOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Добавить адрес</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Новый адрес</SheetTitle>
              <SheetDescription>
                Добавьте новый адрес доставки для ваших заказов.
              </SheetDescription>
            </SheetHeader>
            <div className="py-6">
              <AddressForm 
                onSubmit={handleAddAddress}
                onCancel={() => setIsAddNewOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {!user?.addresses || user.addresses.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <Home className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">У вас пока нет сохраненных адресов</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {user.addresses.map((address) => (
            <Card key={address._id}>
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{address.city}, {address.street}</span>
                      {address.isDefault && (
                        <Badge variant="outline" className="text-xs">По умолчанию</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {address.state}, {address.zipCode}, {address.country}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Sheet 
                      open={editingAddress?.id === address._id} 
                      onOpenChange={(open) => !open && setEditingAddress(null)}
                    >
                      <SheetTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setEditingAddress({
                            id: address._id || '',
                            data: {
                              street: address.street,
                              city: address.city,
                              state: address.state,
                              zipCode: address.zipCode,
                              country: address.country,
                              isDefault: address.isDefault
                            }
                          })}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Изменить адрес</SheetTitle>
                          <SheetDescription>
                            Измените детали вашего адреса доставки.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="py-6">
                          {editingAddress && (
                            <AddressForm 
                              defaultValues={editingAddress.data}
                              onSubmit={handleUpdateAddress}
                              onCancel={() => setEditingAddress(null)}
                              isEdit
                            />
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>

                    <AlertDialog
                      open={addressToDelete === address._id}
                      onOpenChange={(open) => !open && setAddressToDelete(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setAddressToDelete(address._id || '')}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Удалить адрес?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Вы уверены, что хотите удалить этот адрес? Это действие нельзя отменить.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDeleteAddress}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressList;
