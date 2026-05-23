import "@/styles/components/skeleton.css";

interface Props {
  lines?: number;
  height?: number;
}

export default function SkeletonCard({ lines = 3, height = 120 }: Props) {
  return (
    <div className="skeleton-card" style={{ minHeight: height }}>
      <div className="skeleton-line skeleton-line--title" />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <div
          key={i}
          className="skeleton-line"
          style={{ width: `${85 - i * 15}%` }}
        />
      ))}
    </div>
  );
}
