import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface truncketTooltipProps {
  text: string;
  maxWidth?: string;
  tooltipMaxWidth?: string;
  tooltipSide?: React.ComponentProps<typeof TooltipContent>["side"];
  className?: string;
  fallback?: string;
}

function TruncateTextTooltip({
  text,
  maxWidth = "max-w-[200px]",
  tooltipMaxWidth = "max-w-[400px]",
  tooltipSide = "top",
  className,
  fallback = "-",
}: truncketTooltipProps) {
  const [open, setOpen] = useState(false);

  if (!text) {
    return <span>{fallback}</span>;
  }
  return (
    <Tooltip open={open} onOpenChange={setOpen} delayDuration={0}>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "truncate cursor-pointer touch-manipulation",
            maxWidth,
            className,
          )}
          onClick={() => setOpen(!open)}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {text}
        </div>
      </TooltipTrigger>
      <TooltipContent
        side={tooltipSide}
        className={cn("wrap-break-word", tooltipMaxWidth)}
        sideOffset={8}
        onPointerDownOutside={() => setOpen(false)}
      >
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

export default TruncateTextTooltip;
