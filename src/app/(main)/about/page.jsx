export const metadata = {
  title: "About | SiteCraft AI",
  description: "Learn about SiteCraft AI and our mission",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About SiteCraft AI</h1>
        <p className="text-lg text-gray-600 mb-8">
          Our mission is to empower creators to build beautiful, professional portfolios effortlessly.
        </p>
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              SiteCraft AI was founded with a vision to democratize web design and make it accessible to everyone, regardless of technical skill.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Values</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Simplicity - Make complex things simple</li>
              <li>• Innovation - Stay at the forefront of technology</li>
              <li>• Quality - Never compromise on quality</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
