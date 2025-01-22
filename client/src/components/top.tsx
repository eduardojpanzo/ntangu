import { api } from "@/lib/fecth";
import { CategoryModel } from "@/models/category.model";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Edit, Plus } from "lucide-react";
import { useDialog } from "@/contexts/dialog-context";
import { FormCategory } from "./section/form-category";
import { FormTask } from "./section/form-task";

export function Top() {
  const { openCustomComponent } = useDialog();
  const { categoryId } = useParams();
  const [category, setCategory] = useState<CategoryModel>();

  const loadData = async () => {
    const response = await api(`${CategoryModel.ENDPOINT}/${categoryId}`);
    const responseData: HttpResponseDataType<CategoryModel> =
      await response.json();
    setCategory(responseData.data);
  };

  useEffect(() => {
    if (categoryId) {
      loadData();
    }
  }, [categoryId]);

  const handleOpenCustomCategory = () => {
    openCustomComponent(FormCategory, {
      params: { id: Number(categoryId) },
      handleAccept: async () => {
        await loadData();
      },
    });
  };

  return (
    <div className="flex items-center justify-between mb-4 group py-4">
      <div className="flex items-center gap-2">
        <h3>{category?.name ? category.name : "Todas Tarefas"}</h3>
        {category && (
          <Edit
            onClick={() => handleOpenCustomCategory()}
            className="hidden group-hover:inline transition-all font-bold cursor-pointer text-primary hover:text-primary/50"
            size={16}
          />
        )}
      </div>

      <Button
        onClick={() =>
          openCustomComponent(FormTask, { params: { categoryId } })
        }
      >
        <Plus /> Nova Tarefa
      </Button>
    </div>
  );
}
