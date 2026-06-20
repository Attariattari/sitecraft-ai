import { CategoryCard } from "./CategoryCard";
import { siteCraftPersonalInfoCategories } from "@/lib/data";

export function CategorySelector({ selectedCategoryId, onSelectCategory }) {
  return (
    <div className="mb-10 w-full">
      {/* Required Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          What type of website are you building?
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
          Choose the category that best matches your goal. SiteCraft AI will
          customize your Personal Info fields based on this selection.
        </p>
        <p className="text-sm text-foreground/60 mt-1 font-medium italic">
          You can change this later.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
        {siteCraftPersonalInfoCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            isSelected={selectedCategoryId === category.id}
            onClick={onSelectCategory}
          />
        ))}
      </div>
    </div>
  );
}
