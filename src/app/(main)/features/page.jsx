export const metadata = {
  title: "Features | SiteCraft AI",
  description: "Powerful features to create your perfect portfolio",
};

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Features</h1>
        <p className="text-lg text-gray-600 mb-12">
          Everything you need to create a stunning portfolio.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4, 5, 6].map((feature) => (
            <div key={feature} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="w-12 h-12 bg-blue-600 rounded-lg mb-4"></div>
              <h3 className="text-xl font-bold mb-2">Feature {feature}</h3>
              <p className="text-gray-600">Description of the feature and its benefits</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
