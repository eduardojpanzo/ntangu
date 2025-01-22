import { ResumeCalendar } from "@/components/resume-calendar";
import { ResumeNumbers } from "@/components/resume-numbers";
import { FormTask } from "@/components/section/form-task";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-provider";
import { useDialog } from "@/contexts/dialog-context";
import { Plus } from "lucide-react";
import art from "./../../src/assets/art.png";
import { useQuery } from "@tanstack/react-query";
import { ResumeModel } from "@/models/resume.model";
import { gettingData } from "@/lib/fecth";
import { ChartBarResune } from "@/components/chart-bar-resume";
import { formatDateRange, formatToFullDate } from "@/lib/utils";
import { ChartLineResume } from "@/components/chart-line-resume";

export default function Dashboard() {
  const { profile } = useAuth();
  const { openCustomComponent } = useDialog();

  const handleOpenCustom = () => {
    openCustomComponent(FormTask, {
      // handleAccept: async () => await refresh(),
    });
  };

  const loadResumeData = async () => {
    const resumeData = await gettingData<HttpResponseDataType<ResumeModel[]>>(
      ResumeModel.ENDPOINT
    );

    return resumeData.data;
  };

  const { data: resume } = useQuery({
    queryKey: ["resume-data"],
    queryFn: loadResumeData,
  });

  return (
    <main className="flex flex-col gap-5 lg:flex-row">
      <section className="flex flex-col gap-8">
        <div className="grid grid-cols-1 w-[620px] h-40 rounded-xl bg-accent sm:grid-cols-2 overflow-hidden">
          <div className="flex flex-col justify-center p-4">
            <strong className="text-3xl font-medium">
              Olá @{profile?.name}
            </strong>
            <span>É bom ver você novamente.</span>
          </div>
          <figure className="hidden relative max-h-40 sm:block">
            <img
              src={art}
              alt="art"
              className="absolute top-1/2 -translate-y-1/2"
            />
          </figure>
        </div>

        <div className="flex gap-5 items-center">
          <ResumeNumbers
            desc="Horas traballhadas"
            title={
              profile?.tasks
                ?.filter((task) => task.status === "done")
                .reduce((acc, task) => acc + (task.duration ?? 0), 0)
                .toString() ?? "0"
            }
          />
          <ResumeNumbers
            desc="Tarefas Criadas"
            title={profile?.tasks?.length.toString() ?? "0"}
          />
          <ResumeNumbers
            desc="Tarefas concluida"
            title={
              profile?.tasks
                ?.filter((task) => task.status === "done")
                .length.toString() ?? "0"
            }
          />
        </div>

        <div>
          <ChartLineResume
            subtitle={formatDateRange(
              resume?.map((item) => ({ date: item.date ?? "" }))
            )}
            chartData={resume?.map((item) => ({
              created: item.created ?? 0,
              completed: item.completed ?? 0,
              date: formatToFullDate(item.date ?? ""),
            }))}
          />
        </div>
      </section>

      <aside className="max-w-96 flex flex-col gap-5">
        <div className="w-96 h-24 mx-auto flex items-center justify-between p-4 rounded-xl bg-accent">
          <p>
            <strong>Crie tarefa</strong> <br />
            <span>crie uma nova tarefa</span>
          </p>

          <Button onClick={() => handleOpenCustom()}>
            <Plus />
          </Button>
        </div>

        <ChartBarResune
          chartData={resume
            ?.map((item) => ({
              created: item.created ?? 0,
              completed: item.completed ?? 0,
              date: formatToFullDate(item.date ?? ""),
            }))
            .slice(resume.length - 1)}
        />
        <ResumeCalendar />
      </aside>
    </main>
  );
}
