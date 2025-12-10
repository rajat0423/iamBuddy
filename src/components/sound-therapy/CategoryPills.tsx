import { Button } from "@/components/ui/button";
import type { SoundCategory } from "@/data/sound-therapy";
import { cn } from "@/lib/utils";

interface CategoryPillsProps {
    categories: SoundCategory[];
    selectedId: string;
    onSelect: (id: string) => void;
}

export default function CategoryPills({ categories, selectedId, onSelect }: CategoryPillsProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x pt-2">
            <Button
                variant={selectedId === 'all' ? "default" : "outline"}
                onClick={() => onSelect('all')}
                className="rounded-full flex-shrink-0 snap-start"
            >
                All Sounds
            </Button>
            {categories.map(cat => (
                <Button
                    key={cat.id}
                    variant={selectedId === cat.id ? "default" : "outline"}
                    onClick={() => onSelect(cat.id)}
                    className={cn("rounded-full flex-shrink-0 snap-start border-none bg-secondary/50 hover:bg-secondary",
                        selectedId === cat.id ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                    )}
                >
                    {cat.title}
                </Button>
            ))}
        </div>
    );
}
