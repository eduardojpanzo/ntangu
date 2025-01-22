import { useAuth } from "@/contexts/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { buildInitials } from "@/utils";

export function AvatarDropDownMemu() {
  const { logout, profile } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="max-w-10 rounded-none max-h-10">
          <AvatarImage className="rounded-none" src={""} />
          <AvatarFallback>
            {buildInitials(profile?.email?.split("@")[0] ?? "")}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">Perfil</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => logout()}>
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
