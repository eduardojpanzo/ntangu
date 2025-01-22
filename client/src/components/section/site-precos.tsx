import { Check } from "lucide-react";

const planos = [
  {
    name: "Básico",
    href: "#",
    priceMonthly: 0,
    description: "Tudo que você precisa para começar.",
    features: [
      "5 projetos",
      "Lembretes básicos",
      // "Sincronização em 1 dispositivo",
      "Suporte por email",
    ],
  },
  {
    name: "Pro",
    href: "#",
    priceMonthly: 350,
    description: "Perfeito para usuários avançados.",
    features: [
      "Projetos ilimitados",
      "Lembretes avançados",
      "Sincronização em todos os dispositivos",
      "Suporte prioritário",
      "Backup automático",
    ],
  },
  {
    name: "Premium",
    href: "#",
    priceMonthly: 650,
    description: "Para os que buscam o máximo em produtividade.",
    features: [
      "Tudo do plano Pro",
      "Análise de produtividade",
      "Integração com apps terceiros",
      "Temas personalizados",
      "Suporte 24/7",
      "Acesso antecipado a novos recursos",
    ],
  },
];

export default function Precos() {
  return (
    <div className="bg-gray-100" id="precos">
      <div className="pt-12 sm:pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
              Preços simples e transparentes
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Escolha o plano que é certo para você e comece a controlar suas
              tarefas hoje.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 pb-16 sm:mt-12 sm:pb-20 lg:pb-28">
        <div className="relative">
          <div className="absolute inset-0 h-1/2 bg-gray-100" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex">
              {planos.map((plano) => (
                <div
                  key={plano.name}
                  className="flex-1 bg-white px-6 py-8 lg:p-12"
                >
                  <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                    {plano.name}
                  </h3>
                  <p className="mt-6 text-base text-gray-500">
                    {plano.description}
                  </p>
                  <div className="mt-8">
                    <div className="flex items-center">
                      <h4 className="flex-shrink-0 pr-4 bg-white text-sm tracking-wider font-semibold uppercase text-green-600">
                        O que está incluído
                      </h4>
                      <div className="flex-1 border-t-2 border-gray-200" />
                    </div>
                    <ul className="mt-8 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5">
                      {plano.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start lg:col-span-1"
                        >
                          <div className="flex-shrink-0">
                            <Check
                              className="h-5 w-5 text-green-400"
                              aria-hidden="true"
                            />
                          </div>
                          <p className="ml-3 text-sm text-gray-700">
                            {feature}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8">
                    <div className="flex items-center">
                      <h4 className="flex-shrink-0 pr-4 bg-white text-sm tracking-wider font-semibold uppercase text-green-600">
                        Preço
                      </h4>
                      <div className="flex-1 border-t-2 border-gray-200" />
                    </div>
                    <p className="mt-4 text-4xl font-extrabold text-gray-900">
                      {plano.priceMonthly === 0
                        ? "Grátis"
                        : `AOA ${plano.priceMonthly}`}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {plano.priceMonthly === 0 ? "" : "por mês"}
                    </p>
                    <a
                      href={plano.href}
                      className="mt-6 block w-full bg-green-600 border border-transparent rounded-md shadow py-2 text-sm font-semibold text-white text-center hover:bg-green-700"
                    >
                      Começar agora
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
