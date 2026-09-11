import {
  Trash2,
  Star,
  StarOff,
  Archive,
  X,
} from "lucide-react";

import { Button } from "../../ui";

export default function ExperienceBulkActions({
  selectedCount,
  onFeature,
  onUnfeature,
  onArchive,
  onDelete,
  onClear,
}) {
  if (selectedCount === 0) return null;

  return (
    <div
      className="
        mb-6
        flex
        flex-wrap
        items-center
        justify-between
        gap-4
        rounded-3xl
        border
        border-indigo-500/20
        bg-indigo-500/10
        p-5
      "
    >
      <div className="font-medium">
        {selectedCount} experience
        {selectedCount > 1 ? "s" : ""} selected
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="secondary"
          icon={<Star size={16} />}
          onClick={onFeature}
        >
          Feature
        </Button>

        <Button
          variant="secondary"
          icon={<StarOff size={16} />}
          onClick={onUnfeature}
        >
          Unfeature
        </Button>

        <Button
          variant="secondary"
          icon={<Archive size={16} />}
          onClick={onArchive}
        >
          Archive
        </Button>

        <Button
          variant="danger"
          icon={<Trash2 size={16} />}
          onClick={onDelete}
        >
          Delete
        </Button>

        <Button
          variant="ghost"
          icon={<X size={16} />}
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}