import { Path, Group } from '@/types/paths';
import {
    DndContext,
    closestCenter,
    SensorDescriptor,
    SensorOptions,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortablePathCard from './SortablePathCard';
import { Check, Layers, Lock, Map, Plus, RefreshCw } from 'lucide-react';

interface PathColumnSectionProps {
    type: 'basic_fundamental' | 'career_branch';
    group: Group;
    paths: Path[];
    isPublished: boolean;
    sensors: SensorDescriptor<SensorOptions>[];
    onDragEnd: (event: DragEndEvent) => void;
    onToggleStatus: () => void;
    onOpenCreateModal: (type: 'basic_fundamental' | 'career_branch') => void;
    onEditPath: (path: Path) => void;
    onDeletePath: (path: Path) => void;
}

export default function PathColumnSection({
    type,
    group,
    paths,
    isPublished,
    sensors,
    onDragEnd,
    onToggleStatus,
    onOpenCreateModal,
    onEditPath,
    onDeletePath,
}: PathColumnSectionProps) {
    const isBasic = type === 'basic_fundamental';

    // Theme configuration based on column type
    const theme = isBasic
        ? {
              badgeBg: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
              badgeLabel: 'CORE',
              title: 'Basic Fundamentals',
              description:
                  'Materi dasar bersama yang diedit kolaboratif oleh seluruh mentor.',
              headerBg:
                  'border-indigo-500/15 bg-gradient-to-r from-indigo-500/5 via-indigo-500/10 to-transparent dark:border-indigo-500/20 dark:from-indigo-950/20 dark:via-indigo-900/10',
              toggleBtnDraft:
                  'border-rose-500/30 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400',
              toggleBtnDraftText: 'Ubah Course ke Draft',
              toggleBtnPublishText: 'Publish Course Utama',
              addBtnBg:
                  'bg-indigo-600 text-white shadow-indigo-500/20 hover:bg-indigo-500',
              lockIconColor: 'text-rose-500',
              emptyIcon: Layers,
              emptyText:
                  'Tidak ada materi Basic Fundamental yang tersedia. Silakan klik Tambah Path untuk membuatnya.',
          }
        : {
              badgeBg:
                  'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
              badgeLabel: 'SPESIALISASI',
              title: 'Career Branch',
              description:
                  'Kurikulum berjenjang spesifik untuk branch karir ini.',
              headerBg:
                  'border-emerald-500/15 bg-gradient-to-r from-emerald-500/5 via-emerald-500/10 to-transparent dark:border-emerald-500/20 dark:from-emerald-950/20 dark:via-emerald-900/10',
              toggleBtnDraft:
                  'border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400',
              toggleBtnDraftText: 'Ubah Branch ke Draft',
              toggleBtnPublishText: 'Publish Branch',
              addBtnBg:
                  'bg-emerald-600 text-white shadow-emerald-500/20 hover:bg-emerald-500',
              lockIconColor: 'text-amber-500',
              emptyIcon: Map,
              emptyText:
                  'Belum ada learning path untuk branch karir ini. Silakan klik Tambah Path untuk membuatnya.',
          };

    const EmptyIcon = theme.emptyIcon;

    return (
        <div className="font-outfit relative flex min-h-[400px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-100/50 dark:border-slate-800">
            <div className="absolute inset-0 bg-white dark:bg-gradient-to-b dark:from-[#0e0e1a] dark:to-[#090910]" />
            <div className="absolute top-0 right-8 left-8 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

            {/* Card Header */}
            <div
                className={`relative z-10 space-y-4 border-b p-5 sm:p-6 ${theme.headerBg}`}
            >
                <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-extrabold tracking-wider uppercase ${theme.badgeBg}`}
                        >
                            {theme.badgeLabel}
                        </span>
                        {isPublished ? (
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                                PUBLISHED (LIVE)
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                DRAFT
                            </span>
                        )}
                    </div>
                    <h2 className="text-lg font-extrabold tracking-tight text-slate-800 dark:text-white">
                        {theme.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {theme.description}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 border-t border-slate-500/10 pt-3 dark:border-slate-500/20">
                    {/* Add Path Button - Always enabled under Granular Publishing */}
                    <button
                        type="button"
                        onClick={() => onOpenCreateModal(type)}
                        className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold shadow-md transition-all active:scale-95 ${theme.addBtnBg}`}
                    >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Tambah Path</span>
                    </button>

                    {/* Status Action Button */}
                    {isPublished ? (
                        <button
                            type="button"
                            onClick={onToggleStatus}
                            className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all active:scale-95 ${theme.toggleBtnDraft}`}
                            title="Beralih status katalog ke Draft"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>{theme.toggleBtnDraftText}</span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onToggleStatus}
                            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-600 transition-all hover:bg-emerald-500/20 active:scale-95 dark:text-emerald-400"
                            title="Publish agar dapat diakses publik"
                        >
                            <Check className="h-3.5 w-3.5" />
                            <span>{theme.toggleBtnPublishText}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Paths List */}
            <div className="relative z-10 flex min-h-0 flex-1 flex-col p-6">
                {paths.length === 0 ? (
                    <div className="flex min-h-[250px] flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-800/20">
                        <EmptyIcon className="mb-3 h-12 w-12 text-slate-300 dark:text-slate-700" />
                        <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
                            {theme.emptyText}
                        </p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={onDragEnd}
                    >
                        <SortableContext
                            items={paths.map((p) => p.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-4">
                                {paths.map((path, idx) => (
                                    <SortablePathCard
                                        key={path.id}
                                        path={path}
                                        index={idx}
                                        group={group}
                                        isFundamental={isBasic}
                                        onEdit={onEditPath}
                                        onDelete={onDeletePath}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    );
}
