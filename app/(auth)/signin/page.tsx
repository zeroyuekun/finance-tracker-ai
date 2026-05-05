import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to AI Finance Coach</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <Button type="submit" className="w-full" variant="outline">
              Continue with Google
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <form
            action={async (formData: FormData) => {
              "use server";
              const email = formData.get("email");
              if (typeof email !== "string") return;
              await signIn("resend", { email, redirectTo: "/dashboard" });
            }}
            className="flex flex-col gap-3"
          >
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="you@example.com" />
            <Button type="submit" className="w-full">Send magic link</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
