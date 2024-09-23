import SignUpForm from "@/app/ui/signup-form";

export default function SignUpPage() {
  return (
    <main className="flex items-center justify-center">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5">
        <SignUpForm />
      </div>
    </main>
  );
}
