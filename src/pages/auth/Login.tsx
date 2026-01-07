import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthActions } from "@convex-dev/auth/react";

import { LoginSchema, type LoginValues } from "../../lib/validations/auth";
import CustomFormField, { FormFieldType } from "../../components/form/CustomFormField";
import { Form } from "../../components/ui/form";
import { Button } from "../../components/ui/button";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const { signIn } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("password", {
        email: values.email,
        password: values.password,
        flow: "signIn",
      });
      // Redirect handled by AuthWrapper or effectively we are signed in.
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f6f6f8] dark:bg-black font-display flex items-center justify-center min-h-screen p-4 sm:p-0">
      <div className="relative flex h-full w-full max-w-100 flex-col bg-white dark:bg-[#101622] sm:rounded-2xl sm:shadow-xl sm:h-auto sm:min-h-200 overflow-hidden transition-colors">

        {/* Header */}
        <div className="flex flex-col items-center pt-10 pb-2 px-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 overflow-hidden shadow-sm">
            <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAF4SYn6rzX1a6fwvuLf6ii5JEa8HQ5Fkv-JRmZud9szGWp-3wj5i-qOocKQRVUx_SBSz9Y2-mbbI83KC4ny6i9y_nmpVdNU1Z3vjP4gdSJKQIY004wAMqd04fw7xHk8v7680_mIpF9XnA9elUPGTb4OuGRWwTMxg1j9H4AinhKSiT7yURvLBe2l39HvLRQoZa5Cu2u1wszUAxvT8t4sgGhIY8io2DeFF9s2eC6c2-Wbf5fvptvlab366MR5v99Zt2AUEVZDRbeQg")' }}></div>
          </div>
          <h1 className="text-slate-900 dark:text-white tracking-tight text-[28px] font-bold leading-tight text-center">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal pt-2 text-center">Login to continue learning</p>
        </div>

        {/* Form */}
        <div className="px-6 pt-8 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email Address"
                placeholder="name@example.com"
                disabled={isLoading}
                type="email"
                autoFocus={true}
              />

              <div className="space-y-1">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Enter password"
                  disabled={isLoading}
                  type="password"
                />
                <div className="text-right">
                    <a href="#" className="text-xs text-primary font-medium hover:underline">Forgot Password?</a>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <Button
                type="submit"
                className="mt-4 w-full bg-primary hover:bg-blue-700 text-white font-bold h-12 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="mt-auto pb-8 px-6 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline decoration-2 underline-offset-2">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

