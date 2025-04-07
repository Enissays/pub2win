import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MdOutlineCancel, MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { links } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } = useStateContext();
  const [openSubMenus, setOpenSubMenus] = useState({});

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const toggleSubMenu = (name) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-dark text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 hover:bg-[#F0F0F0] hover:text-black dark:hover:bg-white dark:hover:text-black hover:border-l-4 hover:border-[#00B8D2] transition-all duration-300 m-2';

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link to="/" onClick={handleCloseSideBar} className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
              <img src="/p2w.png" alt="Logo" style={{
                height: "90px",
                width: "auto"
              }}/>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-[#F0F0F0] hover:text-[#023047] hover:border-[#00B8D2] mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10">
            {links.map((item) => (
              <div key={item.title}>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  {item.title}
                </p>
                {item.links.map((link) => (
                  <div key={link.name}>
                    {link.subMenu ? (
                      <div className="cursor-pointer">
                        <div 
                          className={normalLink}
                          onClick={() => toggleSubMenu(link.name)}
                        >
                          {link.icon}
                          <span className="capitalize">{link.name}</span>
                          <span className="ml-auto">
                            {openSubMenus[link.name] ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                          </span>
                        </div>
                        
                        {openSubMenus[link.name] && (
                          <div className="ml-6">
                            {link.subMenu.map((subItem) => (
                              <NavLink
                                to={`/${subItem.path}`}
                                key={subItem.name}
                                onClick={handleCloseSideBar}
                                className={normalLink}
                              >
                                <span className="capitalize">{subItem.name}</span>
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <NavLink
                        to={`/${link.path}`}
                        key={link.name}
                        onClick={handleCloseSideBar}
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? currentColor : '',
                        })}
                        className={({ isActive }) => (isActive ? activeLink : normalLink)}
                      >
                        {link.icon}
                        <span className="capitalize">{link.name}</span>
                      </NavLink>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;