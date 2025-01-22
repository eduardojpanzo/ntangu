import { TasksBaord } from "@/components/tasks-board";
import { Top } from "@/components/top";
import { api } from "@/lib/fecth";
import { TaskModel } from "@/models/task.model";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function DashboardTasks() {
  const { categoryId } = useParams();
  const loadData = async () => {
    const response = await api(
      `${TaskModel.ENDPOINT}${categoryId ? "/category/" + categoryId : ""}`
    );
    const responseData: HttpResponseDataType<TaskModel[]> =
      await response.json();

    return responseData.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["tasks-list", categoryId],
    queryFn: loadData,
    refetchOnMount: "always",
  });

  return (
    <main>
      <Top />
      <TasksBaord isLoading={isLoading} data={data} />
    </main>
  );
}
