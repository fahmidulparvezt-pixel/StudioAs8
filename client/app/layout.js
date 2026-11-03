import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthSync from "@/components/AuthSync";

export const metadata = {
  title: "StudioSpace | Book creative studios by the hour",
  description: "Discover and book photo studios, sound stages, podcast lounges and music suites from local hosts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="caramellatte" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("ss-theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}` }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" />
        <AuthSync />
      </body>
    </html>
  );
}
