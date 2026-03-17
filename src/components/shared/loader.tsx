interface props {
  className?: string;
}

function BarLoader() {
  return (
    <div className="flex items-end gap-1 h-6">
      <div className="w-1.5 h-4 bg-primary animate-[bounce_1s_infinite]" />
      <div className="w-1.5 h-6 bg-primary animate-[bounce_1s_infinite_0.2s]" />
      <div className="w-1.5 h-5 bg-primary animate-[bounce_1s_infinite_0.4s]" />
    </div>
  );
}

export function Loader({ className }: props) {
  return (
    <div className={`${className}`}>
      <BarLoader />
    </div>
  );
}
