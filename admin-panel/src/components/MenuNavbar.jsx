// src/components/MenuNavbar.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MenuNavbar = () => {
  const [menuTree, setMenuTree] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      const res = await fetch('http://localhost:5000/api/menus');
      const data = await res.json();

      // Build hierarchy
      const menuMap = {};
      data.forEach((item) => {
        menuMap[item._id] = { ...item, children: [] };
      });

      const tree = [];
      data.forEach((item) => {
        if (item.parent) {
          if (menuMap[item.parent]) {
            menuMap[item.parent].children.push(menuMap[item._id]);
          }
        } else {
          tree.push(menuMap[item._id]);
        }
      });

      setMenuTree(tree);
    };

    fetchMenus();
  }, []);

  return (
    <div className="p-4 bg-base-200">
      <ul className="menu menu-horizontal bg-base-100 rounded-box">
        {menuTree.map((menu) => (
          <li key={menu._id} className="relative">
            {menu.children.length > 0 ? (
              <details>
                <summary>{menu.menu_name}</summary>
                <ul className="z-10 p-2 bg-base-100">
                  {menu.children.map((child) => (
                    <li key={child._id}>
                      <Link to={child.external_link || '#'}>{child.menu_name}</Link>
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <Link to={menu.external_link || '#'}>{menu.menu_name}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuNavbar;
