export const metadata = {
  title: "Templates | SiteCraft AI",
  description: "Explore our professional website templates",
};

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Templates</h1>
        <p className="text-lg text-gray-600 mb-12">
          Explore our collection of professionally designed website templates.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
              <h3 className="text-xl font-bold mb-2">Template {item}</h3>
              <p className="text-gray-600">Professional template for your portfolio</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
