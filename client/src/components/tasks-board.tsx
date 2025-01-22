import { StatusTaskColumns } from "@/data";
import { TaskModel } from "@/models/task.model";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { TaskItem } from "./task-card";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useDialog } from "@/contexts/dialog-context";
import { FormTask } from "./section/form-task";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  useDroppable,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/fecth";
import { queryClient } from "@/lib/query";

interface StatusTaskColumn {
  value: "backlog" | "todo" | "in-progress" | "done";
  label: string;
  desc: string;
}

export function TasksBaord({
  data,
  isLoading,
}: {
  data?: TaskModel[];
  isLoading?: boolean;
}) {
  const { categoryId } = useParams();
  const [tasks, setTasks] = useState(data);
  const { closeAndEmit } = useDialog();

  useEffect(() => {
    setTasks(data);
  }, [categoryId, data?.length]);

  const mutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      status?: "backlog" | "todo" | "in-progress" | "done";
      id: number | undefined;
    }) => {
      await api(`${TaskModel.ENDPOINT}/status/${id}`, {
        method: "put",
        body: JSON.stringify({ status }),
      });
    },
    onError: (error) => {
      closeAndEmit({
        title: `Proplemas ao atualizar tarefa`,
        description: `Tente novamente! ${error}`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks-list"],
      });
      queryClient.invalidateQueries({
        queryKey: ["profile-data"],
      });
    },
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const draggedTaskId = parseInt(active.id as string, 10);
      const targetStatus = over.id as TaskModel["status"];

      console.log(draggedTaskId, targetStatus);

      setTasks((prevTasks) =>
        prevTasks?.map((task) =>
          task.id === draggedTaskId ? { ...task, status: targetStatus } : task
        )
      );

      mutation.mutate({ id: draggedTaskId, status: targetStatus });
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex h-auto max-w-max  mx-auto gap-4 overflow-y-auto">
        {!isLoading
          ? StatusTaskColumns.map((column) => (
              <DroppableColumn
                key={column.value}
                categoryId={categoryId}
                column={column}
                tasks={tasks}
              />
            ))
          : StatusTaskColumns.map((i) => (
              <Skeleton
                key={i.value}
                className="w-72 max-w-56 max-h-[calc(100vh-100px)] min-h-80 bg-accent rounded-xl"
              />
            ))}
      </div>
    </DndContext>
  );
}

interface DroppableColumnProps {
  column: StatusTaskColumn;
  tasks?: TaskModel[];
  categoryId?: string;
}

function DroppableColumn({ column, tasks, categoryId }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.value });
  const { openCustomComponent } = useDialog();
  return (
    <Card
      ref={setNodeRef}
      className="w-72 max-w-56 max-h-[calc(100vh-100px)] min-h-80 grid grid-rows-[minmax(0,32px)_minmax(0,1fr)_minmax(0,48px)] p-2 bg-accent rounded-xl"
    >
      <CardHeader className="p-1">
        <CardTitle className="font-medium">{column.label}</CardTitle>
        <span className="sr-only">{column.desc}</span>
      </CardHeader>
      <CardContent className="max-w-[230px] flex flex-col gap-3 p-1 pl-0 overflow-y-auto">
        {tasks
          ?.filter((task) => task.status === column.value)
          ?.map((task) => (
            <TaskItem categoryId={categoryId} key={task.id} task={task} />
          ))}
      </CardContent>
      <CardFooter className="p-1">
        <Button
          onClick={() =>
            openCustomComponent(FormTask, {
              params: { status: column.value, categoryId: categoryId },
            })
          }
          variant={"ghost"}
          className="p-3 hover:bg-background"
        >
          <Plus /> <span>Adicionar tarefa</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
