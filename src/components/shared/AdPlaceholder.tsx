import FeaturedWidgets from "./FeaturedWidgets";

interface AdPlaceholderProps {
  position: "header" | "sidebar" | "in-article" | "footer";
  className?: string;
  adSlot?: string;
}

export default function AdPlaceholder({ position, className = "" }: AdPlaceholderProps) {
  // Directly render compliant featured widgets, resolving placeholder layout requirements
  return <FeaturedWidgets position={position} className={className} />;
}
