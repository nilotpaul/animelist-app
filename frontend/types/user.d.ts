export type User = {
  id: string;
  name: string;
  email: string;
};

export type GetUser = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type UserRegisterBody = {
  name: string;
  email: string;
  password: string;
  confirmp: string;
};

export type UserLoginBody = {
  email: string;
  password: string;
};

export type Message = {
  message: string;
};
