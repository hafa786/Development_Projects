import {
    ArrowRight,
    BarChart3,
    Bot,
    BrainCircuit,
    BriefcaseBusiness,
    Check,
    CheckCircle2,
    Clock3,
    FileSearch,
    Gauge,
    Menu,
    MessageSquareText,
    ShieldCheck,
    Sparkles,
    Target,
    Users,
    Workflow,
    X,
    Zap,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <LandingNavbar />

            <main>
                <HeroSection />
                <StatsSection />
                <FeaturesSection />
                <HowItWorksSection />
                <AiSection />
                <BenefitsSection />
                <CtaSection />
            </main>

            <LandingFooter />
        </div>
    );
}

/*
 * ---------------------------------------------------------
 * NAVBAR
 * ---------------------------------------------------------
 */

function LandingNavbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    to="/"
                    className="flex items-center gap-2"
                >
                    <LogoMark />

                    <span className="text-xl font-bold tracking-tight">
                        Darmi
                        <span className="text-emerald-600">
                            Hire
                        </span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    <a
                        href="#features"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Features
                    </a>

                    <a
                        href="#how-it-works"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        How it works
                    </a>

                    <a
                        href="#ai"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        AI
                    </a>

                    <a
                        href="#benefits"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Benefits
                    </a>
                </nav>

                <div className="hidden items-center gap-2 md:flex">
                    <Button
                        variant="ghost"

                    >
                        <Link to="/login">
                            Sign in
                        </Link>
                    </Button>

                    <Button

                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        <Link to="/login" style={{ display: 'ruby'}}>
                            Get started
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() =>
                        setMobileOpen((value) => !value)
                    }
                    aria-label="Toggle navigation"
                >
                    {mobileOpen ? (
                        <X className="size-5" />
                    ) : (
                        <Menu className="size-5" />
                    )}
                </Button>
            </div>

            {mobileOpen && (
                <div className="border-t bg-background px-4 py-5 md:hidden">
                    <nav className="flex flex-col gap-4">
                        <a
                            href="#features"
                            onClick={() => setMobileOpen(false)}
                            className="font-medium"
                        >
                            Features
                        </a>

                        <a
                            href="#how-it-works"
                            onClick={() => setMobileOpen(false)}
                            className="font-medium"
                        >
                            How it works
                        </a>

                        <a
                            href="#ai"
                            onClick={() => setMobileOpen(false)}
                            className="font-medium"
                        >
                            AI
                        </a>

                        <a
                            href="#benefits"
                            onClick={() => setMobileOpen(false)}
                            className="font-medium"
                        >
                            Benefits
                        </a>

                        <div className="mt-2 grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"

                            >
                                <Link to="/login">
                                    Sign in
                                </Link>
                            </Button>

                            <Button

                                className="bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                <Link to="/login">
                                    Get started
                                </Link>
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

/*
 * ---------------------------------------------------------
 * HERO
 * ---------------------------------------------------------
 */

function HeroSection() {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.08),transparent_30%)]" />

            <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pb-28">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm font-medium shadow-sm">
                        <Sparkles className="size-4 text-emerald-600" />

                        AI-powered recruitment platform
                    </div>

                    <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
                        Hire smarter.
                        <br />

                        <span className="text-emerald-600">
                            Build better teams.
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
                        DarmiHire brings applicant tracking,
                        team collaboration and AI-powered
                        candidate intelligence together in one
                        modern hiring platform.
                    </p>

                    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button
                            size="lg"

                            className="h-12 bg-emerald-600 px-7 text-white hover:bg-emerald-700"
                        >
                            <Link to="/login" style={{display : 'ruby'}}>
                                Start hiring
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"

                            className="h-12 px-7"
                        >
                            <a href="#how-it-works">
                                See how it works
                            </a>
                        </Button>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <HeroCheck text="Simple setup" />
                        <HeroCheck text="Built for modern teams" />
                        <HeroCheck text="AI-powered workflows" />
                    </div>
                </div>

                <div className="relative mx-auto mt-16 max-w-6xl">
                    <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-emerald-500/10 blur-3xl" />

                    <DashboardPreview />
                </div>
            </div>
        </section>
    );
}

