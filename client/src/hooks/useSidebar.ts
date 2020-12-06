import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import sidebarMenus from 'app/configs/sidebar';

function useSidebar() {
  const { t } = useTranslation();
  const [menus] = useState(() => {
    return sidebarMenus.map(menu => {
      return {
        name: t(menu.name),
        data: menu.data.map(d => {
          if (d.children && d.children.length > 0) {
            return {
              ...d,
              label: t(d.label),
              children: d.children.map(c => ({
                ...c,
                label: t(c.label),
              })),
            };
          }

          return {
            ...d,
            label: t(d.label),
          };
        }),
      };
    });
  });

  const getMenuSelected = (pathSelected: string): Record<string, boolean> => {
    let array: any[] = [];

    sidebarMenus.forEach(s => {
      s.data.forEach(d => {
        if (d.children && d.children.length > 0) {
          array.push(...d.children);
        } else {
          array.push(d);
        }
      });
    });

    const match = array.find(a => a.name === pathSelected);
    if (!match) {
      return {};
    }

    return { [match.name]: true };
  };

  // useEffect(() => {

  // }, [])

  return { sidebarMenus: menus, getMenuSelected };
}

export default useSidebar;
