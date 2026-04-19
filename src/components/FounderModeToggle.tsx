import { Switch } from "@/components/ui/switch";
import { useFounderMode } from "@/hooks/useFounderMode";

export function FounderModeToggle() {
  const { isFounderMode, toggleFounderMode } = useFounderMode();
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">👨‍💻 Dev</span>
      <Switch checked={isFounderMode} onCheckedChange={toggleFounderMode} />
      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">🚀 Founder</span>
    </div>
  );
}
