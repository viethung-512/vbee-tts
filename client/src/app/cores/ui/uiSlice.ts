import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem } from 'app/configs/sidebar';
import { menus, otherMenu } from 'app/constants/sidebar';

interface UIState {
  sidebarOpen: boolean;
  subMenuOpen: (string | null)[];
  sidebarItemActive: string;
  breadcrumbs: {
    name: string;
    link: string;
    icon?: string;
  }[];
}

const initialState: UIState = {
  sidebarOpen: true,
  subMenuOpen: [],
  sidebarItemActive: '',
  breadcrumbs: [],
};

const getMenus = (menuArray: any, getForItem: boolean = false) => {
  if (getForItem) {
    let result: any = [];

    menuArray.forEach((item: any) => {
      if (item.child) {
        result.push(
          ...item.child.map((ch: any) => ({ ...ch, keyParent: item.key }))
        );
      } else {
        result.push(item);
      }
    });

    return result;
  } else {
    return menuArray.map((item: any) => {
      if (item.child) {
        return item.child;
      }
      return false;
    });
  }
};

const setNavCollapse = (arr: any, curRoute: any) => {
  let headMenu = 'not found';
  for (let i = 0; i < arr.length; i += 1) {
    for (let j = 0; j < arr[i].length; j += 1) {
      if (arr[i][j].link === curRoute) {
        headMenu = menus[i].key;
      }
    }
  }
  return headMenu;
};

const getItemActive = (arr: MenuItem[], currPathName: string) => {
  let result = 'not found';
  arr.forEach((item: any) => {
    if (item.link === currPathName) {
      result = item.key;
    }
  });

  return result;
};

const uiSLice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    initOpenSubMenu: (state, action: PayloadAction<string>) => {
      // Set initial open parent menu
      const activeParent = setNavCollapse(getMenus(menus), action.payload);

      state.subMenuOpen = [activeParent];
    },
    openSubMenu: (
      state,
      action: PayloadAction<{
        key: string;
        keyParent: string;
      }>
    ) => {
      // Once page loaded will expand the parent menu
      const menuList = state.subMenuOpen;
      if (menuList.indexOf(action.payload.key) > -1) {
        if (action.payload.keyParent) {
          state.subMenuOpen = [action.payload.keyParent];
        } else {
          state.subMenuOpen = [];
        }
      } else {
        // Expand / Collapse parent menu
        state.subMenuOpen = [action.payload.key, action.payload.keyParent];
      }
    },
    activeSidebarItem: (state, action: PayloadAction<string>) => {
      const active = getItemActive(
        [...getMenus(menus, true), ...getMenus(otherMenu, true)],
        action.payload
      );
      state.sidebarItemActive = active;
    },
    breadcrumbChange: (state, action: PayloadAction<string>) => {
      const pathname = action.payload;

      console.log({ pathname });

      const listAllSidebarItem = [
        ...getMenus(menus, true),
        ...getMenus(otherMenu, true),
      ];
      const matched = listAllSidebarItem.find((sidebarItem: any) =>
        pathname.includes(sidebarItem.link)
      );

      if (matched.key !== 'dashboard') {
        state.breadcrumbs = [
          {
            name: 'TITLE_DASHBOARD',
            link: '/',
            icon: 'home',
          },
          {
            name: matched.name,
            link: matched.link,
            icon: matched.icon
              ? matched.icon
              : menus.find(it => it.key === matched.keyParent)!.icon,
          },
        ];
      } else {
        state.breadcrumbs = [
          {
            name: 'TITLE_DASHBOARD',
            link: '/',
            icon: 'home',
          },
        ];
      }
    },
  },
});

export const {
  toggleSidebar,
  openSubMenu,
  initOpenSubMenu,
  activeSidebarItem,
  breadcrumbChange,
} = uiSLice.actions;
export default uiSLice.reducer;
