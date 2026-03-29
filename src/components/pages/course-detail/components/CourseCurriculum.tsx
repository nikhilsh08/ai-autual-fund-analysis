"use client";

import FadeIn from "../../home/components/FadeIn";

interface CurriculumItem {
  key: string;
  value: string[] | null;
}

interface CourseCurriculumProps {
  curriculum?: CurriculumItem[];
  duration?: string;
}

const defaultModules = [
  {
    key: "Net Worth Calculation",
    value: [
      "WHAT YOU ACTUALLY OWN",
      "Assets minus liabilities — done properly. The car delusion (your ₹8L car = ₹4.5L today). The EMI confusion. The lifestyle asset trap."
    ]
  },
  {
    key: "The Tier-1 City Expense Trap",
    value: [
      "WHERE ₹12 LAKH/YEAR REALLY GOES",
      "A real salary breakdown for Mumbai/Delhi/Bangalore. Rent, groceries, EMIs, eat-outs, the 'life-tax' — and the shocking surplus that's left."
    ]
  },
  {
    key: "Emergency Fund Ratio",
    value: [
      "YOUR FINANCIAL AIRBAG",
      "Why the standard '6 months expenses' advice is dangerously low for metro India. Job search timelines, medical costs, family emergencies."
    ]
  },
  {
    key: "Debt-to-Income Ratio",
    value: [
      "THE WEALTH KILLER",
      "₹70,000 EMI on ₹1.33L net income = 52% debt ratio. You're not building wealth — you're building the bank's wealth. How to fix this."
    ]
  },
  {
    key: "Investment Rate & Insurance",
    value: [
      "GROWTH + PROTECTION",
      "Savings ≠ investments. ₹20K in savings account at 3% vs equity at 12% = the difference between wealth destruction and creation. Plus: life, health, and disability coverage gaps."
    ]
  },
  {
    key: "Your FIRE Number",
    value: [
      "50X ANNUAL EXPENSES",
      "Financial Independence, Retire Early — what the actual number is for your life. Not a generic goal. YOUR number."
    ]
  }
];

export const CourseCurriculum = ({ curriculum, duration = "~90 min" }: CourseCurriculumProps) => {
  // Map data format to module structure
  const modules = curriculum && curriculum.length > 0
    ? curriculum.map((item) => ({
        title: item.key,
        subtitle: item.value?.[0] || "",
        description: item.value?.slice(1).join(" ") || "",
      }))
    : defaultModules.map((item) => ({
        title: item.key,
        subtitle: item.value[0],
        description: item.value.slice(1).join(" "),
      }));

  return (
    <section className="bg-cream border-t border-border" style={{ padding: "clamp(48px,6vw,80px) 0" }}>
      <div className="max-w-[660px] mx-auto px-5 md:px-7">
        <FadeIn>
          <div className="text-center mb-10">
            <div className="text-[11px] tracking-[.14em] uppercase text-ink-muted flex items-center justify-center gap-2.5 mb-4">
              <span className="w-[18px] h-px bg-ink-muted" />the curriculum
            </div>
            <h2 className="font-serif font-black text-ink tracking-tighter mb-2" style={{ fontSize: "clamp(26px,4vw,40px)" }}>
              What you'll master in <em className="font-light italic">{duration}</em>
            </h2>
            <p className="text-sm text-ink-secondary font-light">{modules.length} modules. Each builds on the last.</p>
          </div>
        </FadeIn>

        {modules.map((m, i) => (
          <FadeIn key={i} delay={i * 0.04}>
            <div className="flex gap-5 py-6 border-b border-border last:border-b-0">
              <div className="font-serif text-[32px] font-black text-cream-darkest leading-none shrink-0 w-10 text-right">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="font-serif text-[17px] font-bold text-ink mb-0.5">{m.title}</h3>
                <div className="text-[11px] text-accent font-semibold uppercase tracking-[.06em] mb-1.5">{m.subtitle}</div>
                <p className="text-sm text-ink-secondary leading-[1.7] font-light">{m.description}</p>
              </div>
            </div>
          </FadeIn>
        ))}

        <FadeIn>
          <div className="mt-7 py-[22px] px-6 bg-accent-light rounded-2xl border-l-4 border-accent">
            <h4 className="font-serif text-[15px] font-bold text-accent mb-1.5">What you walk away with</h4>
            <p className="text-[15px] text-ink-body italic leading-[1.6] font-light">
              You'll walk away with {modules.length} calculated numbers — on paper, for your life. The foundation everything else builds on.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CourseCurriculum;