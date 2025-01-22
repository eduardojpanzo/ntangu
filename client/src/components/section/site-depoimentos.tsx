import { buildInitials } from "@/utils";
import logoImg from "../../assets/ntangu-verde.svg";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Depoimentos() {
  return (
    <section
      className="py-12 bg-gray-50 overflow-hidden md:py-20 lg:py-24"
      id="depoimentos"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <img className="mx-auto h-8" src={logoImg} alt="Ntangu" />
          <blockquote className="mt-10">
            <div className="max-w-3xl mx-auto text-center text-2xl leading-9 font-medium text-gray-900">
              <p>
                &ldquo;Ntangu revolucionou a forma como gerencio minhas tarefas
                diárias. É intuitivo, poderoso e aumentou significativamente
                minha produtividade. Não consigo imaginar trabalhar sem ele
                agora!&rdquo;
              </p>
            </div>
            <footer className="mt-8">
              <div className="md:flex md:items-center md:justify-center">
                <div className="md:flex-shrink-0">
                  <Avatar className="max-w-10 rounded-none max-h-10">
                    <AvatarImage className="rounded-none" src={""} />
                    <AvatarFallback>
                      {buildInitials("Ana Silva")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="mt-3 text-center md:mt-0 md:ml-4 md:flex md:items-center">
                  <div className="text-base font-medium text-gray-900">
                    Ana Silva
                  </div>

                  <svg
                    className="hidden md:block mx-1 h-5 w-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M11 0h3L9 20H6l5-20z" />
                  </svg>

                  <div className="text-base font-medium text-gray-500">
                    Empreendedora
                  </div>
                </div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
