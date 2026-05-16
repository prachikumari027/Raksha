import { Button } from "@/components/ui/button";
import Head from 'next/head'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <Button variant="destructive">ShadCN is working 🚀</Button>
    </main>
  );
}
