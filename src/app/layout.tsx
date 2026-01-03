// Third-party Imports
import "react-perfect-scrollbar/dist/css/styles.css";

// Type Imports
import type { ChildrenType } from "@core/types";

// Style Imports
import "@/app/globals.css";

// Generated Icon CSS Imports
import "@assets/iconify-icons/generated-icons.css";
import Toastify from "./toastify";

export const metadata = {
  title: "SignESL - A signfeed product",
  // description:
  //   'Vuexy - MUI Next.js Admin Dashboard Template - is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.'
};

const RootLayout = ({ children }: ChildrenType) => {
  // Vars
  const direction = "ltr";

  return (
    <html id="__next" lang="en" dir={direction}>
      <body className="flex is-full min-bs-full flex-auto flex-col">
        {children}
         <Toastify /> 
      </body>
    </html>
  );
};

export default RootLayout;
