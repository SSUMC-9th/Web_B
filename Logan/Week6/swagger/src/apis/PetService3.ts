interface User {
  id?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  userStatus?: number;
}

export const api = async ({
  id,
  username,
  firstName,
  lastName,
  email,
  password,
  phone,
  userStatus,
}: User): Promise<void> => {
  const response = await fetch("/user", {
    method: "POST",
    body: JSON.stringify({
      id,
      username,
      firstName,
      lastName,
      email,
      password,
      phone,
      userStatus,
    }),
  });
};
