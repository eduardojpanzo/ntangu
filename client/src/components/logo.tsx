import { Link } from "react-router-dom";
import logoImg from "../assets/ntangu-verde.svg";

export function Logo() {
  return (
    <Link to={"/"}>
      <img
        src={logoImg}
        width={70}
        height={70}
        className="w-36 h-20 text-primary"
        alt="logo da ntangu"
      />
    </Link>
  );
}
