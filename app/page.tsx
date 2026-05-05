import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold">AI Finance Coach</h1>
      <p className="text-muted-foreground">Conversational, framework-grounded budgeting.</p>
      <Button>Get started</Button>
    </main>
  );
}
