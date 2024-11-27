import NavBar from "@/modules/common/components/nav-bar/nav-bar";
import ModuleHeaderWrapper from "@/modules/common/components/module-header/module-header-wrapper/module-header-wrapper";


export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="home-layout">
        <NavBar/>
        <div className="home-main">
          <ModuleHeaderWrapper/>
          <div className="home-content">
            {children}
          </div>
        </div>
      </div>
  );
}
