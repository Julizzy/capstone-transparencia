import * as React from "react";
import { cn } from "@/lib/utils";

// 🧱 Contenedor principal de la tarjeta
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-white text-gray-900 shadow-sm hover:shadow-md transition-shadow",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// 🔹 Encabezado de la tarjeta (título o icono)
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 flex flex-col gap-1", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

// 🔸 Cuerpo o contenido de la tarjeta
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-4 pb-4 text-sm", className)} {...props} />
));
CardContent.displayName = "CardContent";

// 🏷️ Pie de la tarjeta (opcional)
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-end p-4 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// 🧭 Título del card
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight text-lg text-blue-700", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// 📝 Descripción o texto secundario
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 mt-1", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// Exportación para poder importar todo junto
export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
};
