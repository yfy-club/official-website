export function PageHero({
  eyebrow,
  title,
  subtitle,
  intro,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro?: string;
}) {
  return (
    <header className="page-hero">
      <p className="caps page-hero__eyebrow">{eyebrow}</p>
      <h1 className="display-latin page-hero__title">{title}</h1>
      <p className="page-hero__subtitle">{subtitle}</p>
      {intro && <p className="page-hero__intro">{intro}</p>}
    </header>
  );
}
