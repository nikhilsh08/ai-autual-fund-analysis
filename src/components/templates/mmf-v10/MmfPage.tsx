import type { Course } from "@prisma/client";
import { renderMmfBody, MMF_V10_BASE_CSS, MMF_V10_HOVER_CSS } from "./render";
import MmfClient from "./MmfClient";

// Page-specific overrides on top of the generated design, scoped to
// #mmf-root so they never leak onto the rest of the site. Populated as
// visual differences are found (plan Day 3B). Never edit template.generated.ts
// to fix a layout difference — add a rule here instead.
const ROOT_CSS = ``;

export default function MmfPage({ batch }: { batch: Course }) {
  const bodyHtml = renderMmfBody(batch);

  return (
    <div id="mmf-root">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap"
      />
      <style dangerouslySetInnerHTML={{ __html: MMF_V10_BASE_CSS }} />
      <style dangerouslySetInnerHTML={{ __html: MMF_V10_HOVER_CSS }} />
      {ROOT_CSS && <style dangerouslySetInnerHTML={{ __html: ROOT_CSS }} />}
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <MmfClient courseId={batch.id} price={batch.price} title={batch.title} />
    </div>
  );
}
