"use client"

import React, { useState } from "react"
import { AlertCircle, X } from "lucide-react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"

interface ViolationItem {
    citation: string
    judgeName: string
    reasoning?: string
}

interface ViolationHighlightProps {
    text: string
    /** Simple string array for backward compatibility */
    citations?: string[]
    /** Rich violation data with judge info and reasoning for inline display */
    violations?: ViolationItem[]
    className?: string
}

/**
 * Highlights violation citations within agent response text.
 * Clicking on a highlighted violation shows the reasoning inline.
 * Supports Markdown rendering.
 */
export function ViolationHighlight({ text, citations, violations, className = "" }: ViolationHighlightProps) {
    const [expandedIds, setExpandedIds] = useState<string[]>([])

    // Convert simple citations to violations format for backward compatibility
    const allViolations: ViolationItem[] = violations ||
        (citations?.map(c => ({ citation: c, judgeName: "Violation" })) || [])

    // Only filter out valid violations
    const validViolations = allViolations.filter(v => v.citation && v.citation.trim().length > 0);

    if (!text) {
        return null
    }

    if (validViolations.length === 0) {
        return (
            <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
                <ReactMarkdown>{text}</ReactMarkdown>
            </div>
        )
    }

    // Create a list of all match positions
    interface Match {
        start: number
        end: number
        citation: string
        judgeName: string
        reasoning?: string
        id: string
    }
    const matches: Match[] = []

    for (let vIdx = 0; vIdx < validViolations.length; vIdx++) {
        const violation = validViolations[vIdx]
        let searchStart = 0
        while (true) {
            // Find matches in the source text (markdown)
            const index = text.toLowerCase().indexOf(violation.citation.toLowerCase(), searchStart)
            if (index === -1) break
            matches.push({
                start: index,
                end: index + violation.citation.length,
                citation: violation.citation,
                judgeName: violation.judgeName,
                reasoning: violation.reasoning,
                id: `v-${vIdx}-${index}` // Unique ID for this match instance
            })
            searchStart = index + 1
        }
    }

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start)

    // Remove overlapping matches (keep the first one)
    const uniqueMatches: Match[] = []
    let lastEnd = -1
    for (const match of matches) {
        if (match.start >= lastEnd) {
            uniqueMatches.push(match)
            lastEnd = match.end
        }
    }

    // Inject <mark> tags into the text
    // Process from end to start to avoid offset shifts
    let processedText = text;
    // Map of mark IDs to match data for the component retrieval
    const matchMap: Record<string, Match> = {};

    for (let i = uniqueMatches.length - 1; i >= 0; i--) {
        const match = uniqueMatches[i];
        matchMap[match.id] = match;

        const before = processedText.slice(0, match.start);
        const content = processedText.slice(match.start, match.end);
        const after = processedText.slice(match.end);

        // Wrap with custom attribute to identify the match
        processedText = `${before}<mark data-violation-id="${match.id}">${content}</mark>${after}`;
    }

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    }

    // Custom component for the <mark> tag
    const MarkComponent = ({ node, ...props }: any) => {
        const id = props['data-violation-id'];
        const match = matchMap[id];

        if (!match) return <mark {...props} />;

        const isExpanded = expandedIds.includes(match.id);

        return (
            <span className="relative inline">
                <mark
                    className="bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-200 px-0.5 rounded cursor-pointer border-b-2 border-red-400 hover:bg-red-300 dark:hover:bg-red-800/70 no-underline"
                    onClick={(e) => toggleExpand(match.id, e)}
                >
                    {props.children}
                    <AlertCircle className="inline w-3 h-3 ml-0.5 -mt-0.5" />
                </mark>

                {isExpanded && (
                    <span className="block mt-1 mb-2 p-2 text-xs bg-red-50 dark:bg-red-950/90 border border-red-200 dark:border-red-800 rounded-md shadow-sm z-10 relative">
                        <span className="flex items-start justify-between gap-2">
                            <span>
                                <span className="font-semibold text-red-700 dark:text-red-300">{match.judgeName}:</span>
                                <span className="text-red-600 dark:text-red-400 ml-1">
                                    {match.reasoning || "Violation detected"}
                                </span>
                            </span>
                            <button
                                onClick={(e) => toggleExpand(match.id, e)}
                                className="text-red-400 hover:text-red-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    </span>
                )}
            </span>
        );
    };

    return (
        <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
            <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                    mark: MarkComponent as any
                }}
            >
                {processedText}
            </ReactMarkdown>
        </div>
    )
}
