import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserCheck, Calendar, TrendingUp, Search, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  createdAt: string;
}

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  status: "active" | "inactive" | "pending";
  registrationDate: string;
}

interface AdminStats {
  totalUsers: number;
  totalClients: number;
  newClientsLast7Days: number;
  activeClients: number;
}

export default function AdminDashboard() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"users" | "clients">("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    document.title = "Админ-панель - ПенсионныйФонд.РФ";
  }, []);

  // Fetch admin statistics
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: () => apiRequest({ endpoint: "/api/admin/stats" }),
  });

  // Fetch users
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users", searchTerm],
    queryFn: () => apiRequest({ 
      endpoint: `/api/admin/users?search=${searchTerm}&limit=50` 
    }),
    enabled: activeTab === "users",
  });

  // Fetch clients
  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ["/api/admin/clients", searchTerm],
    queryFn: () => apiRequest({ 
      endpoint: `/api/clients?search=${searchTerm}&limit=50` 
    }),
    enabled: activeTab === "clients",
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: (data: { id: number; updates: Partial<User> }) =>
      apiRequest({
        endpoint: `/api/admin/users/${data.id}`,
        method: "PUT",
        data: data.updates,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Пользователь обновлен", description: "Данные пользователя успешно обновлены." });
      setEditingUser(null);
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Не удалось обновить пользователя.", variant: "destructive" });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest({
        endpoint: `/api/admin/users/${id}`,
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Пользователь удален", description: "Пользователь успешно удален." });
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Не удалось удалить пользователя.", variant: "destructive" });
    },
  });

  // Update client mutation
  const updateClientMutation = useMutation({
    mutationFn: (data: { id: number; updates: Partial<Client> }) =>
      apiRequest({
        endpoint: `/api/clients/${data.id}`,
        method: "PUT",
        data: data.updates,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      toast({ title: "Клиент обновлен", description: "Данные клиента успешно обновлены." });
      setEditingClient(null);
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Не удалось обновить клиента.", variant: "destructive" });
    },
  });

  // Delete client mutation
  const deleteClientMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest({
        endpoint: `/api/clients/${id}`,
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      toast({ title: "Клиент удален", description: "Клиент успешно удален." });
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Не удалось удалить клиента.", variant: "destructive" });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (editingUser) {
      const updatedUser = {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        isAdmin: editingUser.isAdmin
      };
      
      updateUserMutation.mutate(
        { id: editingUser.id, updates: updatedUser },
        {
          onSuccess: () => {
            setEditingUser(null);
            queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
            toast({
              title: "Успешно",
              description: "Данные пользователя обновлены",
              variant: "default",
            });
          },
          onError: (error) => {
            toast({
              title: "Ошибка",
              description: "Не удалось обновить данные пользователя",
              variant: "destructive",
            });
          }
        }
      );
    }
  };

  const handleDeleteUser = (userId: number) => {
    deleteUserMutation.mutate(userId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
        toast({
          title: "Успешно",
          description: "Пользователь удален",
          variant: "default",
        });
      },
      onError: (error) => {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить пользователя",
          variant: "destructive",
        });
      }
    });
  };

  const handleUpdateClient = (updates: Partial<Client>) => {
    if (editingClient) {
      updateClientMutation.mutate({ id: editingClient.id, updates });
    }
  };

  // Redirect if not admin (after all hooks)
  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Доступ запрещен</h1>
          <p className="text-slate-600">У вас нет прав администратора для доступа к этой странице.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Админ-панель</h1>
          <p className="text-slate-600">Управление пользователями и клиентами системы</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего клиентов</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClients}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Активных клиентов</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeClients}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("users")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                Пользователи
              </button>
              <button
                onClick={() => setActiveTab("clients")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "clients"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                Клиенты
              </button>
            </nav>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        {activeTab === "users" && (
          <Card>
            <CardHeader>
              <CardTitle>Пользователи</CardTitle>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div>Загрузка...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Имя</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Роль</TableHead>
                      <TableHead>Дата регистрации</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersData?.users?.map((user: User) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.isAdmin ? "default" : "secondary"}>
                            {user.isAdmin ? "Админ" : "Пользователь"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Редактировать пользователя</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="firstName">Имя</Label>
                                      <Input
                                        id="firstName"
                                        value={editingUser?.firstName || user.firstName}
                                        onChange={(e) => setEditingUser(prev => prev ? { ...prev, firstName: e.target.value } : { ...user, firstName: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="lastName">Фамилия</Label>
                                      <Input
                                        id="lastName"
                                        value={editingUser?.lastName || user.lastName}
                                        onChange={(e) => setEditingUser(prev => prev ? { ...prev, lastName: e.target.value } : { ...user, lastName: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                      id="email"
                                      type="email"
                                      value={editingUser?.email || user.email}
                                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : { ...user, email: e.target.value })}
                                    />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      id="isAdmin"
                                      checked={editingUser?.isAdmin ?? user.isAdmin}
                                      onCheckedChange={(checked) => setEditingUser(prev => prev ? { ...prev, isAdmin: checked } : { ...user, isAdmin: checked })}
                                    />
                                    <Label htmlFor="isAdmin">Права администратора</Label>
                                  </div>
                                  <Button 
                                    onClick={() => handleUpdateUser(editingUser || {})}
                                    disabled={updateUserMutation.isPending}
                                  >
                                    Сохранить
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" disabled={user.id === currentUser?.id}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Удалить пользователя</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Вы уверены, что хотите удалить пользователя {user.firstName} {user.lastName}? 
                                    Это действие нельзя отменить.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(user.id)}
                                    disabled={deleteUserMutation.isPending}
                                  >
                                    {deleteUserMutation.isPending ? "Удаление..." : "Удалить"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Clients Table */}
        {activeTab === "clients" && (
          <Card>
            <CardHeader>
              <CardTitle>Клиенты</CardTitle>
            </CardHeader>
            <CardContent>
              {clientsLoading ? (
                <div>Загрузка...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Имя</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Дата рождения</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Дата регистрации</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientsData?.clients?.map((client: Client) => (
                      <TableRow key={client.id}>
                        <TableCell>{client.id}</TableCell>
                        <TableCell>{client.firstName} {client.lastName}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{formatDate(client.birthDate)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            client.status === "active" ? "default" :
                            client.status === "pending" ? "secondary" : "destructive"
                          }>
                            {client.status === "active" ? "Активный" :
                             client.status === "pending" ? "Ожидает" : "Неактивный"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(client.registrationDate)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setEditingClient(client)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Редактировать клиента</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="clientFirstName">Имя</Label>
                                      <Input
                                        id="clientFirstName"
                                        defaultValue={client.firstName}
                                        onChange={(e) => setEditingClient({ ...client, firstName: e.target.value })}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="clientLastName">Фамилия</Label>
                                      <Input
                                        id="clientLastName"
                                        defaultValue={client.lastName}
                                        onChange={(e) => setEditingClient({ ...client, lastName: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="clientEmail">Email</Label>
                                    <Input
                                      id="clientEmail"
                                      type="email"
                                      defaultValue={client.email}
                                      onChange={(e) => setEditingClient({ ...client, email: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="clientStatus">Статус</Label>
                                    <Select
                                      value={editingClient?.status || client.status}
                                      onValueChange={(value) => setEditingClient({ ...client, status: value as any })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="active">Активный</SelectItem>
                                        <SelectItem value="pending">Ожидает</SelectItem>
                                        <SelectItem value="inactive">Неактивный</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Button 
                                    onClick={() => handleUpdateClient(editingClient || {})}
                                    disabled={updateClientMutation.isPending}
                                  >
                                    Сохранить
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Удалить клиента</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Вы уверены, что хотите удалить клиента {client.firstName} {client.lastName}? 
                                    Это действие нельзя отменить.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteClientMutation.mutate(client.id)}
                                    disabled={deleteClientMutation.isPending}
                                  >
                                    Удалить
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}