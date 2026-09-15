import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Callout, Code, H2, LI, P } from "@/components/Docs/prose";
import KeepReadingCard from "@/components/Blog/KeepReadingCard";
import { DISCORD_URL, X_URL } from "@/constants/links";
import { estimateReadTime } from "@/utils/read-time";
import { blogPostMetadata } from "../metadata";
import { getPost, postDate } from "../posts";

const SLUG = "how-we-fixed-fund-raising";

export const metadata: Metadata = blogPostMetadata(getPost(SLUG)!);

const COMPARE_ROWS: { metric: string; normal: string; epoch: string }[] = [
  {
    metric: "When supply arrives",
    normal: "All at once, on day one",
    epoch: "Small steps, every 24 hours, for a year",
  },
  {
    metric: "Best price goes to",
    normal: "Whichever bot is fastest",
    epoch: "Everyone in the same epoch, equally",
  },
  {
    metric: "The presale",
    normal: "One-day events, insider lists",
    epoch: "Open to everyone — commit to future epochs",
  },
  {
    metric: "Team funding",
    normal: "One lump sum, upfront",
    epoch: "Earned epoch by epoch",
  },
  {
    metric: "If the team disappears",
    normal: "Backers are stuck",
    epoch: "Backers just stop joining",
  },
  {
    metric: "Price pressure",
    normal: "One giant sell wave",
    epoch: "Steady buys plus permanent burns",
  },
];

const ExternalLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-accent underline-offset-4 hover:underline"
  >
    {children}
  </a>
);

