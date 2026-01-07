import { useNavigate } from "react-router-dom";

interface TopHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function TopHeader({ title, showBack = true, onBack, rightAction }: TopHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 flex items-center bg-background/95 backdrop-blur-sm p-4 pb-2 justify-between border-b border-border">
      <div className="flex w-12 items-center justify-start">
        {showBack && (
          <button
            onClick={onBack ? onBack : () => navigate(-1)}
            className="flex size-10 items-center justify-center rounded-full hover:bg-muted transition-colors text-foreground"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        )}
      </div>

      <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center truncate">
        {title}
      </h2>

      <div className="flex w-12 items-center justify-end">
        {rightAction}
      </div>
    </header>
  );
}
