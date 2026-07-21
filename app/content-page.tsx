import Link from "next/link";
export function ContentPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return <main className="content-page"><header><Link className="brand" href="/"><img src="/favicon.svg" alt=""/><span>Pipelix</span></Link><Link className="btn compact" href="/#contact">Book a demo <span>↗</span></Link></header><article><span className="kicker">{eyebrow}</span><h1>{title}</h1><p className="lead">{intro}</p>{children}</article><footer><Link href="/">← Back to Pipelix</Link><span>hello@pipelix.ai</span></footer></main>;
}
