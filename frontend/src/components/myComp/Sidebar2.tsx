import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Separator } from "../ui/separator";
import { BookOpen, MessageCircle, Play, Star, Target } from "lucide-react";
import { User } from "types/user";
import { Link, useNavigate } from "react-router-dom";
import { useLogutUserMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/store";
import { logout } from "@/redux/slices/userSlice";
import { useToast } from "../ui/use-toast";
import { apiError } from "../../../helpers/apiError";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

type SidebarProps = {
  user?: User;
  isAuthenticated?: boolean;
};

const Sidebar2: FC<SidebarProps> = ({ user }) => {
  const [logutUser] = useLogutUserMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { toast } = useToast();

  const userName = user?.name.split(" ")[0].toLowerCase();

  const handleLogout = async () => {
    try {
      await logutUser().unwrap();

      dispatch(logout());
      navigate("/");
      navigate(0);

      toast({
        title: "Logged out successfully",
      });
    } catch (err) {
      console.log(err);

      if (apiError(err)) {
        toast({
          title: err.status.toString(),
          description: err.data.message,
        });
      }
    }
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <Avatar className="hover:animate-spin">
            <AvatarImage
              className="block cursor-pointer w-full h-full"
              src="https://img.icons8.com/?size=512&id=ObURygGyTKRQ&format=png"
              alt="avatar"
            />
            <AvatarFallback>
              <Menu />
            </AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent side="left" className="w-[235px]">
          <div className="-mt-3.5 text-lg">
            <Link to="/">
              <span className="text-destructive">Anime</span>
              <span className="text-muted-foreground">Pulse</span>
            </Link>
          </div>
          <div className="flex flex-col items-start justify-center gap-y-6 mt-6">
            <Button
              asChild
              variant="default"
              className="flex items-center justify-start gap-x-2 w-full"
            >
              <Link to="/dashboard">
                <Target />
                <span className="text-lg">Dashboard</span>
              </Link>
            </Button>
            <Separator />
            <Button
              asChild
              variant="ghost"
              className="flex items-center justify-start gap-x-2 w-full"
            >
              <Link to={`/${userName}/animelist`}>
                <Play />
                <span className="text-lg">Anime List</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="flex items-center justify-start gap-x-2 w-full"
            >
              <Link to={`/${userName}/mangalist`}>
                <BookOpen />
                <span className="text-lg">Manga List</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="flex items-center justify-start gap-x-2 w-full"
            >
              <Link to={`/${userName}/favorites`}>
                <Star />
                <span className="text-lg">Favorites</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="flex items-center justify-start gap-x-2 w-full"
            >
              <Link to={`/${userName}/reviews`}>
                <MessageCircle />
                <span className="text-lg">Reviews</span>
              </Link>
            </Button>
            <div className="flex items-center justify-center gap-x-3 w-full">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="secondary" className="w-full text-lg">
                    Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Don't worry your animelist and all the data related to
                      your account will stay. So, you can comeback again
                      anytime.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sidebar2;
