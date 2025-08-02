import React from "react";
import { BiCaretDown } from "react-icons/bi";

const NavTitle = ({ children, icons }) => {
  return (
    <div className="flex items-center justify-between pb-5">
      {icons ? (
        <>
          <h3 className="font-bold lg:text-xl text-primeColor">{children}</h3>
          {icons && <BiCaretDown />}
        </>
      ) : (
        <>
          <h3 className="font-bold lg:text-xl text-primeColor">{children}</h3>
        </>
      )}
    </div>
  );
};

export default NavTitle;
