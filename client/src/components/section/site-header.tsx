import { Link } from "react-router-dom";
import { Logo } from "../logo";

export function SiteHeader() {
  return (
    <header className="bg-opacity-0 px-[5%] z-10">
      <div className="container mx-auto flex items-center">
        <Logo />
        <div className="flex h-full w-max gap-5 text-base max-lg:mt-[30px] max-lg:flex-col max-lg:place-items-end max-lg:gap-5 lg:mx-auto lg:place-items-center">
          <a className="hover:text-primary" href="">
            {" "}
            Sobre{" "}
          </a>
          <a className="hover:text-primary" href="">
            {" "}
            Funcionalidade{" "}
          </a>
          <a className="hover:text-primary" href="">
            {" "}
            Testemunhos{" "}
          </a>
        </div>
        <button
          className="bi bi-list absolute right-3 top-3 z-50 text-3xl text-black lg:hidden"
          // onClick="toggleHeader()"
          aria-label="menu"
          id="collapse-btn"
        ></button>
      </div>
    </header>
  );
}

export function Header() {
  return (
    <header className="z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Topo">
        <div className="w-full py-6 flex items-center justify-between">
          <div className="flex items-center">
            <Logo />
            <div className="hidden ml-10 space-x-8 lg:block">
              <a
                href="#recursos"
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Recursos
              </a>
              <a
                href="#depoimentos"
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Depoimentos
              </a>
              <a
                href="#precos"
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Preços
              </a>
            </div>
          </div>
          <div className="ml-10 space-x-4">
            <Link
              to="/login"
              className="inline-block bg-primary py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-primary hover:bg-pritext-primary"
            >
              Cadastrar
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
