export const metadata = {
  title: "Pricing | SiteCraft AI",
  description: "Simple, transparent pricing for SiteCraft AI",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Pricing</h1>
        <p className="text-lg text-gray-600 mb-12">
          Simple, transparent pricing for everyone.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((plan) => (
            <div key={plan} className="border rounded-lg p-6 bg-white shadow-sm text-center">
              <h3 className="text-2xl font-bold mb-2">Plan {plan}</h3>
              <p className="text-4xl font-bold text-blue-600 mb-4">${plan * 10}</p>
              <ul className="space-y-2 mb-6 text-gray-600">
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Feature 3</li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
