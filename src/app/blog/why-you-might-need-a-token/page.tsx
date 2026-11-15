import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Callout, H2, LI, P } from "@/components/Docs/prose";
import InvestmentDiagram from "@/components/Blog/InvestmentDiagram";
import KeepReadingCard from "@/components/Blog/KeepReadingCard";
import PayoutPanel from "@/components/Blog/PayoutPanel";
import TokenUsesPanel from "@/components/Blog/TokenUsesPanel";
import { DISTRIBUTION_LAUNCH_HREF } from "@/constants/links";
import { estimateReadTime } from "@/utils/read-time";
import { blogPostMetadata } from "../metadata";
import { getPost, postDate } from "../posts";

const SLUG = "why-you-might-need-a-token";

export const metadata: Metadata = blogPostMetadata(getPost(SLUG)!);

const link = "text-accent underline-offset-4 hover:underline";

const body = (
  <>
    <P>
      Every founder eventually asks the same question: do I need a token? Not
      always. A token is not a magic growth button. But it can do one thing a
      bank loan or a VC cheque cannot — let many people share the risk of your
      project, and the reward if it works.
    </P>

    <H2 id="investment-in-one-picture">Investment, in one picture</H2>
    <P>
      Investment is simple: someone gives you money today for a share of what
      you build tomorrow. They accept the risk because the upside can be bigger
      than the money they put in.
    </P>
    <InvestmentDiagram />
    <P>
      A token does the same job on the internet. Instead of one investor and one
      contract, you have many holders and a token that records who owns what.
    </P>

    <H2 id="what-a-token-changes">What a token changes</H2>
    <ul className="mt-5 list-disc space-y-3 pl-6">
      <LI>
        <b>The risk is shared.</b> If the project fails, the loss is spread
        across many people instead of sitting on one backer.
      </LI>
      <LI>
        <b>Investors can profit, so they invest.</b> You get money to work on
        the project without a loan deadline or a board breathing down your
        neck. The people who believe in you put up the capital.
      </LI>
      <LI>
        <b>The trade-off: you split the profit.</b> You keep a smaller slice.
        The bet is that the slice grows because more people want the project to
        win.
      </LI>
    </ul>

    <Callout>
      You are not just giving away money. You are buying reach, alignment, and a
      smaller share of a project that can grow much bigger.
    </Callout>

    <H2 id="where-most-launches-fail">Where most launches fail</H2>
    <P>
      Most ICOs and traditional token launches sell the whole supply at once.
      That turns launch day into a race:
    </P>
    <ul className="mt-5 list-disc space-y-2 pl-6">
      <LI>
        <b>Bots win.</b> They buy the first block before any person can, then
        sell to everyone who came after.
      </LI>
      <LI>
        <b>Whales take over.</b> A few large wallets grab most of the supply at
        the lowest price.
      </LI>
      <LI>
        <b>Everything happens in one day.</b> There is no time for a fair price
        to form, or for most people to show up.
      </LI>
      <LI>
        <b>The dump follows.</b> The whole supply hits the market at once, and
        the price falls and stays down.
      </LI>
    </ul>
    <P>
      We already wrote the full story in{" "}
      <Link href="/blog/how-we-fixed-fund-raising/" className={link}>
        How we fixed fund raising
      </Link>
      . The short version: distribution should be a process, not a moment.
      Spreading the launch across small epochs gives the market time to show up
      and gives participants a reason to trust the rules.
    </P>

    <H2 id="what-your-token-can-do">What will your token actually do?</H2>
    <P>
      A token needs a job. “It goes up” is not a job. Pick one or two that are
      true for your project:
    </P>
    <TokenUsesPanel />
    <P>
      If none of these fit, you probably do not need a token yet. That is a
      useful answer too.
    </P>

    <H2 id="how-to-share-the-upside">How to share the upside</H2>
    <P>
      Investors put money in because they expect something back. You choose how
      that works — and you write it down before anyone buys.
    </P>
    <PayoutPanel />
    <P>
      Whichever you choose, make it verifiable. A promise in a blog post is
      marketing. A rule in a contract is trust.
    </P>

    <H2 id="so-do-you-need-one">So, do you need one?</H2>
    <P>Ask three questions:</P>
    <ul className="mt-5 list-disc space-y-2 pl-6">
      <LI>Do you need money to build?</LI>
      <LI>Do you want your users to own a piece of the outcome?</LI>
      <LI>Can you explain what the token does in one sentence?</LI>
    </ul>
    <P>
      If the answers are yes, a token can work. If not, wait. A token is easy
      to launch and hard to undo.
    </P>

    <Callout>
      The best token is not the one that launches fastest. It is the one people
      can understand, verify, and still want a year later.
    </Callout>

    <P>
      Ready to set one up?{" "}
      <Link href={DISTRIBUTION_LAUNCH_HREF} className={link}>
        Launch your distribution on sqrtDAO
      </Link>{" "}
      and see how every setting looks to the people you want to join.
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
      <h1 className="sr-only">{post.title}</h1>
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
