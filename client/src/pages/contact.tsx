import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { contactSchema, type ContactRequest } from "@shared/schema";

export default function Contact() {
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Контакты - ПенсионныйФонд.РФ";
  }, []);

  const form = useForm<ContactRequest>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const handleSubmit = async (data: ContactRequest) => {
    try {
      await apiRequest({
        endpoint: "/api/contact",
        method: "POST",
        data
      });
      toast({
        title: "Успешно",
        description: "Сообщение отправлено успешно",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при отправке сообщения",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Контакты</h1>
          <p className="text-xl text-slate-600">Свяжитесь с нами удобным способом</p>
        </div>
        
        <div className="lg:grid lg:grid-cols-3 lg:gap-16">
          {/* Contact Information */}
          <div className="lg:col-span-1 mb-12 lg:mb-0">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Адрес</h3>
                  <p className="text-slate-600">
                    ул. Тверская, 15<br />
                    Москва, 125009<br />
                    Российская Федерация
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Телефон</h3>
                  <p className="text-slate-600">
                    +7 (495) 123-45-67<br />
                    8-800-555-01-23 (бесплатно)
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
                  <p className="text-slate-600">
                    info@pensionfund.ru<br />
                    support@pensionfund.ru
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Часы работы</h3>
                  <p className="text-slate-600">
                    Пн-Пт: 9:00-18:00<br />
                    Сб: 10:00-15:00<br />
                    Вс: выходной
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Отправить сообщение</h2>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">Имя *</Label>
                    <Input
                      id="firstName"
                      placeholder="Введите ваше имя"
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
                    <Label htmlFor="lastName">Фамилия *</Label>
                    <Input
                      id="lastName"
                      placeholder="Введите вашу фамилию"
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
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
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
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    {...form.register("phone")}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject">Тема</Label>
                  <Select onValueChange={(value) => form.setValue("subject", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Выберите тему" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Общий вопрос</SelectItem>
                      <SelectItem value="technical">Техническая поддержка</SelectItem>
                      <SelectItem value="pension">Вопрос по пенсии</SelectItem>
                      <SelectItem value="complaint">Жалоба</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="message">Сообщение *</Label>
                  <Textarea
                    id="message"
                    placeholder="Опишите ваш вопрос подробно..."
                    rows={5}
                    {...form.register("message")}
                    className="mt-1"
                  />
                  {form.formState.errors.message && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="agreement" required />
                  <Label htmlFor="agreement" className="text-sm">
                    Согласен с{" "}
                    <a href="#" className="text-primary hover:underline">
                      политикой обработки персональных данных
                    </a>
                  </Label>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Отправка..." : "Отправить сообщение"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