const body = (
  <>
    <P>
      Hey there! Today we want to tell you the story behind sqrtDAO — why we
      think fund raising with tokens is broken, and how we fixed it. Short
      version: a launch should not be a one-minute sprint where bots win. We
      stretched the fundraising — it is continuous now.
    </P>

    <H2 id="what-usually-goes-wrong">What usually goes wrong</H2>
    <P>
      Most tokens never recover from their first minute. Raising funds with a
      token today forces everyone into the same broken script — for the project
      and for the people backing it:
    </P>
    <ul className="mt-5 list-disc space-y-2 pl-6">
      <LI>
        <b>Bots beat humans.</b> Bots buy the very first block, before any
        person can — then sell to everyone who came after.
      </LI>
      <LI>
        <b>Whales take over.</b> A few large wallets grab most of the supply at
        the lowest price and control the market.
      </LI>
      <LI>
        <b>One-shot raises.</b> Everything is raised in a single day and sits in
        a wallet one person controls — and once given, backers have no way to
        take it back from a team that went quiet.
      </LI>
      <LI>
        <b>Instant dumps.</b> The whole supply hits the market at once. Without
        enough buyers, the price falls and stays down.
      </LI>
    </ul>

    <H2 id="one-launch-many-epochs">One launch, spread across many epochs</H2>
    <P>
      Our fix is simple to say: launch is a moment, distribution is a process.
      Instead of everything happening on launch day, a launch becomes many
      small, fair epochs that unfold over time. An epoch is a 24-hour window —
      with 365 epochs that is a full year, though these are just example
      numbers: the founder sets the epoch length, the number of epochs and the
      total supply.
    </P>
    <P>
      During an epoch, anyone can put funds in. When it closes, that
      epoch&apos;s share of tokens goes out — and the epoch&apos;s funds are put
      to work, automatically. Miss an epoch? Join the next one — or commit to
      future epochs in advance. The launch never asks you to be fast. It asks
      you to show up.
    </P>

    <Callout>
      Open to everyone, no insider lists. Every epoch is a fresh start for
      whoever shows up that day.
    </Callout>

    <H2 id="price-discovery">Every epoch is its own little market</H2>
    <P>
      Nobody sets the price — one division at each close decides it. Funds in
      are the demand, tokens out are the supply, and the schedule fixes how many
      tokens each epoch releases:
    </P>
    <div className="mt-5 flex flex-col gap-3">
      <div>
        <Code>epoch price = all funds in / tokens released</Code>
      </div>
      <div>
        <Code>your tokens = your funds / epoch price</Code>
      </div>
    </div>
    <P>
      One price per epoch — the same for everyone in it — and a fresh price
      every 24 hours. No gas wars, no speed races, no secret deals. More
      believers in an epoch means a higher price that epoch; fewer means a
      cheaper one. The market sorts itself out, fairly.
    </P>

    <H2 id="where-the-funds-go">Where the funds go</H2>
    <P>
      Every epoch, a configurable share of the funds buys the token on the open
      market — and burns it. In our example launch that is 75% buy &amp; burn,
      with the remaining 25% going to the project. The founder decides how every
      epoch&apos;s funds divide, and the split is written into the launch
      itself.
    </P>
    <ul className="mt-5 list-disc space-y-2 pl-6">
      <LI>
        <b>Buy &amp; burn — pressure that never stops.</b> Every 24 hours, part
        of the locked funds buys the token and destroys it forever. Supply
        shrinks with every single epoch.
      </LI>
      <LI>
        <b>Project funding — steady, not sudden.</b> The team receives a steady
        stream spread across the whole launch. Enough to build full-time, never
        enough to vanish overnight.
      </LI>
    </ul>

    <Callout>
      The buy &amp; burn is baked into the contract — nobody can pause it,
      redirect it, or vote it away. And team income has to keep being earned,
      epoch by epoch, instead of arriving as one lump sum that can be mismanaged
      in month one.
    </Callout>

    <H2 id="side-by-side">A normal launch vs. an epoch launch</H2>
    <div className="mt-6 overflow-x-auto rounded-l border border-subtle">
      <table className="w-full min-w-140 border-collapse text-body">
        <thead>
          <tr className="bg-raised text-left">
            <th className="px-4 py-3 text-label font-medium uppercase tracking-wider text-tertiary">
              Metric
            </th>
            <th className="px-4 py-3 text-label font-medium uppercase tracking-wider text-tertiary">
              Normal launch
            </th>
            <th className="px-4 py-3 text-label font-medium uppercase tracking-wider text-tertiary">
              Epoch launch
            </th>
          </tr>
        </thead>
        <tbody>
          {COMPARE_ROWS.map((row) => (
            <tr key={row.metric} className="border-t border-subtle">
              <td className="px-4 py-3 align-top font-medium text-primary">
                {row.metric}
              </td>
              <td className="px-4 py-3 align-top text-secondary">
                {row.normal}
              </td>
              <td className="px-4 py-3 align-top text-accent">{row.epoch}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <H2 id="join-us">Come build with us</H2>
    <P>
      Back the projects you believe in. Launch yours the fair way. If you are
      building a project or a startup, reach out — we will happily help you run
      your launch in epochs, with funding that lasts as long as your work does.
    </P>
    <P>
      Say hi on <ExternalLink href={X_URL}>X</ExternalLink> or{" "}
      <ExternalLink href={DISCORD_URL}>Discord</ExternalLink>, or dive into the{" "}
      <Link
        href="/docs/"
        className="text-accent underline-offset-4 hover:underline"
      >
        docs
      </Link>{" "}
      to see how the contracts work under the hood.
    </P>
  </>
);

export default function BlogPostPage() {
  const post = getPost(SLUG);
  if (!post) notFound();

  return (
    <article className="mx-auto w-full max-w-3xl px-gutter py-12 sm:py-20">
      <p className="text-caption uppercase tracking-widest text-tertiary">
        {postDate(post)} · {estimateReadTime(body)}
      </p>
      <h1 className="mt-3 font-display text-h2 font-bold text-primary sm:text-h1">
        {post.title}
      </h1>
      <Image
        src={post.image}
        alt={post.title}
        width={1200}
        height={630}
        priority
        className="mt-8 w-full rounded-l border border-subtle"
      />

      {body}

      <KeepReadingCard />
    </article>
  );
}
