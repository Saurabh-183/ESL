"use client";
import { useState } from "react";
import clsx from "clsx";

const AccordionSection = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b">
      <div
        className="flex justify-between items-center cursor-pointer px-3 py-2 transition"
        onClick={() => setOpen(!open)}
      >
        <h3 className="text-sm font-semibold">{title}</h3>
        <span
          className={clsx(
            "transition-transform duration-500",
            open ? "rotate-90" : "rotate-0"
          )}
        >
          ▶{/* <i className="tabler arrow-left"/> */}
        </span>
      </div>

      <div
        className={clsx(
          "transition-all duration-500 ease-in-out overflow-hidden",
          open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-3 py-2">{children}</div>
      </div>
    </div>
  );
};

export default AccordionSection;
