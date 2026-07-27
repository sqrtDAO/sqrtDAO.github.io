import Logo from "@/components/Logo/Logo";
import { Button } from "@/components/Button/Button";

export default function LandingFooter() {
  return (
    <div className="relative flex w-full flex-col items-center gap-14 bg-canvas py-10">
      <div className="absolute left-0 top-[-53px] rounded-none bg-black p-[10px]">
        <Logo variant="complete" dark />
      </div>

      <div className="flex w-full items-center justify-center gap-6">
        <p className="w-[273px] text-h4 text-primary">
          Try it on the Base testnet.
          <br />
          Then tell us how it was.
        </p>
        <Button variant="primary" size="m">Try it on testnet</Button>
        <Button variant="outline" size="m">Join Discord</Button>
        <Button variant="outline" size="m">Follow on X</Button>
      </div>

      <img src="/landing/footer-headline.svg" alt="Give your token a beginning it can survive" className="h-[66px] w-[1300px]" />
    </div>
  );
}