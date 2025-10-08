import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { postSignup } from "../apis/auth";

const schema = z
  .object({
    email: z.email({ message: "올바른 형식이 아닙니다" }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야합니다" })
      .max(20, { message: "비밀번호는 20자 이하여야합니다." }),

    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상이어야합니다" })
      .max(20, { message: "비밀번호는 20자 이하여야합니다." }),
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
  })
  .refine((data) => data.password == data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    //console.log(data);
    const { passwordCheck, ...rest } = data;

    const response = await postSignup(rest);

    console.log(response);
  };

  return (
    <>
      {/* 이메일 */}
      <div className="space-y-1.5">
        <input
          {...register("email")}
          type="email"
          placeholder="이메일을 입력해주세요!"
          className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder-gray-500 outline-none transition
              ${
                errors?.email
                  ? "border-red-500 bg-red-500/10 focus:ring-2 focus:ring-red-500"
                  : "border-white/20 focus:border-white/30 focus:ring-2 focus:ring-pink-500/50"
              }`}
        />
        {errors.email && (
          <div className={"text-red-500 text-sm"}>{errors.email.message}</div>
        )}
      </div>

      {/* 비밀번호 */}
      <div className="mt-3 space-y-1.5">
        <input
          {...register("password")}
          type="password"
          placeholder="비밀번호를 입력해주세요!"
          className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder-gray-500 outline-none transition
              ${
                errors?.password
                  ? "border-red-500 bg-red-500/10 focus:ring-2 focus:ring-red-500"
                  : "border-white/20 focus:border-white/30 focus:ring-2 focus:ring-pink-500/50"
              }`}
        />
        {errors.password && (
          <div className={"text-red-500 text-sm"}>
            {errors.password.message}
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1.5">
        <input
          {...register("passwordCheck")}
          type="password"
          placeholder="비밀번호 확인"
          className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder-gray-500 outline-none transition
              ${
                errors?.passwordCheck
                  ? "border-red-500 bg-red-500/10 focus:ring-2 focus:ring-red-500"
                  : "border-white/20 focus:border-white/30 focus:ring-2 focus:ring-pink-500/50"
              }`}
        />
        {errors.passwordCheck && (
          <div className={"text-red-500 text-sm"}>
            {errors.passwordCheck.message}
          </div>
        )}
      </div>

      {/* name */}
      <div className="mt-3 space-y-1.5">
        <input
          {...register("name")}
          type="name"
          placeholder="이름"
          className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder-gray-500 outline-none transition
              ${
                errors?.name
                  ? "border-red-500 bg-red-500/10 focus:ring-2 focus:ring-red-500"
                  : "border-white/20 focus:border-white/30 focus:ring-2 focus:ring-pink-500/50"
              }`}
        />

        {errors.name && (
          <div className={"text-red-500 text-sm"}>{errors.name.message}</div>
        )}
      </div>

      {/* 로그인 버튼 */}
      <button
        disabled={isSubmitting}
        type="button"
        onClick={handleSubmit(onSubmit)}
        //disabled={isDisabled}
        className="mt-4 w-full rounded-md bg-pink-600 py-3 text-sm font-medium text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
      >
        회원가입
      </button>
    </>
  );
};

export default SignupPage;
