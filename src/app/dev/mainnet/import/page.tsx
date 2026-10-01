import MainnetHeader from "@/components/MainnetHeader/MainnetHeader";
import ImportToken from "@/components/ImportToken/ImportToken";

const MainnetImportPage = () => (
  <div className="flex h-dvh flex-col overflow-y-auto bg-canvas">
    <MainnetHeader />
    <ImportToken />
  </div>
);

export default MainnetImportPage;
