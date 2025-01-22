import { CheckCircle, Calendar, List, Zap } from "lucide-react";

const recursos = [
  {
    name: "Organização de Tarefas",
    description:
      "Crie, categorize e priorize suas tarefas facilmente para máxima eficiência.",
    icon: CheckCircle,
  },
  {
    name: "Integração com Calendário",
    description:
      "Integre suas tarefas com seu calendário para um melhor gerenciamento do tempo.",
    icon: Calendar,
  },
  {
    name: "Listas Personalizadas",
    description:
      "Crie listas personalizadas para diferentes áreas da sua vida.",
    icon: List,
  },
  {
    name: "Lembretes Inteligentes",
    description:
      "Receba lembretes inteligentes baseados em seus hábitos e urgência das tarefas.",
    icon: Zap,
  },
];

export default function Recursos() {
  return (
    <div className="py-12 bg-white" id="recursos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">
            Recursos
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Uma maneira melhor de gerenciar tarefas
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Ntangu fornece todas as ferramentas necessárias para manter-se
            organizado e produtivo.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {recursos.map((recurso) => (
              <div key={recurso.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                    <recurso.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {recurso.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {recurso.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
