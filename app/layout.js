import "./globals.css";

export const metadata = {
  title: "Nuvo Rodent Guard",
  description: "Sales calculator",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nuvo",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col items-center bg-[#f8f8f8] text-[#111]">
        <div className="w-full max-w-[430px] flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
