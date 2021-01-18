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

export interface MenuItem {
  key: string;
  name: string;
  link: string;
  permission: boolean;
}
export interface Menu {
  key: string;
  name: string;
  icon: string;
  link?: string;
  permission: boolean;
  child?: MenuItem[];
}

export const sidebarWidth = 300;
export const sidebarMinWidth = 73;
