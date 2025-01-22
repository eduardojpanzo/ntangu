import { ChartColumn, ListTodo } from "lucide-react";

export const Menudata = {
  navGeral: [
    {
      title: "Resumo",
      url: "/dashboard",
      icon: ChartColumn,
    },
    {
      title: "Todas as tarefas",
      url: "/tasks",
      icon: ListTodo,
    },
  ],
};

export const StatusTaskColumns: {
  value: "backlog" | "todo" | "in-progress" | "done";
  label: string;
  desc: string;
}[] = [
  {
    value: "backlog",
    label: "Pendente",
    desc: "",
  },
  {
    value: "todo",
    label: "Para Fazer",
    desc: "",
  },
  {
    value: "in-progress",
    label: "Em Progresso",
    desc: "",
  },
  {
    value: "done",
    label: "Feito",
    desc: "",
  },
];
