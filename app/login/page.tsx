import LoginForm from "@/app/ui/login-form";

export default function Loginpage() {
  return (
    <main className="flex items-center justify-center">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5">
        <LoginForm />
      </div>
    </main>
  );
}
