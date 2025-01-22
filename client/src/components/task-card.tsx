import { Calendar, CheckCheck, Clock, Edit, Trash } from "lucide-react";
import { Badge } from "./ui/badge";
import { TaskModel } from "@/models/task.model";
import { Button } from "./ui/button";
import { useDialog } from "@/contexts/dialog-context";
import { FormTask } from "./section/form-task";
import { calcularDistanciaData, convertRealToTime } from "@/utils";
import { useDraggable } from "@dnd-kit/core";
import { queryClient } from "@/lib/query";

interface TaskProps {
  task: TaskModel;
  categoryId?: string;
}

export function TaskItem({ task, categoryId }: TaskProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id?.toString() ?? "",
    });
  const { openCustomComponent } = useDialog();

  const handleOpenCustom = (id?: number) => {
    openCustomComponent(FormTask, {
      params: { id, status: task.status, categoryId },
      handleAccept: async () => {
        await queryClient.invalidateQueries({ queryKey: ["tasks-list"] });
      },
    });
  };

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    position: isDragging ? "absolute" : "relative",
    zIndex: isDragging ? 1000 : "auto",
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="rounded-lg shadow max-w-[230px]"
    >
      <div className="relative bg-background border-2 border-primary/10 rounded-xl px-2 py-3 hover:border-primary text-sm leading-relaxed cursor-pointer select-none transition-all group max-w-full">
        <h4 className="font-semibold capitalize">{task.title}</h4>
        <em className="not-italic line-clamp-2 break-words mb-1">
          {task.description}
        </em>{" "}
        <div className="absolute right-0 top-0 flex items-center gap-1">
          <Button
            className="p-2 bg-transparent border-none shadow-none text-primary/30 hover:bg-transparent hover:text-primary"
            onClick={() => handleOpenCustom(task.id)}
          >
            <Edit className="p-0" size={12} />
          </Button>
          <Button
            className="p-2 bg-transparent border-none shadow-none text-destructive/30 hover:bg-transparent hover:text-destructive"
            onClick={() => handleOpenCustom(task.id)}
          >
            <Trash className="p-0" size={12} />
          </Button>
        </div>
        {task.status === "done" ? (
          <Badge variant={"secondary"} className="inline-flex gap-1 mx-1 text ">
            <CheckCheck size={12} /> Feito
          </Badge>
        ) : (
          <Badge
            variant={"secondary"}
            data-taskstatus={
              calcularDistanciaData(new Date(task.dueDate!)).status
            }
            className="inline-flex gap-1 mx-1 text data-[taskstatus=orange]:bg-red-400/25 data-[taskstatus=orange]:text-red-900 data-[taskstatus=orange]:hover:bg-red-400/25 data-[taskstatus=green]:bg-green-400/25 data-[taskstatus=green]:text-green-900 data-[taskstatus=green]:hover:bg-green-400/25 data-[taskstatus=blue]:bg-blue-400/25 data-[taskstatus=blue]:text-blue-900 data-[taskstatus=blue]:hover:bg-blue-400/25"
          >
            <Calendar size={12} />{" "}
            {calcularDistanciaData(new Date(task.dueDate!)).valor}
          </Badge>
        )}
        <Badge variant={"secondary"} className="inline-flex gap-1 mx-1 text ">
          <Clock size={12} /> {convertRealToTime(task.duration ?? 0)}
        </Badge>
      </div>
    </div>
  );
}
