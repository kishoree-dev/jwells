import React, { useEffect, useRef } from 'react';

const DropdownMenu = ({ title, items, header, up, renderItem }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const menuElement = menuRef.current;

    const handleDropdownClick = (e) => {
      e.preventDefault();
      menuElement.querySelectorAll('.dropdown').forEach((dropdown) => {
        if (dropdown !== e.currentTarget.parentElement) {
          dropdown.classList.remove('active');
        }
      });
      e.currentTarget.parentElement.classList.toggle('active');
    };

    const handleOutsideClick = (e) => {
      if (!e.target.closest('.dropdown')) {
        menuElement.querySelectorAll('.dropdown').forEach((dropdown) => {
          dropdown.classList.remove('active');
        });
      }
    };

    const manageHoverFunctionality = () => {
      const isMobile = window.innerWidth <= 768;
      menuElement.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
        if (toggle.textContent === 'ALL COLLECTIONS') {
          toggle.parentElement.classList.remove('hover-enabled');
        } else if (isMobile) {
          toggle.addEventListener('click', handleDropdownClick);
          toggle.parentElement.classList.remove('hover-enabled');
        } else {
          toggle.parentElement.classList.add('hover-enabled');
          toggle.removeEventListener('click', handleDropdownClick);
        }
      });
    };

    window.addEventListener('resize', manageHoverFunctionality);
    document.addEventListener('click', handleOutsideClick);
    manageHoverFunctionality();

    return () => {
      window.removeEventListener('resize', manageHoverFunctionality);
      document.removeEventListener('click', handleOutsideClick);
      menuElement.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
        toggle.removeEventListener('click', handleDropdownClick);
      });
    };
  }, []);

  return (
    <li className="inline block relative text-[#41444B] hover:text-[#FFD700] z-2 font-[cinzel] font-medium text-[12px] dropdown" ref={menuRef}>
      <a className="dropdown-toggle">{title}</a>
      <div className={`dropdown-content h-fit ${up}`}>
        {header && <h3>{header}</h3>}
        {items.map((item, index) => (
          <div key={index}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </li>
  );
};

export default DropdownMenu;
