"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronRight,
  Code2,
  Cpu,
  Database,
  File,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  Settings,
  Terminal,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface FileTreeElement {
  id: string;
  name: string;
  type?: "folder" | "file";
  children?: FileTreeElement[];
  highlight?: boolean;
  defaultOpen?: boolean;
  tag?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface FileTreeProps {
  elements: FileTreeElement[];
  defaultOpenIds?: string[];
  className?: string;
  indentSize?: number;
}

function getFileIcon(name: string, CustomIcon?: React.ComponentType<{ className?: string }>) {
  if (CustomIcon) return <CustomIcon className="h-4 w-4 shrink-0 text-[var(--accent)]" />;

  const ext = name.split(".").pop()?.toLowerCase();
  const lower = name.toLowerCase();

  if (lower === "dockerfile" || lower.includes("docker")) {
    return <Terminal className="h-4 w-4 shrink-0 text-blue-400" />;
  }
  if (lower.endsWith(".yaml") || lower.endsWith(".yml") || lower.endsWith(".json")) {
    return <FileJson className="h-4 w-4 shrink-0 text-amber-400" />;
  }
  if (lower.endsWith(".sql")) {
    return <Database className="h-4 w-4 shrink-0 text-emerald-400" />;
  }
  if (lower.endsWith(".py")) {
    return <Code2 className="h-4 w-4 shrink-0 text-yellow-400" />;
  }
  if (lower.endsWith(".ts") || lower.endsWith(".tsx") || lower.endsWith(".js") || lower.endsWith(".vue")) {
    return <FileCode className="h-4 w-4 shrink-0 text-cyan-400" />;
  }
  if (lower.endsWith(".java")) {
    return <FileCode className="h-4 w-4 shrink-0 text-orange-400" />;
  }
  if (lower.endsWith(".c") || lower.endsWith(".h") || lower.endsWith(".cpp")) {
    return <Cpu className="h-4 w-4 shrink-0 text-purple-400" />;
  }
  if (lower.endsWith(".md") || lower.endsWith(".txt")) {
    return <FileText className="h-4 w-4 shrink-0 text-[var(--fg-muted)]" />;
  }
  if (lower.endsWith(".ini") || lower.endsWith(".conf") || lower.endsWith(".properties")) {
    return <Settings className="h-4 w-4 shrink-0 text-neutral-400" />;
  }

  return <File className="h-4 w-4 shrink-0 text-[var(--fg-muted)]" />;
}

function TreeNode({
  node,
  openIds,
  toggleOpen,
  depth = 0,
}: {
  node: FileTreeElement;
  openIds: Set<string>;
  toggleOpen: (id: string) => void;
  depth?: number;
}) {
  const isFolder = node.type === "folder" || (node.children && node.children.length > 0);
  const isOpen = openIds.has(node.id);

  return (
    <div className="select-none font-mono text-xs">
      <div
        onClick={() => isFolder && toggleOpen(node.id)}
        className={cn(
          "flex items-center gap-2 py-1.5 px-2.5 rounded-[var(--radius-xs)] transition-colors",
          isFolder ? "cursor-pointer hover:bg-[var(--surface-2)]" : "hover:bg-[var(--surface-2)]/60",
          node.highlight && "bg-[var(--accent)]/10 text-[var(--accent)] font-semibold border-l-2 border-[var(--accent)] pl-2"
        )}
        style={{ paddingLeft: `${depth * 18 + 10}px` }}
      >
        {isFolder ? (
          <>
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 shrink-0 text-[var(--fg-faint)] transition-transform duration-200",
                isOpen && "rotate-90 text-[var(--accent)]"
              )}
            />
            {isOpen ? (
              <FolderOpen className="h-4 w-4 shrink-0 text-[var(--accent)]" />
            ) : (
              <Folder className="h-4 w-4 shrink-0 text-[var(--fg-muted)]" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5 shrink-0" />
            {getFileIcon(node.name, node.icon)}
          </>
        )}

        <span
          className={cn(
            "truncate tracking-tight",
            node.highlight ? "text-[var(--accent)] font-semibold" : "text-[var(--fg)]"
          )}
        >
          {node.name}
        </span>

        {node.tag && (
          <span className="ml-auto text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--fg-muted)] border border-[var(--border)] shrink-0">
            {node.tag}
          </span>
        )}
      </div>

      {isFolder && node.children && (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative overflow-hidden before:absolute before:left-[18px] before:top-0 before:bottom-0 before:w-[1px] before:bg-[var(--border)]"
            >
              {node.children.map((child) => (
                <TreeNode
                  key={child.id}
                  node={child}
                  openIds={openIds}
                  toggleOpen={toggleOpen}
                  depth={depth + 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export function FileTree({
  elements,
  defaultOpenIds = [],
  className,
}: FileTreeProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const initial = new Set<string>(defaultOpenIds);
    function collectDefault(nodes: FileTreeElement[]) {
      for (const n of nodes) {
        if (n.defaultOpen) initial.add(n.id);
        if (n.children) collectDefault(n.children);
      }
    }
    collectDefault(elements);
    return initial;
  });

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div
      className={cn(
        "rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-3 overflow-hidden shadow-xs",
        className
      )}
    >
      <div className="flex items-center justify-between px-2 py-1 mb-2 border-b border-[var(--border)] text-[11px] font-mono text-[var(--fg-faint)]">
        <span>PROJECT SCAFFOLD // 推荐脚手架工程规范</span>
        <span>STANDARDIZED ARCHITECTURE</span>
      </div>
      <div className="space-y-0.5">
        {elements.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            openIds={openIds}
            toggleOpen={toggleOpen}
            depth={0}
          />
        ))}
      </div>
    </div>
  );
}
