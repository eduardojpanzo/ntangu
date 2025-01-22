import { Plus, type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { useDialog } from "@/contexts/dialog-context";
import { FormCategory } from "./section/form-category";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { CategoryModel } from "@/models/category.model";

interface Props {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  title: string;
  newButton?: boolean;
  refetch?: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<CategoryModel[], Error>>;
}

export function NavList({ items, title, newButton, refetch }: Props) {
  const l = useLocation();
  const { openCustomComponent } = useDialog();

  const handleOpenCustom = () => {
    openCustomComponent(FormCategory, {
      handleAccept: async () => {
        await refetch?.();
      },
    });
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu className="space-y-1">
        {items.map((item) => (
          <SidebarMenuItem className="overflow-hidden" key={item.title}>
            <NavLink to={`${item.url}`}>
              <SidebarMenuButton
                tooltip={item.title}
                className="flex gap-2 items-center"
                size="default"
                isActive={l.pathname === item.url}
              >
                {item.icon && <item.icon />} <span>{item.title}</span>
              </SidebarMenuButton>
            </NavLink>
          </SidebarMenuItem>
        ))}
        {newButton && (
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={"Nova Categoria"}
              className="flex gap-2 items-center"
              size="default"
              onClick={() => handleOpenCustom()}
            >
              <Plus /> <span>Nova</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
