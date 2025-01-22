export function ResumeNumbers({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="w-48 h-24 flex flex-col gap-3 rounded-xl bg-accent p-4">
      <strong className="font-semibold text-3xl">{title}</strong>
      <span className="text-lg">{desc}</span>
    </div>
  );
}
