"use client";

import { InputWithControl } from "@/components/form/input-control";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useDialog } from "@/contexts/dialog-context";
import { api, gettingData } from "@/lib/fecth";
import { CategoryModel } from "@/models/category.model";
import { queryClient } from "@/lib/query";

const formSchema = z.object({
  name: z.string({ message: "Por favor insira o nome" }).min(4, {
    message: "O nome deve ter pelo menos 4 caracteres",
  }),
});

type FormShemaType = z.infer<typeof formSchema>;

export function FormCategory({ id }: { id?: number }) {
  const { close, form, onSubmit } = useFromAction(id);

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {id ? "Editar Categoria" : "Criar uma nova Categoria"}
        </DialogTitle>
        <DialogDescription>Defina os dados da Categoria</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id="formCategoria">
          <InputWithControl label="Nome" control={form.control} name="name" />
        </form>
      </Form>
      <DialogFooter>
        <Button
          variant={"ghost"}
          onClick={() => {
            close();
          }}
        >
          Cancelar
        </Button>
        <Button
          disabled={
            !form.formState.isValid ||
            !form.formState.isDirty ||
            form.formState.isSubmitting
          }
          form="formCategoria"
          type="submit"
        >
          Salvar
        </Button>
      </DialogFooter>
    </>
  );
}

function useFromAction(id?: number) {
  const { close, closeAndEmit } = useDialog();
  const [isLoading, setIsLoading] = useState(true);
  const form = useForm<FormShemaType>({
    resolver: zodResolver(formSchema),
    mode: "all",
  });

  const loadData = async () => {
    try {
      const { data } = await gettingData<HttpResponseDataType<CategoryModel>>(
        `${CategoryModel.ENDPOINT}/${id}`
      );

      form.reset({
        name: data.name,
      });

      setIsLoading(false);
    } catch {}
  };

  const onSubmit = async (values: FormShemaType) => {
    try {
      const path = id
        ? `${CategoryModel.ENDPOINT}/${id}`
        : `${CategoryModel.ENDPOINT}`;
      const data = {
        name: values.name,
      };

      await api(path, {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(data),
      });

      closeAndEmit({
        title: `${id ? "Atualizado" : "Criado"} com sucesso`,
        variant: "default",
      });

      queryClient.invalidateQueries({
        queryKey: ["categories-list", "profile-data"],
      });
    } catch (error) {
      console.log(error);
      closeAndEmit({
        title: `Aconteceu um erro`,
        description: `erro:${error ? error : "Erro desconhecido"}`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);
  return { form, isLoading, onSubmit, close };
}
