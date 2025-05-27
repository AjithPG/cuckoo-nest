'use client'
import Link from "next/link"
import { Poppins } from "next/font/google"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { SideNavBar } from "./SideNavBar"
import { useState } from "react"
import { MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

interface NavbarItemProps {
  href: string,
  children: React.ReactNode,
  isActive?: boolean,
}

const NavbarItem = ({href,children,isActive}:NavbarItemProps) => {
  return (
    <Link href={href} className={cn(" text-gray-800 hover:text-blue-500 text-sm font-medium", isActive && "text-blue-500")}>
      {children}
    </Link>
  )

}

const navbarItems = [
  {name:"About", href:"/about"},
  {name:"Contact", href:"/contact"},
]

export const Navbar = () => {
  const pathname = usePathname()
  const [isSideBarOpen,setIsSideBarOpen] = useState(false)
  return (
    <nav className="h-[64px] flex justify-between border-b bg-white px-4 py-2">
      <Link href="/" className="flex items-center  text-lg font-bold text-gray-800">
        <span className={cn("text-blue-500",poppins.className)}>Cuckoo Nest.</span>  
      </Link>
      <div className="w-full max-w-[400px] hidden lg:flex">
      <Input placeholder="Search here"/>
      </div>
      
      <div className="flex items-center gap-2 hidden lg:flex">
        {navbarItems.map((item) => (
          <NavbarItem key={item.name} href={item.href} isActive={pathname === item.href}> {item.name} </NavbarItem>
        ))}
        </div>
        <div className="flex lg:hidden items-center justify-center">
         <Button variant="ghost" className="size-12 border-transparent bg-white" onClick={()=>setIsSideBarOpen(true)}>
            <MenuIcon/>
         </Button>
        </div>
        <SideNavBar items={navbarItems} open={isSideBarOpen} onOpenChange={setIsSideBarOpen}/>
    </nav>
  )
}
