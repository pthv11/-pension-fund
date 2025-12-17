import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, RotateCcw, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { authManager } from "@/lib/auth";
import { insertClientSchema, type Client, type InsertClient } from "@shared/schema";

export default function Clients() {
  const { isAdmin, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const limit = 10;

  useEffect(() => {
    document.title = "Управление клиентами - ПенсионныйФонд.РФ";
  }, []);

  // Debug logging
  useEffect(() => {
    console.log("Auth state:", { isAdmin, user });
  }, [isAdmin, user]);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      window.location.href = "/";
    }
  }, [isAdmin]);

  const form = useForm<InsertClient>({
    resolver: zodResolver(insertClientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      birthDate: "",
      status: "pending",
    },
  });

  // Fetch clients
  const { data: clientsData, isLoading, error } = useQuery({
    queryKey: ["/api/clients", { search, status, page, limit }],
    queryFn: async () => {
      console.log("Auth state when fetching:", { isAdmin, isAuthenticated: authManager.getState().isAuthenticated });
      console.log("Fetching clients with headers:", authManager.getAuthHeaders());
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(status && { status }),
      });
      
      try {
        const response = await fetch(`/api/clients?${params}`, {
          headers: authManager.getAuthHeaders(),
        });
        
        console.log("Clients API response:", {
          status: response.status,
          statusText: response.statusText,
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Clients API error:", errorText);
          throw new Error(errorText || "Failed to fetch clients");
        }
        
        const data = await response.json();
        console.log("Clients data:", data);
        return data;
      } catch (error) {
        console.error("Error fetching clients:", error);
        throw error;
      }
    },
    enabled: isAdmin && authManager.getState().isAuthenticated,
  });

  // Create client mutation
  const createClientMutation = useMutation({
    mutationFn: async (data: InsertClient) => {
      const response = await apiRequest({
        endpoint: "/api/clients",
        method: "POST",
        data
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Успешно",
        description: "Клиент успешно создан",
      });
      setIsAddModalOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка",
        variant: "destructive",
      });
    },
  });

  // Delete client mutation
  const deleteClientMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest({
        endpoint: `/api/clients/${id}`,
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast({
        title: "Успешно",
        description: "Клиент успешно удален",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertClient) => {
    createClientMutation.mutate(data);
  };

  const handleDelete = (id: number) => {
    if (confirm("Вы уверены, что хотите удалить этого клиента?")) {
      deleteClientMutation.mutate(id);
    }
  };

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setPage(1);
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setIsViewModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Активный</Badge>;
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Неактивный</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Ожидает</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("ru-RU");
  };

  if (!isAdmin) {
    return null;
  }

  if (error) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Ошибка загрузки данных</h1>
            <p className="text-slate-600">{error instanceof Error ? error.message : "Неизвестная ошибка"}</p>
            <Button 
              className="mt-4"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/clients"] })}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Повторить загрузку
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Управление клиентами</h1>
              <p className="text-slate-600">Администрирование клиентской базы пенсионного фонда</p>
            </div>
            <div className="mt-4 lg:mt-0">
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2" size={16} />
                    Добавить клиента
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Добавить нового клиента</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Имя</Label>
                        <Input
                          id="firstName"
                          {...form.register("firstName")}
                          className="mt-1"
                        />
                        {form.formState.errors.firstName && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Фамилия</Label>
                        <Input
                          id="lastName"
                          {...form.register("lastName")}
                          className="mt-1"
                        />
                        {form.formState.errors.lastName && (
                          <p className="text-sm text-red-600 mt-1">
                            {form.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        className="mt-1"
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="birthDate">Дата рождения</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...form.register("birthDate")}
                        className="mt-1"
                      />
                      {form.formState.errors.birthDate && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.birthDate.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="status">Статус</Label>
                      <Select onValueChange={(value) => form.setValue("status", value as any)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Выберите статус" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Активный</SelectItem>
                          <SelectItem value="inactive">Неактивный</SelectItem>
                          <SelectItem value="pending">Ожидает подтверждения</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createClientMutation.isPending}
                    >
                      {createClientMutation.isPending ? "Создание..." : "Создать клиента"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid lg:grid-cols-4 gap-4">
            <div>
              <Label>Поиск</Label>
              <div className="relative mt-1">
                <Input
                  placeholder="Поиск по имени, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-3 text-slate-400" size={16} />
              </div>
            </div>
            <div>
              <Label>Статус</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="active">Активный</SelectItem>
                  <SelectItem value="inactive">Неактивный</SelectItem>
                  <SelectItem value="pending">Ожидает подтверждения</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="lg:col-span-2 flex items-end">
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full"
              >
                <RotateCcw className="mr-2" size={16} />
                Сбросить
              </Button>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Список клиентов</h2>
              {clientsData && (
                <div className="text-sm text-slate-500">
                  Всего: {clientsData.total} клиентов
                </div>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Дата рождения</TableHead>
                  <TableHead>Регистрация</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Сообщение</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div>
                            <Skeleton className="w-32 h-4 mb-1" />
                            <Skeleton className="w-20 h-3" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="w-40 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-24 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-24 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-20 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-40 h-4" /></TableCell>
                      <TableCell><Skeleton className="w-24 h-4" /></TableCell>
                    </TableRow>
                  ))
                ) : clientsData?.clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      Клиенты не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  clientsData?.clients.map((client: Client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-medium text-sm">
                              {client.firstName[0]}{client.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {client.firstName} {client.lastName}
                            </div>
                            <div className="text-sm text-slate-500">
                              ID: {client.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-900">{client.email}</TableCell>
                      <TableCell className="text-slate-900">
                        {formatDate(client.birthDate)}
                      </TableCell>
                      <TableCell className="text-slate-900">
                        {formatDate(client.registrationDate)}
                      </TableCell>
                      <TableCell>{getStatusBadge(client.status)}</TableCell>
                      <TableCell>
                        {client.message ? (
                          <div className="max-w-xs overflow-hidden text-ellipsis">
                            {client.message}
                          </div>
                        ) : (
                          <span className="text-slate-400">Нет сообщения</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewClient(client)}
                            className="text-primary hover:text-primary/80"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-600 hover:text-slate-800"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(client.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {clientsData && clientsData.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Показано {((page - 1) * limit) + 1}-{Math.min(page * limit, clientsData.total)} из {clientsData.total}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  
                  {Array.from({ length: Math.min(5, clientsData.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className={page === pageNum ? "bg-primary" : ""}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(page + 1)}
                    disabled={page === clientsData.totalPages}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Client Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Информация о клиенте</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Имя</Label>
                  <p className="text-slate-900 font-medium">{selectedClient.firstName}</p>
                </div>
                <div>
                  <Label>Фамилия</Label>
                  <p className="text-slate-900 font-medium">{selectedClient.lastName}</p>
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-slate-900 font-medium">{selectedClient.email}</p>
              </div>
              <div>
                <Label>Дата рождения</Label>
                <p className="text-slate-900 font-medium">{formatDate(selectedClient.birthDate)}</p>
              </div>
              <div>
                <Label>Статус</Label>
                <div className="mt-1">{getStatusBadge(selectedClient.status)}</div>
              </div>
              <div>
                <Label>Дата регистрации</Label>
                <p className="text-slate-900 font-medium">{formatDate(selectedClient.registrationDate)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
