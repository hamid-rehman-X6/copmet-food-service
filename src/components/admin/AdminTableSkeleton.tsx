import { Skeleton } from "@/components/common/Skeleton";

// Describes how each column's placeholder should look so one component can
// stand in for any admin table while preserving its column rhythm.
export type SkeletonColumn = "media" | "stack" | "text" | "badge" | "actions";

type AdminTableSkeletonProps = {
  columns: SkeletonColumn[];
  rows?: number;
};

function SkeletonCell({ kind }: { kind: SkeletonColumn }) {
  switch (kind) {
    case "media":
      // Thumbnail/avatar plus a two-line label.
      return (
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      );
    case "stack":
      // Two-line text cell (e.g. a reference with a timestamp beneath it).
      return (
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      );
    case "badge":
      return <Skeleton className="h-6 w-20 rounded-full" />;
    case "actions":
      return (
        <div className="flex items-center justify-end gap-1.5">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      );
    default:
      return <Skeleton className="h-3.5 w-20" />;
  }
}

// Renders placeholder rows that drop straight into an existing table <tbody>,
// matching the column layout passed in. Keeps the table chrome stable while the
// real rows load (no layout shift, better perceived performance).
export function AdminTableSkeleton({ columns, rows = 6 }: AdminTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((kind, columnIndex) => (
            <td className="px-6 py-5" key={columnIndex}>
              <SkeletonCell kind={kind} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
