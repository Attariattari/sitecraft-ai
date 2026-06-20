import { GenerateForm } from "@/components/generate/GenerateForm";

export const metadata = {
  title: "Generate Portfolio | SiteCraft AI",
  description: "Generate a professional portfolio website in seconds.",
};

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Simple Header */}
      <header className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-10 w-full">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              SiteCraft AI
            </span>
            <span className="text-sm font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
              Portfolio Generator
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            Create Your Portfolio
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Answer a few questions and pick your design to instantly generate a
            professional portfolio tailored to you.
          </p>
        </div>

        <div className="w-full">
          <GenerateForm />
        </div>
      </main>
    </div>
  );
}
