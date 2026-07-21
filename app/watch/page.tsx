import type { Metadata } from "next"; import { ContentPage } from "../content-page";
export const metadata: Metadata={title:"Watch: How Pipelix Works",description:"A 1:19 walkthrough of Pipelix taking a real Azure DevOps bug from backlog intake through autonomous execution, validation, and verified delivery.",alternates:{canonical:"/watch"}};
const moments=[["Intake","The ticket syncs from Azure Boards—no manual setup, no rewritten description."],["Execution","Pipelix investigates the codebase and implements the fix directly in your repo."],["Validation","The build and full test suite run automatically before anything is called done."],["Autonomous rework","Acceptance criteria are audited against the change, and the fix is verified before handoff."]];
export default function Page(){return <ContentPage eyebrow="Product walkthrough · 1:19" title="Watch a bug go from backlog to verified fix." intro="No slides—just Pipelix picking up a real Azure DevOps bug and taking it through intake, execution, validation, and autonomous rework in under two minutes.">
 <div className="video-card"><video controls preload="metadata" playsInline poster="/videos/pipelix-how-it-works-poster.jpg" aria-label="Pipelix product walkthrough"><source src="/videos/pipelix-how-it-works.mp4" type="video/mp4"/></video></div>
 <div className="seo-copy"><h2>What you'll see</h2><ul>{moments.map(([t,c])=><li key={t}><b>{t}</b>{" — "}{c}</li>)}</ul></div>
 <p><a className="btn" href="/#contact">Book a workflow review <span>↗</span></a></p>
</ContentPage>}
