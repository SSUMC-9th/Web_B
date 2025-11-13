export default function CommentSkeleton() {
  return (
    <div className="rounded-xl bg-white/5 p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-8 w-8 rounded-full bg-white/10" />
        <div className="h-3 w-24 rounded bg-white/10" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-11/12 rounded bg-white/10" />
        <div className="h-3 w-10/12 rounded bg-white/10" />
        <div className="h-3 w-8/12 rounded bg-white/10" />
      </div>
    </div>
  );
}
