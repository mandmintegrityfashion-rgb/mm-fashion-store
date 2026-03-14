// components/Section.js
export default function Section({ title, bg = "bg-white", children }) {
  return (
    <section className={`${bg} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        <div className="">{children}</div>
      </div>
    </section>
  );
}
