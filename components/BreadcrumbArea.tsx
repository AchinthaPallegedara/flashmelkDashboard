"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import Link from "next/link";

import { usePathname } from "next/navigation";

export function GetPath() {
  const url = usePathname();
  return url;
}

const BreadcrumbArea = () => {
  const url = GetPath();

  const pathNames = url
    .split("/")
    .filter((x) => x)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase());

  const lastItem = pathNames[pathNames.length - 1];
  pathNames.pop();

  let newUrl = "";

  return (
    <>
      <Breadcrumb className="hidden md:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/`}>Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />

          {pathNames.map((item, index) => {
            newUrl = newUrl + "/" + item.toLowerCase();

            return (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`${newUrl}`}>{item}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            );
          })}
          <BreadcrumbItem>
            <BreadcrumbPage>{lastItem}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

export default BreadcrumbArea;
