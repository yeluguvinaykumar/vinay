export function LegalContent({ sections, updated }: { sections: { title: string; body: string }[]; updated: string }) {
  return (
    <section className="section-pad">
      <div className="container-site mx-auto max-w-3xl">
        <p className="mb-8 text-sm text-muted-foreground">
          Last updated: <span className="font-semibold text-foreground">{updated}</span>
        </p>
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title} className="prose-vinay">
              <h2>{s.title}</h2>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}