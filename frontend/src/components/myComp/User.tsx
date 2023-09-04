import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserLoginBody, UserRegisterBody } from "types/user";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { apiError } from "../../../helpers/apiError";
import {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUserQuery,
} from "@/redux/api/authApi";
import { setUser } from "@/redux/slices/userSlice";
import { useAppDispatch } from "@/redux/store";

const User: FC = () => {
  const { status } = useGetUserQuery();

  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "fulfilled") {
      navigate("/dashboard");
    }
  }, [navigate, status]);

  const registerSchema: z.ZodType<UserRegisterBody> = z
    .object({
      name: z.string().nonempty().min(6).max(20),
      email: z.string().nonempty().email().max(40),
      password: z.string().nonempty().min(6).max(40),
      confirmp: z.string().nonempty().min(6).max(40),
    })
    .refine(({ password, confirmp }) => password === confirmp, {
      message: "Invalid credentials",
      path: ["confirmp"],
    });

  const loginSchema: z.ZodType<UserLoginBody> = z.object({
    email: z.string().nonempty().email().min(6).max(20),
    password: z.string().nonempty().min(6).max(40),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterBody>({
    resolver: zodResolver(registerSchema),
  });

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    formState: { errors: errs, isSubmitting: isSubmitting2 },
  } = useForm<UserLoginBody>({
    resolver: zodResolver(loginSchema),
  });

  const [registerUser, { error: registerError }] = useRegisterUserMutation();
  const [loginUser, { error: loginError }] = useLoginUserMutation();

  const registerSubmit: SubmitHandler<UserRegisterBody> = async (formData) => {
    try {
      const res = await registerUser(formData).unwrap();

      dispatch(setUser(res));

      reset();
      if (!registerError) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
      if (apiError(err)) {
        toast({
          variant: "destructive",
          title: err.status.toString(),
          description: err.data.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
    }
  };

  const loginSubmit: SubmitHandler<UserLoginBody> = async (formData) => {
    try {
      const res = await loginUser(formData).unwrap();

      dispatch(setUser(res));
      localStorage.setItem("user", JSON.stringify(res));

      reset2();
      if (!loginError) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);

      if (apiError(err)) {
        toast({
          variant: "destructive",
          title: err.status.toString(),
          description: err.data.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(90vh_-_3.5rem)]">
      <Tabs defaultValue="Register" className="w-[25rem]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Register">Register</TabsTrigger>
          <TabsTrigger value="Login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="Register">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Register</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(registerSubmit)}>
                <div>
                  <Label className="dark:text-gray-200">Enter name</Label>
                  <Input
                    placeholder="name"
                    type="text"
                    className="mt-1"
                    {...register("name")}
                  />
                  <span className="text-xs text-destructive ml-2">
                    {errors.name?.message}
                  </span>
                </div>
                <div>
                  <Label className="dark:text-gray-200">Enter email</Label>
                  <Input
                    placeholder="email"
                    type="text"
                    className="mt-1"
                    {...register("email")}
                  />
                  <span className="text-xs text-destructive ml-2">
                    {errors.email?.message}
                  </span>
                </div>
                <div>
                  <Label className="dark:text-gray-200">Enter password</Label>
                  <Input
                    placeholder="password"
                    type="password"
                    className="mt-1"
                    {...register("password")}
                  />
                  <span className="text-xs text-destructive ml-2">
                    {errors.password?.message}
                  </span>
                </div>
                <div>
                  <Label className="dark:text-gray-200">
                    Enter confirm password
                  </Label>
                  <Input
                    placeholder="confirm password"
                    type="password"
                    className="mt-1"
                    {...register("confirmp")}
                  />
                  <span className="text-xs text-destructive ml-2">
                    {errors.confirmp?.message}
                  </span>
                </div>
                <div>
                  <Button
                    type="submit"
                    className="w-full mt-5 flex items-center justify-center text-center"
                  >
                    {!isSubmitting && <span>Sign up</span>}
                    {isSubmitting && (
                      <span className="relative flex items-center justify-center after:content-[''] after:border-2 after:w-4 after:h-4 after:border-transparent after:border-t-secondary after:rounded-full after:animate-spin" />
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Login">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit2(loginSubmit)}>
                <div>
                  <Label className="dark:text-gray-200">Enter email</Label>
                  <Input
                    type="text"
                    placeholder="email"
                    className="mt-1"
                    {...register2("email")}
                  />
                  <span className="text-xs text-destructive ml-2">
                    {errs.email?.message}
                  </span>
                </div>
                <div>
                  <Label className="dark:text-gray-200">Enter password</Label>
                  <Input
                    type="password"
                    placeholder="password"
                    className="mt-1"
                    {...register2("password")}
                  />
                  <span className="text-xs text-destructive ml-2">
                    {errs.password?.message}
                  </span>
                </div>
                <div>
                  <Button type="submit" className="w-full mt-1">
                    {!isSubmitting2 && <span>Login</span>}
                    {isSubmitting2 && (
                      <span className="relative flex items-center justify-center after:content-[''] after:border-2 after:w-4 after:h-4 after:border-transparent after:border-t-secondary after:rounded-full after:animate-spin" />
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default User;
