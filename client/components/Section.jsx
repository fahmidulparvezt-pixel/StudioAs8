export function Section({ children, className = "" }) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="mx-auto w-full max-w-7xl px-4">{children}</div>
    </section>
  );
}

export function SectionHeading({ title, subtitle }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <h2 className="text-3xl font-extrabold md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base-content/70">{subtitle}</p>}
    </div>
  );
}
