import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Welcome back, {session.user.name ?? session.user.email}</h1>
        <SignOutButton />
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard placeholder</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Phase 1 is live. Phase 2 will add transactions and categorization.
        </CardContent>
      </Card>
    </main>
  );
}