function HeroCheck({
    text,
}: {
    text: string;
}) {
    return (
        <span className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-600" />
            {text}
        </span>
    );
}

/*
 * ---------------------------------------------------------
 * PRODUCT PREVIEW
 * ---------------------------------------------------------
 */

function DashboardPreview() {
    const candidates = [
        {
            initials: "AK",
            name: "Anna Korhonen",
            role: "Senior Backend Engineer",
            score: 94,
            stage: "Interview",
        },
        {
            initials: "JM",
            name: "James Miller",
            role: "Full Stack Developer",
            score: 89,
            stage: "Screening",
        },
        {
            initials: "SM",
            name: "Sara Martin",
            role: "Product Designer",
            score: 87,
            stage: "Review",
        },
    ];

    return (
        <div className="overflow-hidden rounded-2xl border bg-background shadow-2xl shadow-black/10">
            <div className="flex h-12 items-center gap-2 border-b px-4">
                <span className="size-3 rounded-full bg-muted-foreground/20" />
                <span className="size-3 rounded-full bg-muted-foreground/20" />
                <span className="size-3 rounded-full bg-muted-foreground/20" />

                <div className="mx-auto rounded-md bg-muted px-16 py-1 text-[10px] text-muted-foreground">
                    app.darmihire.com
                </div>
            </div>

            <div className="flex min-h-[480px]">
                <aside className="hidden w-56 shrink-0 border-r bg-muted/20 p-4 md:block">
                    <div className="flex items-center gap-2 px-2">
                        <LogoMark small />

                        <span className="font-bold">
                            DarmiHire
                        </span>
                    </div>

                    <div className="mt-8 space-y-1">
                        <PreviewNav
                            icon={Gauge}
                            label="Dashboard"
                            active
                        />

                        <PreviewNav
                            icon={BriefcaseBusiness}
                            label="Jobs"
                        />

                        <PreviewNav
                            icon={Users}
                            label="Candidates"
                        />

                        <PreviewNav
                            icon={MessageSquareText}
                            label="Interviews"
                        />

                        <PreviewNav
                            icon={BarChart3}
                            label="Analytics"
                        />
                    </div>
                </aside>

                <div className="min-w-0 flex-1 bg-muted/10 p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-lg font-semibold">
                                Good morning, Hiring Team
                            </p>

                            <p className="text-xs text-muted-foreground">
                                Here&apos;s what&apos;s happening
                                with your hiring pipeline.
                            </p>
                        </div>

                        <div className="hidden rounded-md bg-emerald-600 px-3 py-2 text-xs font-medium text-white sm:block">
                            + Create job
                        </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <PreviewMetric
                            title="Open jobs"
                            value="12"
                            change="+2 this month"
                        />

                        <PreviewMetric
                            title="Candidates"
                            value="184"
                            change="+28 this week"
                        />

                        <PreviewMetric
                            title="Interviews"
                            value="23"
                            change="Next 7 days"
                        />
                    </div>

                    <div className="mt-5 rounded-xl border bg-background p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">
                                    Top candidates
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    Ranked with DarmiHire AI
                                </p>
                            </div>

                            <BrainCircuit className="size-5 text-emerald-600" />
                        </div>

                        <div className="mt-4 divide-y">
                            {candidates.map((candidate) => (
                                <div
                                    key={candidate.name}
                                    className="flex items-center gap-3 py-3"
                                >
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                                        {candidate.initials}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">
                                            {candidate.name}
                                        </p>

                                        <p className="truncate text-xs text-muted-foreground">
                                            {candidate.role}
                                        </p>
                                    </div>

                                    <div className="hidden text-right sm:block">
                                        <p className="text-xs text-muted-foreground">
                                            AI match
                                        </p>

                                        <p className="text-sm font-bold text-emerald-600">
                                            {candidate.score}%
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
                                        {candidate.stage}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PreviewNav({
    icon: Icon,
    label,
    active = false,
}: {
    icon: typeof Gauge;
    label: string;
    active?: boolean;
}) {
    return (
        <div
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${active
                    ? "bg-emerald-50 font-medium text-emerald-700"
                    : "text-muted-foreground"
                }`}
        >
            <Icon className="size-4" />
            {label}
        </div>
    );
}

function PreviewMetric({
    title,
    value,
    change,
}: {
    title: string;
    value: string;
    change: string;
}) {
    return (
        <div className="rounded-xl border bg-background p-4">
            <p className="text-xs text-muted-foreground">
                {title}
            </p>

            <p className="mt-1 text-2xl font-bold">
                {value}
            </p>

            <p className="mt-1 text-xs text-emerald-600">
                {change}
            </p>
        </div>
    );
}

/*
 * ---------------------------------------------------------
 * STATS
 * ---------------------------------------------------------
 */

function StatsSection() {
    return (
        <section className="border-y bg-muted/20">
            <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
                <Stat
                    value="One"
                    label="Unified hiring workspace"
                />

                <Stat
                    value="AI"
                    label="Candidate intelligence"
                />

                <Stat
                    value="360°"
                    label="Pipeline visibility"
                />

                <Stat
                    value="24/7"
                    label="Hiring workflow"
                />
            </div>
        </section>
    );
}

function Stat({
    value,
    label,
}: {
    value: string;
    label: string;
}) {
    return (
        <div className="px-4 py-3 text-center">
            <p className="text-2xl font-bold text-emerald-600 sm:text-3xl">
                {value}
            </p>

            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {label}
            </p>
        </div>
    );
}

/*
 * ---------------------------------------------------------
 * FEATURES
 * ---------------------------------------------------------
 */

const features = [
    {
        icon: BrainCircuit,
        title: "AI candidate matching",
        description:
            "Understand candidate skills and surface stronger matches for every open role.",
    },
    {
        icon: BriefcaseBusiness,
        title: "Applicant tracking",
        description:
            "Manage jobs and candidates through a clear, structured recruitment pipeline.",
    },
    {
        icon: Users,
        title: "Collaborative hiring",
        description:
            "Keep recruiters, hiring managers and teams aligned throughout the hiring process.",
    },
    {
        icon: MessageSquareText,
        title: "Interview management",
        description:
            "Organize interview stages, feedback and hiring decisions in one place.",
    },
    {
        icon: BarChart3,
        title: "Hiring analytics",
        description:
            "Understand pipeline activity and identify bottlenecks with actionable insights.",
    },
    {
        icon: Workflow,
        title: "Modern workflows",
        description:
            "Reduce repetitive recruitment work and keep candidates moving through your process.",
    },
];

function FeaturesSection() {
    return (
        <section
            id="features"
            className="scroll-mt-20 py-24"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    eyebrow="Everything in one place"
                    title="A better way to run your hiring process"
                    description="From opening a role to making the final decision, DarmiHire gives your team the tools to move faster and stay organized."
                />

                <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="group rounded-2xl border bg-background p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <Icon className="size-5" />
                                </div>

                                <h3 className="mt-5 text-lg font-semibold">
                                    {feature.title}
                                </h3>

                                <p className="mt-2 leading-7 text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/*
 * ---------------------------------------------------------
 * HOW IT WORKS
 * ---------------------------------------------------------
 */

function HowItWorksSection() {
    const steps = [
        {
            number: "01",
            title: "Create your job",
            description:
                "Define the role, requirements and hiring workflow.",
        },
        {
            number: "02",
            title: "Collect candidates",
            description:
                "Keep applicants and candidate information organized in one place.",
        },
        {
            number: "03",
            title: "Analyze with AI",
            description:
                "Use AI-assisted insights to understand candidate-role fit.",
        },
        {
            number: "04",
            title: "Make better decisions",
            description:
                "Collaborate with your team and move the strongest candidates forward.",
        },
    ];

    return (
        <section
            id="how-it-works"
            className="scroll-mt-20 bg-slate-950 py-24 text-white"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    dark
                    eyebrow="Simple by design"
                    title="From job opening to new hire"
                    description="A structured workflow gives your hiring team clarity at every stage."
                />

                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <div
                            key={step.number}
                            className="relative"
                        >
                            <div className="text-5xl font-bold text-emerald-500/30">
                                {step.number}
                            </div>

                            <h3 className="mt-4 text-lg font-semibold">
                                {step.title}
                            </h3>

                            <p className="mt-2 leading-7 text-slate-400">
                                {step.description}
                            </p>

                            {index < steps.length - 1 && (
                                <ArrowRight className="absolute -right-5 top-7 hidden size-5 text-slate-700 lg:block" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/*
 * ---------------------------------------------------------
 * AI SECTION
 * ---------------------------------------------------------
 */

function AiSection() {
    return (
        <section
            id="ai"
            className="scroll-mt-20 overflow-hidden py-24"
        >
            <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                        <Bot className="size-4" />
                        DarmiHire AI
                    </div>

                    <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                        Spend less time screening.
                        <span className="block text-emerald-600">
                            More time hiring.
                        </span>
                    </h2>

                    <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
                        AI-assisted candidate analysis helps
                        your team understand skills, identify
                        gaps and focus attention on the
                        candidates most relevant to each role.
                    </p>

                    <div className="mt-8 space-y-5">
                        <AiBenefit
                            title="Candidate-job matching"
                            description="Compare candidate experience and skills with role requirements."
                        />

                        <AiBenefit
                            title="Skills and gap analysis"
                            description="Quickly identify relevant strengths and potential gaps."
                        />

                        <AiBenefit
                            title="Clear recommendations"
                            description="Give recruiters useful context without replacing human hiring decisions."
                        />
                    </div>
                </div>

                <AiPreview />
            </div>
        </section>
    );
}

function AiBenefit({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex gap-3">
            <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <Check className="size-3.5 text-emerald-700" />
            </div>

            <div>
                <p className="font-semibold">
                    {title}
                </p>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    );
}

function AiPreview() {
    return (
        <div className="relative">
            <div className="absolute -inset-12 -z-10 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="rounded-3xl border bg-background p-6 shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Candidate analysis
                        </p>

                        <h3 className="mt-1 text-xl font-semibold">
                            Senior Backend Engineer
                        </h3>
                    </div>

                    <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50">
                        <Sparkles className="size-5 text-emerald-600" />
                    </div>
                </div>

                <div className="mt-7 flex items-center gap-5 rounded-2xl bg-muted/40 p-5">
                    <div className="relative flex size-20 items-center justify-center rounded-full border-[7px] border-emerald-500">
                        <span className="text-xl font-bold">
                            94%
                        </span>
                    </div>

                    <div>
                        <p className="font-semibold">
                            Excellent match
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Strong alignment with the
                            role&apos;s core requirements.
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-sm font-semibold">
                        Matching skills
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {[
                            "Java",
                            "Spring Boot",
                            "PostgreSQL",
                            "Kafka",
                            "Kubernetes",
                            "AWS",
                        ].map((skill) => (
                            <span
                                key={skill}
                                className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-6 rounded-xl border p-4">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="size-4 text-emerald-600" />

                        <p className="text-sm font-semibold">
                            AI summary
                        </p>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Strong backend engineering profile
                        with relevant distributed systems and
                        cloud-native experience.
                    </p>
                </div>
            </div>
        </div>
    );
}

/*
 * ---------------------------------------------------------
 * BENEFITS
 * ---------------------------------------------------------
 */

function BenefitsSection() {
    const benefits = [
        {
            icon: Clock3,
            title: "Save recruiting time",
            description:
                "Keep hiring work structured and reduce repetitive manual steps.",
        },
        {
            icon: Target,
            title: "Focus on stronger matches",
            description:
                "Use consistent candidate information and AI-assisted insights to prioritize reviews.",
        },
        {
            icon: Users,
            title: "Keep teams aligned",
            description:
                "Give everyone involved in hiring a shared view of candidates and progress.",
        },
        {
            icon: ShieldCheck,
            title: "Organize access",
            description:
                "Structure your workspace around users, roles, teams and organizational settings.",
        },
    ];

    return (
        <section
            id="benefits"
            className="scroll-mt-20 bg-muted/30 py-24"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    eyebrow="Built for hiring teams"
                    title="Move from busywork to better hiring"
                    description="Give your recruiting team a clear workspace for managing candidates, collaboration and hiring decisions."
                />

                <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {benefits.map((benefit) => {
                        const Icon = benefit.icon;

                        return (
                            <div
                                key={benefit.title}
                                className="rounded-2xl border bg-background p-6"
                            >
                                <Icon className="size-6 text-emerald-600" />

                                <h3 className="mt-5 font-semibold">
                                    {benefit.title}
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    {benefit.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/*
 * ---------------------------------------------------------
 * CTA
 * ---------------------------------------------------------
 */

function CtaSection() {
    return (
        <section className="py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-emerald-600 px-6 py-16 text-center text-white sm:px-12">
                    <div className="absolute -left-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-32 -right-16 size-72 rounded-full bg-black/10 blur-3xl" />

                    <div className="relative mx-auto max-w-2xl">
                        <Zap className="mx-auto size-9" />

                        <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                            Ready to modernize your hiring?
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-emerald-50">
                            Bring your recruiting workflow,
                            candidates and hiring team together
                            with DarmiHire.
                        </p>

                        <Button
                            size="lg"
                            variant="secondary"
                            className="mt-8 h-12 px-7"

                        >
                            <Link to="/login">
                                Get started with DarmiHire
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

/*
 * ---------------------------------------------------------
 * FOOTER
 * ---------------------------------------------------------
 */

function LandingFooter() {
    return (
        <footer className="border-t bg-slate-950 text-slate-300">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-10 md:flex-row">
                    <div>
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-white"
                        >
                            <LogoMark />

                            <span className="text-lg font-bold">
                                DarmiHire
                            </span>
                        </Link>

                        <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
                            Modern hiring, powered by AI.
                        </p>

                        <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                            A modern recruitment platform by
                            Darmi Solutions.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-12 text-sm">
                        <div className="space-y-3">
                            <p className="font-semibold text-white">
                                Product
                            </p>

                            <a
                                href="#features"
                                className="block text-slate-400 hover:text-white"
                            >
                                Features
                            </a>

                            <a
                                href="#ai"
                                className="block text-slate-400 hover:text-white"
                            >
                                AI
                            </a>

                            <a
                                href="#how-it-works"
                                className="block text-slate-400 hover:text-white"
                            >
                                How it works
                            </a>
                        </div>

                        <div className="space-y-3">
                            <p className="font-semibold text-white">
                                Account
                            </p>

                            <Link
                                to="/login"
                                className="block text-slate-400 hover:text-white"
                            >
                                Sign in
                            </Link>

                            <Link
                                to="/login"
                                className="block text-slate-400 hover:text-white"
                            >
                                Get started
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500">
                    © {new Date().getFullYear()} Darmi
                    Solutions. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

/*
 * ---------------------------------------------------------
 * SHARED
 * ---------------------------------------------------------
 */

function LogoMark({
    small = false,
}: {
    small?: boolean;
}) {
    return (
        <div
            className={`flex items-center justify-center rounded-lg bg-emerald-600 text-white ${small
                    ? "size-7"
                    : "size-9"
                }`}
        >
            <FileSearch
                className={
                    small
                        ? "size-4"
                        : "size-5"
                }
            />
        </div>
    );
}

function SectionHeading({
    eyebrow,
    title,
    description,
    dark = false,
}: {
    eyebrow: string;
    title: string;
    description: string;
    dark?: boolean;
}) {
    return (
        <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                {eyebrow}
            </p>

            <h2
                className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${dark
                        ? "text-white"
                        : ""
                    }`}
            >
                {title}
            </h2>

            <p
                className={`mt-4 text-lg leading-8 ${dark
                        ? "text-slate-400"
                        : "text-muted-foreground"
                    }`}
            >
                {description}
            </p>
        </div>
    );
}