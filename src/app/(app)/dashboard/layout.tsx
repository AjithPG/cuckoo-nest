
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-[250px_1fr_250px] h-[calc(100vh-64px)]">
      {children}
    </div>
  );
};

export default DashboardLayout;
