import * as React from "react";

import { NavList } from "@/components/nav-list";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Menudata } from "@/data";
import { ScrollArea } from "../ui/scroll-area";
import { Logo } from "../logo";
import { CategoryModel } from "@/models/category.model";
import { DotSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/fecth";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const loadData = async () => {
    const response = await api(`${CategoryModel.ENDPOINT}`);
    const responseData: HttpResponseDataType<CategoryModel[]> =
      await response.json();

    return responseData.data;
  };
  const { data, refetch } = useQuery({
    queryKey: ["categories-list"],
    queryFn: loadData,
  });

  const navCategory =
    data?.map((category) => ({
      title: `${category.name}`,
      url: `/tasks/${category.id}`,
      icon: DotSquare,
    })) ?? [];
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="h-[70px] hover:bg-transparent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Logo />
        </SidebarMenuButton>
      </SidebarHeader>
      {/* <Separator /> */}
      <SidebarContent>
        <ScrollArea>
          <NavList title="Geral" items={Menudata.navGeral} />
          <NavList
            title="Por Categorias"
            items={navCategory}
            refetch={refetch}
            newButton
          />
        </ScrollArea>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
