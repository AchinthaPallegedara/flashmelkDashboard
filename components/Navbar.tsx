import React from "react";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";

import { ModeToggle } from "./mode-toggle";
import BreadcrumbArea from "./BreadcrumbArea";

const Navbar = () => {
  return (
    <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 w-full z-10">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          <BreadcrumbArea />
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
