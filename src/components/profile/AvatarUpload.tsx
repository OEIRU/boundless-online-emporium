
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserCircle, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const AvatarUpload = () => {
  const { user, updateAvatar } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar || null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Get initials for avatar fallback
  const getInitials = () => {
    if (user) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return 'U';
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Mock upload function (in a real app, you would upload to your server/storage)
    try {
      setIsUploading(true);
      
      // Create a base64 string from the file (this is just for demo purposes)
      // In a real app, you would upload to your server and get a URL back
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result as string;
        
        // Update the avatar URL in the context/backend
        await updateAvatar(base64String);
        setAvatarUrl(base64String);
        setIsUploading(false);
      };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setIsUploading(false);
    }
  };

  const handleAvatarDelete = async () => {
    try {
      setIsUploading(true);
      // Clear the avatar URL
      await updateAvatar('');
      setAvatarUrl(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error removing avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-32 w-32">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback className="text-2xl bg-store-purple text-white">
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          className="relative"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Загрузка...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              <span>Изменить фото</span>
            </>
          )}
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </Button>
        
        {avatarUrl && (
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="border-destructive text-destructive hover:bg-destructive/10"
                disabled={isUploading}
              >
                <X className="h-4 w-4 mr-2" />
                <span>Удалить</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить фото профиля?</AlertDialogTitle>
                <AlertDialogDescription>
                  Вы уверены, что хотите удалить ваше текущее фото профиля? Это действие нельзя отменить.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleAvatarDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Удалить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      
      <p className="text-center text-sm text-gray-500">
        Загрузите фото профиля в формате JPG, PNG или GIF.
      </p>
    </div>
  );
};

export default AvatarUpload;
