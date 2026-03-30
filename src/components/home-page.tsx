"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles, Copy, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimatedGradientText } from "@/components/animated-gradient-text";
import { FAQSection } from "@/components/faq-section";
import { RelatedTools } from "@/components/related-tools";
import { Button } from "@/components/ui/button";
import { SocialShare } from "@/components/social-share";
import { GitHubStar } from "@/components/github-star";
import { siteConfig } from "@/config/site";

// ============================================================
// JSON to Go Struct Converter Logic
// ============================================================

function toGoFieldName(key: string): string {
  return key
    .replace(/[-_\s](.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (_, c: string) => c.toUpperCase());
}

function generateStructName(key: string): string {
  return toGoFieldName(key);
}

interface StructDef {
  name: string;
  fields: string[];
}

function collectStructs(
  obj: Record<string, unknown>,
  structName: string,
  structs: StructDef[]
): void {
  const fields: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const goFieldName = toGoFieldName(key);
    const goType = resolveType(key, value, structs);
    // Align fields using padding (basic alignment)
    fields.push(`\t${goFieldName} ${goType} \`json:"${key}"\``);
  }

  structs.push({ name: structName, fields });
}

function resolveType(
  key: string,
  value: unknown,
  structs: StructDef[]
): string {
  if (value === null) return "interface{}";
  if (typeof value === "boolean") return "bool";
  if (typeof value === "number") {
    return Number.isInteger(value) ? "int64" : "float64";
  }
  if (typeof value === "string") return "string";
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]interface{}";
    const firstItem = value[0];
    if (firstItem !== null && typeof firstItem === "object" && !Array.isArray(firstItem)) {
      const nestedName = generateStructName(key);
      collectStructs(firstItem as Record<string, unknown>, nestedName, structs);
      return `[]${nestedName}`;
    }
    return `[]${resolveType(key, firstItem, structs)}`;
  }
  if (typeof value === "object") {
    const nestedName = generateStructName(key);
    collectStructs(value as Record<string, unknown>, nestedName, structs);
    return nestedName;
  }
  return "interface{}";
}

function convertJsonToGoStructs(jsonStr: string): string {
  const parsed = JSON.parse(jsonStr) as unknown;

  let root: Record<string, unknown>;
  if (Array.isArray(parsed)) {
    if (parsed.length === 0 || typeof parsed[0] !== "object" || parsed[0] === null) {
      return "// Top-level array of primitives — no struct needed";
    }
    root = parsed[0] as Record<string, unknown>;
  } else if (typeof parsed === "object" && parsed !== null) {
    root = parsed as Record<string, unknown>;
  } else {
    return "// Top-level value is a primitive — no struct needed";
  }

  const structs: StructDef[] = [];
  collectStructs(root, "Root", structs);

  // Reverse so nested structs appear before Root
  const ordered: StructDef[] = [];
  const rootStruct = structs.find((s) => s.name === "Root");
  const nested = structs.filter((s) => s.name !== "Root");
  ordered.push(...nested, ...(rootStruct ? [rootStruct] : []));

  // De-duplicate by name (last one wins, matching the last traversal)
  const seen = new Map<string, StructDef>();
  for (const s of ordered) {
    seen.set(s.name, s);
  }

  return [...seen.values()]
    .map((s) => `type ${s.name} struct {\n${s.fields.join("\n")}\n}`)
    .join("\n\n");
}

// ============================================================
// Default example JSON
// ============================================================
const DEFAULT_JSON = `{
  "user_id": 1,
  "name": "Alice",
  "active": true,
  "scores": [1.5, 2.0],
  "address": {
    "city": "NYC",
    "zip": "10001"
  }
}`;

// ============================================================
// Main Component
// ============================================================

export function HomePage() {
  const scrollToTool = useCallback(() => {
    document.getElementById("tool")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const [jsonInput, setJsonInput] = useState(DEFAULT_JSON);
  const [goOutput, setGoOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const convert = useCallback((value: string) => {
    if (!value.trim()) {
      setGoOutput("");
      setError(null);
      return;
    }
    try {
      const result = convertJsonToGoStructs(value);
      setGoOutput(result);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setGoOutput("");
    }
  }, []);

  // Run on mount with default JSON
  useEffect(() => {
    convert(DEFAULT_JSON);
  }, [convert]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setJsonInput(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => convert(value), 300);
    },
    [convert]
  );

  const handleCopy = useCallback(async () => {
    if (!goOutput) return;
    await navigator.clipboard.writeText(goOutput);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, [goOutput]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-screen-xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 mb-6"
          >
            <Sparkles className="h-4 w-4 text-brand" />
            <span className="text-sm text-brand font-medium">
              {siteConfig.hero.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight"
          >
            {siteConfig.hero.titleLine1}
            <br className="hidden sm:block" />
            <AnimatedGradientText>{siteConfig.hero.titleGradient}</AnimatedGradientText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {siteConfig.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              size="lg"
              onClick={scrollToTool}
              aria-label="Scroll to tool section"
              className="gap-2 bg-gradient-to-r from-brand to-brand-accent text-white shadow-lg shadow-brand/25 px-8 py-6 text-lg"
            >
              Try Now
              <ArrowDown className="h-5 w-5" />
            </Button>
          </motion.div>
        </section>

        {/* Feature Cards */}
        <section className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {siteConfig.featureCards.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-muted/30 border border-border/50"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Tool Section */}
        <section id="tool" className="scroll-mt-24 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            {/* Panel header */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  JSON Input
                </span>
                {error && (
                  <span className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    Invalid JSON
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Go Struct Output
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!goOutput}
                  className="gap-1.5 h-7 text-xs"
                  aria-label="Copy Go structs to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-brand" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Two-panel editor */}
            <div className="grid grid-cols-2 gap-4 h-[500px]">
              {/* Left: JSON input */}
              <textarea
                value={jsonInput}
                onChange={handleInput}
                spellCheck={false}
                placeholder={`Paste your JSON here...\n\nExample:\n{\n  "name": "Alice",\n  "age": 30\n}`}
                aria-label="JSON input"
                className={[
                  "w-full h-full resize-none rounded-xl border bg-muted/20 p-4 font-mono text-sm leading-relaxed",
                  "focus:outline-none focus:ring-2 focus:ring-brand/50 transition-colors",
                  "placeholder:text-muted-foreground/40",
                  error
                    ? "border-destructive/60 focus:ring-destructive/30"
                    : "border-border/50",
                ].join(" ")}
              />

              {/* Right: Go output */}
              <div
                className={[
                  "w-full h-full rounded-xl border bg-muted/10 p-4 font-mono text-sm leading-relaxed",
                  "overflow-auto whitespace-pre",
                  goOutput ? "text-foreground" : "text-muted-foreground/40",
                  "border-border/50",
                ].join(" ")}
                aria-label="Go struct output"
                aria-live="polite"
              >
                {goOutput || "// Go struct will appear here..."}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-destructive flex items-center gap-1.5"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </motion.p>
            )}
          </motion.div>
        </section>

        {/* Share + GitHub Star */}
        <section className="flex items-center justify-center gap-3 mb-20">
          <SocialShare />
          <GitHubStar />
        </section>

        {/* FAQ Section */}
        <section className="text-center mb-20">
          <FAQSection />
        </section>

        {/* Related Tools */}
        <section className="text-center">
          <RelatedTools />
        </section>
      </main>

      <Footer />
    </div>
  );
}
