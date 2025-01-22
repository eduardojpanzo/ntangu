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
import { ResponsiveGrid } from "@/components/responsive-grid";
import { useEffect, useState } from "react";
import { useDialog } from "@/contexts/dialog-context";
import { api, gettingData } from "@/lib/fecth";
import { TaskModel } from "@/models/task.model";
import { TextareaWithControl } from "../form/textarea-control";
import { SelectWithControl } from "../form/select-component/select-control";
import { StatusTaskColumns } from "@/data";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";
import { AutoCompleteControl } from "../form/select-component/autocomplete-control";
import { CategoryModel } from "@/models/category.model";
import {
  convertRealToTime,
  convertTimeToReal,
  convertToDateInput,
} from "@/utils";

const formSchema = z.object({
  title: z.string({ message: "Por favor insira o titulo" }).min(4, {
    message: "O titulo da tarefa deve ter pelo menos 4 caracteres",
  }),
  description: z.string().optional(),
  dueDate: z
    .string({ message: "Informe uma data válida" })
    .transform((date) => new Date(date).toISOString()),
  duration: z
    .string({ message: "Por favor insira uma duração" })
    .time({ message: "Por favor insira uma duração válida" }),
  status: z.object(
    {
      label: z.string(),
      value: z.enum(["backlog", "todo", "in-progress", "done"]),
    },
    { message: "Por favor selecione do estado" }
  ),
  categoryId: z.object(
    {
      label: z.string(),
      value: z.number(),
    },
    { message: "Por favor selecione do estado" }
  ),
});

type FormShemaType = z.infer<typeof formSchema>;

type MutationTypeForm = {
  path: string;
  data: {
    title: string;
    description: string;
    dueDate: string;
    status: "backlog" | "todo" | "in-progress" | "done";
    categoryId: number | undefined;
  };
  methed: "put" | "post";
};

export function FormTask({
  id,
  status,
  categoryId,
}: {
  id?: number;
  status?: "backlog" | "todo" | "in-progress" | "done";
  categoryId?: string;
}) {
  const { close, form, onSubmit } = useFromAction(id);

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {id ? "Editar Tarefa" : "Criar uma nova tarefa"}
        </DialogTitle>
        <DialogDescription>Defina os dados da tarefa</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id="formTask">
          <InputWithControl
            label="Título"
            control={form.control}
            name="title"
          />

          <ResponsiveGrid>
            <AutoCompleteControl
              label="Categoria"
              name="categoryId"
              propertyLabel="name"
              propertyValue="id"
              defaultValueByPropertyValue={categoryId ? categoryId : undefined}
              placeholder="Selecione um estado"
              path={CategoryModel.ENDPOINT}
              control={form.control}
            />
            <SelectWithControl
              label="Estado"
              name="status"
              defaultValue={StatusTaskColumns.find(
                (item) => item.value === status
              )}
              control={form.control}
              data={StatusTaskColumns}
              placeholder="Selecione um estado"
            />
            <InputWithControl
              label="Data Limite"
              control={form.control}
              name="dueDate"
              type="datetime-local"
              step={"1"}
            />
            <InputWithControl
              label="Duração"
              control={form.control}
              name="duration"
              type="time"
              step={1}
            />
          </ResponsiveGrid>
          <TextareaWithControl
            label="Descrição"
            control={form.control}
            name="description"
          />
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
          disabled={!form.formState.isValid || form.formState.isSubmitting}
          form="formTask"
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
      const { data } = await gettingData<HttpResponseDataType<TaskModel>>(
        `${TaskModel.ENDPOINT}/${id}`
      );

      form.reset({
        title: data.title,
        description: data.description ?? "",
        dueDate: convertToDateInput(data.dueDate ?? new Date().toISOString()),
        status: StatusTaskColumns.find((item) => item.value === data.status),
        duration: convertRealToTime(data.duration ?? 0),
        categoryId: {
          label: data.category?.name,
          value: Number(data.category?.id),
        },
      });

      setIsLoading(false);
    } catch {}
  };

  // Mutations
  const mutation = useMutation({
    mutationFn: async ({ data, methed, path }: MutationTypeForm) => {
      await api(path, {
        method: methed,
        body: JSON.stringify(data),
      });
    },
    onError: (error) => {
      closeAndEmit({
        title: `Proplemas ao criar tarefa`,
        description: `Tente novamente! ${error}`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      closeAndEmit({
        title: `${id ? "Atualizado" : "Criado"} com sucesso`,
        variant: "default",
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks-list"],
      });
      queryClient.invalidateQueries({
        queryKey: ["resume-data"],
      });
      queryClient.invalidateQueries({
        queryKey: ["profile-data"],
      });
    },
  });
  const onSubmit = async (values: FormShemaType) => {
    try {
      const path = id ? `${TaskModel.ENDPOINT}/${id}` : `${TaskModel.ENDPOINT}`;
      const data = {
        title: values.title,
        description: values.description ?? "",
        dueDate: values.dueDate,
        status: values.status.value,
        categoryId: values.categoryId.value,
        duration: convertTimeToReal(values.duration),
      };
      const methed = id ? "put" : "post";

      mutation.mutate({ path, data, methed });
    } catch {}
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);
  return { form, isLoading, mutation, onSubmit, close };
}
