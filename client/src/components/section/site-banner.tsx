import { Link } from "react-router-dom";
import bannerImg from "../../assets/dashboard.png";

export function SiteBanner() {
  return (
    <section>
      <div className="container mx-auto">
        <div className="mt-10 text-center">
          <h2 className="text-4xl leading-snug font-bold uppercase lg:text-6xl lg:leading-[80px]">
            Transforme suas tarefas em
          </h2>
          <strong className="text-4xl text-primary leading-snug font-bold uppercase lg:text-6xl lg:leading-[80px]">
            produtividade máxima
          </strong>

          <div className="mt-5 mx-auto sm:mt-8 sm:flex sm:justify-center">
            <div className="rounded-md shadow">
              <Link
                to="/dashboard"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
              >
                Começar agora
              </Link>
            </div>
          </div>
        </div>

        <div className="flex min-w-[350px] max-w-[650px] max-h-[550px] min-h-[350px] mx-auto mt-10 overflow-hidden rounded-2xl shadow-xl max-lg:h-fit max-lg:max-h-[320px] max-lg:min-h-[150px] max-lg:w-[320px]">
          <img
            src={bannerImg}
            alt="dashboard"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
