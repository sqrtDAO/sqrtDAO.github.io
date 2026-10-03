import MainnetHeader from "@/components/MainnetHeader/MainnetHeader";
import MainnetFooter from "@/components/MainnetFooter/MainnetFooter";

const Label = ({ children }: { children: string }) => (
  <p className="bg-overlay px-4 py-2 text-body-s text-tertiary">{children}</p>
);

// Dev preview: mainnet header + both footer placements. html/body are overflow-hidden, so this page scrolls itself.
const MainnetShellPage = () => (
  <div className="flex h-dvh flex-col overflow-y-auto bg-canvas">
    <MainnetHeader />
    <main className="h-48" />
    <Label>Footer — placement=&quot;panel&quot; (inside app)</Label>
    <MainnetFooter placement="panel" />
    <Label>Footer — placement=&quot;landing&quot; (main landing)</Label>
    <div className="h-24" />
    <MainnetFooter placement="landing" />
  </div>
);

export default MainnetShellPage;
