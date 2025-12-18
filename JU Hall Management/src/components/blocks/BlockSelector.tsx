import { motion } from "framer-motion";
import { Building, Edit2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Block } from "@/hooks/useHallData";
import { cn } from "@/lib/utils";

interface BlockSelectorProps {
  blocks: Block[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onAddBlock?: () => void;
  onEditBlock?: (block: Block) => void;
  onDeleteBlock?: (blockId: string) => void;
  isSupervisor: boolean;
}

export function BlockSelector({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onAddBlock,
  onEditBlock,
  onDeleteBlock,
  isSupervisor,
}: BlockSelectorProps) {
  return (
    <div className="glass-card p-4 rounded-2xl mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Blocks</h3>
        </div>
        {isSupervisor && onAddBlock && (
          <Button
            size="sm"
            variant="outline"
            onClick={onAddBlock}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Block
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {blocks.map((block) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
          >
            <button
              onClick={() => onSelectBlock(block.id)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all duration-200",
                "border hover:border-primary/50",
                selectedBlockId === block.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/50 hover:bg-secondary border-transparent"
              )}
            >
              <span>Block {block.name}</span>
              {block.description && (
                <span className="ml-2 text-xs opacity-70">({block.description})</span>
              )}
            </button>
            
            {isSupervisor && selectedBlockId === block.id && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1 bg-background border rounded-lg p-1 shadow-lg z-10"
              >
                {onEditBlock && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditBlock(block);
                    }}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                )}
                {onDeleteBlock && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBlock(block.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
