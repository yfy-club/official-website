import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function Home() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-svh w-full max-w-container flex-col px-gutter-sm py-6 md:px-gutter-md lg:px-gutter-lg"
    >
      <header className="flex items-center justify-between border-b border-border pb-4">
        <span className="caps text-fg-muted">YFY / 2014—NOW</span>
        <ThemeToggle />
      </header>

      <section className="flex flex-1 flex-col justify-center py-section">
        <p className="caps mb-5 text-accent">Trajectory / 航迹</p>
        <h1 className="display-latin text-display-1 text-fg">
          We Code
          <br />
          the Future
        </h1>
        <p className="mt-8 max-w-reading text-body-lg text-fg-muted">
          云飞扬社团重构工程已经启航。伟大的想法，始于单行代码。
        </p>
      </section>
    </main>
  );
}
