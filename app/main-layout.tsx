import AppNav from "@/components/navigation/app-nav";
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" max-w-screen-lg mx-auto">
      <div className="sticky top-0 z-50">
        <AppNav />
      </div>
      <div className="px-3 mt-3">{children}</div>
    </div>
  );
};

export default MainLayout;
