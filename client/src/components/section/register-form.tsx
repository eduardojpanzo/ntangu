import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/fecth";

const FormSchema = z
  .object({
    email: z.string({ message: "Por favor insira um email" }).email({
      message: "Por favor insira um email válido",
    }),
    password: z.string({ message: "Por favor insira uma senha" }).min(6, {
      message: "A senha deve ter pelo menos 6 caracteres",
    }),
    confirmPassword: z
      .string({ message: "Por favor insira uma senha" })
      .min(6, {
        message: "A senha deve ter pelo menos 6 caracteres",
      }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await api("/register", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      toast({
        title: "Resisto feito com sucesso",
        description: "faça o ínicio de sessão!",
      });
      navigate("/login");
    } catch {
      toast({
        title: "Algo deu errado",
        description: "Tente novamente!",
        variant: "destructive",
      });
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Insira seus dados para criar uma conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="eduardo@geral.com" {...field} />
                      </FormControl>
                      <FormDescription className="sr-only">
                        Informe o email de acesso
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Senha</FormLabel>

                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription className="sr-only">
                        Informe a senha de acesso
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Confirmar senha</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription className="sr-only">
                        Informe a senha de acesso
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={
                    !form.formState.isValid || form.formState.isSubmitting
                  }
                  className="w-full"
                >
                  Criar Conta
                </Button>
                {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
              </div>
              <div className="mt-4 text-center text-sm">
                Já tem uma Conta?
                <Link to="/login" className="underline underline-offset-4">
                  {" "}
                  Iniciar Sessão
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
