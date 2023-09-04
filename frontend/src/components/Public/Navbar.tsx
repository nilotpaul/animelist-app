import { FC, forwardRef } from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { BookOpen, Clapperboard } from "lucide-react";
import { NavHashLink } from "react-router-hash-link";
import Sidebar2 from "../myComp/Sidebar2";
import { useAppSelector } from "@/redux/store";

const Navbar: FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.userSlice);

  return (
    <nav className="dark:bg-[#09090B] flex items-center justify-center h-[--header-height] border-b-[1px] shadow-lg">
      <div className="main_container flex items-center justify-between w-full h-full">
        <div className="text-xl">
          <Link to="/">
            <span className="text-red-500">Anime</span>
            <span className="text-muted-foreground">Pulse</span>
          </Link>
        </div>
        <NavigationMenu className={!isAuthenticated ? "" : cn("mr-14")}>
          <NavigationMenuList className="flex items-center justify-center">
            <NavigationMenuItem>
              <Button asChild variant="ghost" className="text-base">
                <Link to="/" className="line-clamp-2 leading-snug">
                  Home
                </Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base">
                Search
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex justify-center gap-x-4 items-center py-2 pt-4 w-[15rem]">
                  <NavigationMenuLink asChild>
                    <Link to="/">
                      <Clapperboard size={26} />
                    </Link>
                  </NavigationMenuLink>

                  <div className="space-y-2">
                    <li className="text-base">
                      <NavigationMenuLink asChild>
                        <Link to="/anime">Anime</Link>
                      </NavigationMenuLink>
                    </li>
                    <li className="space-x-2 text-sm">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/anime/#animebysearch"
                          className="text-muted-foreground hover:text-secondary-foreground"
                        >
                          Search
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <NavHashLink
                          smooth
                          to="/anime#goats"
                          className="text-muted-foreground hover:text-secondary-foreground"
                        >
                          Goats
                        </NavHashLink>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <NavHashLink
                          to="/anime#seasonal"
                          className="text-muted-foreground hover:text-secondary-foreground"
                        >
                          Seasonal
                        </NavHashLink>
                      </NavigationMenuLink>
                    </li>
                  </div>
                </ul>
                <ul className="flex justify-center gap-x-4 items-center py-2 pb-4 w-[16rem]">
                  <NavigationMenuLink asChild>
                    <Link to="/">
                      <BookOpen size={26} />
                    </Link>
                  </NavigationMenuLink>

                  <div className="space-y-2">
                    <li className="text-base">
                      <NavigationMenuLink asChild>
                        <Link to="/">Manga</Link>
                      </NavigationMenuLink>
                    </li>
                    <li className="space-x-2 text-sm">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/"
                          className="text-muted-foreground hover:text-secondary-foreground"
                        >
                          Search
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/anime/#goats"
                          className="text-muted-foreground hover:text-secondary-foreground"
                        >
                          Goats
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/"
                          className="text-muted-foreground hover:text-secondary-foreground"
                        >
                          Top Manga
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </div>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button asChild variant="ghost" className="text-base">
                <Link
                  to="https://github.com/nilotpaul"
                  className="line-clamp-2 leading-snug"
                >
                  GitHub
                </Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {!isAuthenticated ? (
          <Button asChild variant="outline" className="w-fit">
            <Link to="/user">Login / SignUp</Link>
          </Button>
        ) : (
          <Sidebar2 user={user!} isAuthenticated={isAuthenticated} />
        )}
      </div>
    </nav>
  );
};

const ListItem = forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
