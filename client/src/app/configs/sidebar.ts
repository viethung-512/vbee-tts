export interface SidebarItem {
  label: string;
  name: string;
  permission: boolean;
  path?: string;
  icon?: React.ReactNode;
  children?: {
    label: string;
    name: string;
    path: string;
    permission: boolean;
  }[];
}

export interface SidebarMenu {
  name: string;
  data: SidebarItem[];
}

export const sidebarWidth = 270;
export const sidebarMinWidth = 73;
