import MainnetHeader from "@/components/MainnetHeader/MainnetHeader";
import RouterPage from "@/components/RouterPage/RouterPage";

const MainnetRouterPage = () => (
  <div className="flex h-dvh flex-col overflow-y-auto bg-canvas">
    <MainnetHeader />
    <RouterPage />
  </div>
);

export default MainnetRouterPage;
