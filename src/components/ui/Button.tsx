import React from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "destructive";
  startIcon?: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  className = "",
  startIcon,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center gap-2 px-4 py-[8px] rounded-md transition-transform active:scale-90 font-semibold";
  const variantStyles = {
    default:
      "bg-white text-[#262262] border-[1.5px] border-[#262262] hover:cursor-pointer",
    outline: "border border-[#0a063e] text-[#262262] bg-transparent ",
    ghost: "bg-transparent text-[#262262] hover:bg-gray-100 border border-[#262262]",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${inter.variable}`}
      {...props}
    >
      {startIcon && <span className="flex-shrink-0">{startIcon}</span>}
      {children}
    </button>
  );
};
