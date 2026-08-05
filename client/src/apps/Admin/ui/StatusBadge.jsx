import {
  CheckCircle2,
  Clock3,
  Archive,
  PauseCircle,
  AlertCircle,
} from "lucide-react";

import Badge from "./Badge";

const statusMap = {
  Completed: {
    variant: "success",
    icon: <CheckCircle2 size={14} />,
  },

  "In Progress": {
    variant: "info",
    icon: <Clock3 size={14} />,
  },

  Archived: {
    variant: "gray",
    icon: <Archive size={14} />,
  },

  Draft: {
    variant: "warning",
    icon: <PauseCircle size={14} />,
  },

  Published: {
    variant: "success",
    icon: <CheckCircle2 size={14} />,
  },

  Pending: {
    variant: "warning",
    icon: <Clock3 size={14} />,
  },

  Failed: {
    variant: "danger",
    icon: <AlertCircle size={14} />,
  },
};

const defaultStatus = {
  variant: "gray",
  icon: <AlertCircle size={14} />,
};

export default function StatusBadge({
  status,
  size = "md",
}) {
  const currentStatus = status || "Unknown";

  const config =
    statusMap[currentStatus] || defaultStatus;

  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      size={size}
    >
      {currentStatus}
    </Badge>
  );
}