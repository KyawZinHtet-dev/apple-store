export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen justify-center w-full items-center">
      {children}
    </div>
  );
}
