'use client'
import { sidebarLinks } from "@/constance";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const LeftSidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  return (
    <section className="left_sidebar">
      <nav className="flex flex-col gap-6">
        <Link
          href={"/"}
          className="flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center"
        >
          <Image src={"/icons/logo.svg"} alt="Logo" width={30} height={30} />
          <h1 className="text-24 font-extrabold text-white-1 max-lg:hidden">
            PodOrbit
          </h1>
        </Link>
        {sidebarLinks.map((item, i) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)
          return (
            <Link href={item.route} key={i} className={cn("flex gap-3 items-center py-4 max-lg:px-4 justify-center lg:justify-start",{
              "bg-nav-focus border-r-4 border-orange-1": isActive
            })}>
              <Image src={item.imgURL} alt={item.label} width={24} height={24}/>
              <p>{item.label}</p>
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default LeftSidebar;
