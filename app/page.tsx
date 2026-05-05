import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">AI Finance Coach</h1>
        <p className="max-w-xl text-muted-foreground">
          A conversational AI advisor grounded in real finance frameworks.
          Tracks your spending and gives advice tailored to your goals — not vibes.
        </p>
      </div>
      <Button asChild>
        <Link href="/signin">Get started</Link>
      </Button>
    </main>
  );
}
