import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Callout, H2, P } from "@/components/Docs/prose";
import FounderSharePanel from "@/components/Blog/FounderSharePanel";
import KeepReadingCard from "@/components/Blog/KeepReadingCard";
import RunsPanel from "@/components/Blog/RunsPanel";
import TrustPanel from "@/components/Blog/TrustPanel";
import TwoWaysDiagram from "@/components/Blog/TwoWaysDiagram";
import { DISTRIBUTION_LAUNCH_HREF } from "@/constants/links";
import { estimateReadTime } from "@/utils/read-time";
import { blogPostMetadata } from "../metadata";
import { getPost, postDate } from "../posts";

const SLUG = "how-should-you-set-up-your-distribution";

export const metadata: Metadata = blogPostMetadata(getPost(SLUG)!);

const launchLink = "text-accent underline-offset-4 hover:underline";

const body = (
  <>
    <P>Your setup is the first thing participants judge.</P>

    <Callout>
      <b>Short answer:</b> run it long enough for people to show up, take a
      founder share you&apos;d defend in public, and fill in your profile.
    </Callout>

    <H2 id="two-ways-in">Two ways in</H2>
    <P>Same distribution either way. Only the starting point differs.</P>
    <TwoWaysDiagram />
    <P>
      Whichever door you take, you end up in the same place: your distribution,
      with the same rules and the same fairness for everyone who joins.
    </P>

    <H2 id="short-run-vs-long-run">Short run vs long run</H2>
    <P>
      The biggest choice you&apos;ll make. You set it in the{" "}
      <b>Release strategy</b> step of the{" "}
      <Link href={DISTRIBUTION_LAUNCH_HREF} className={launchLink}>
        Launch token
      </Link>{" "}
      wizard.
    </P>
    <RunsPanel />
    <P>
      Not sure? <b>Maybe go longer.</b> A short run starts to behave like the
      one-day launch you&apos;re trying to avoid.
    </P>

    <H2 id="your-founder-share">Your founder share</H2>
    <P>
      Your income from participation. The more people trust you, the more they
      put in.
    </P>
    <P>
      <b>What it is:</b> the slice of each epoch&apos;s participation that goes
      to you, for as long as the distribution runs. So your income grows with
      participation, and participation grows with trust. Participants see this
      number <b>before they join</b>, so it reads as a statement about you.
    </P>
    <FounderSharePanel />
    <P>
      Pick the number you&apos;d happily explain to your biggest backer.{" "}
      <b>Lower reads as confidence.</b>
    </P>

    <H2 id="how-your-setup-builds-trust">How your setup builds trust</H2>
    <P>
      Participants can&apos;t read your mind. They read your settings.
    </P>
    <TrustPanel />

    <Callout>
      The rules are fair for everyone. <b>Your settings are what make people
      believe it.</b> Slow, modest, and complete beats fast and flashy.
    </Callout>

    <H2 id="set-yours-up">Set yours up</H2>
    <P>
      <Link href={DISTRIBUTION_LAUNCH_HREF} className={launchLink}>
        Launch a token
      </Link>{" "}
      or import yours, and see how every setting looks to the people you want
      to show up.
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
