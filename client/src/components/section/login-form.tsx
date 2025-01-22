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
import { api } from "@/lib/fecth";
import { createSession } from "@/utils/session";
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

interface LoginResponse {
  token: string;
}

const FormSchema = z.object({
  email: z.string({ message: "Por favor insira um email" }).email({
    message: "Por favor insira um email válido",
  }),
  password: z.string({ message: "Por favor insira uma senha" }).min(6, {
    message: "A senha deve ter pelo menos 6 caracteres",
  }),
});

export function LoginForm({
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
      const response = await api("/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const responseData: HttpResponseDataType<LoginResponse> =
        await response.json();

      await createSession(data.email, responseData.data.token);

      toast({
        title: "Login feito com sucesso",
        description: "Seja bem-vindo!",
      });

      navigate("/dashboard");
    } catch {
      toast({
        title: "Algo está incorrecto",
        description: "verifique as credências!",
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
            Insira seus dados para efetuar o login
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
                      <div className="flex items-center">
                        <FormLabel>Senha</FormLabel>
                        <a
                          target="_blank"
                          href="#"
                          className="sr-only ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Esqueceu a Senha?
                        </a>
                      </div>
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
                  Iniciar a sessão
                </Button>
                {/* <Button variant="outline" className="w-full">
                  Login with Google
                </Button> */}
              </div>
              <div className="mt-4 text-center text-sm">
                Não tem uma Conta?
                <Link to="/register" className="underline underline-offset-4">
                  {" "}
                  Registre-se
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
