import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useEffect } from "react";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Получаем заявки пользователя по email
  const { data: applications = [], refetch } = useQuery({
    queryKey: ["user-applications", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await apiRequest({
        endpoint: `/api/clients?search=${encodeURIComponent(user.email)}`,
        method: "GET",
      });
      return res.clients || [];
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    refetch();
  }, [user?.email, refetch]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Доступ запрещен</CardTitle>
            <CardDescription>Пожалуйста, войдите в систему для просмотра профиля</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Личный кабинет</CardTitle>
          <CardDescription>Ваша персональная информация</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-slate-500">Имя</h3>
              <p className="mt-1">{user.firstName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500">Фамилия</h3>
              <p className="mt-1">{user.lastName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500">Email</h3>
              <p className="mt-1">{user.email}</p>
            </div>
          </div>
          
          <div className="pt-4">
            <Button
              onClick={() => {
                toast({
                  title: "Функция в разработке",
                  description: "Редактирование профиля будет доступно в ближайшее время",
                });
              }}
            >
              Редактировать профиль
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Заявки пользователя */}
      <Card>
        <CardHeader>
          <CardTitle>Ваши заявки</CardTitle>
          <CardDescription>Статус подачи заявлений через форму обратной связи</CardDescription>
        </CardHeader>
        <CardContent>
          {applications && applications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Тема</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Сообщение</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Статус</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Дата подачи</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {applications.map((app: any) => (
                    <tr key={app.id}>
                      <td className="px-4 py-2">{app.subject || '-'}</td>
                      <td className="px-4 py-2">{app.message}</td>
                      <td className="px-4 py-2">
                        {app.status === 'pending' && <span className="text-yellow-600">В обработке</span>}
                        {app.status === 'active' && <span className="text-green-600">Принято</span>}
                        {app.status === 'inactive' && <span className="text-red-600">Отклонено</span>}
                      </td>
                      <td className="px-4 py-2">{app.registrationDate ? new Date(app.registrationDate).toLocaleString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-slate-500">У вас пока нет поданных заявлений.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 