import React from 'react';
import { Check, ChevronDown, RotateCcw } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface MultiSelectDropdownProps {
  label: string;
  placeholder: string;
  options: FilterOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}

interface FilterPanelProps {
  categories: FilterOption[];
  selectedCategories: string[];
  onToggleCategory: (value: string) => void;
  onClearCategories: () => void;
  networks: FilterOption[];
  selectedNetworks: string[];
  onToggleNetwork: (value: string) => void;
  onClearNetworks: () => void;
  languages: string[];
  selectedLanguages: string[];
  onToggleLanguage: (value: string) => void;
  author: string;
  onAuthorChange: (value: string) => void;
  verifiedOnly: boolean;
  onVerifiedChange: (value: boolean) => void;
  activeFilterCount: number;
  onResetAll: () => void;
}

function getSummaryText(
  selectedValues: string[],
  options: FilterOption[],
  placeholder: string,
) {
  if (selectedValues.length === 0) {
    return placeholder;
  }

  const selectedLabels = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label);

  if (selectedLabels.length <= 2) {
    return selectedLabels.join(', ');
  }

  return `${selectedLabels.slice(0, 2).join(', ')} +${selectedLabels.length - 2}`;
}

function MultiSelectDropdown({
  label,
  placeholder,
  options,
  selectedValues,
  onToggle,
  onClear,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="space-y-2" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {selectedValues.length > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
            {selectedValues.length} selected
          </span>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5 text-left text-sm text-foreground shadow-sm transition-colors hover:border-primary/40"
        >
          <span className={selectedValues.length > 0 ? 'text-foreground' : 'text-muted-foreground'}>
            {getSummaryText(selectedValues, options, placeholder)}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
            <div className="max-h-64 overflow-y-auto p-2">
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onToggle(option.value)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                      isSelected ? 'bg-primary/10 text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-input bg-background'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </span>
                      <span>{option.label}</span>
                    </div>
                    {option.count !== undefined && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                        {option.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-border px-3 py-2">
              <span className="text-xs text-muted-foreground">
                {selectedValues.length === 0 ? 'No filters selected' : `${selectedValues.length} selected`}
              </span>
              <button
                type="button"
                onClick={onClear}
                disabled={selectedValues.length === 0}
                className="text-xs font-medium text-primary disabled:cursor-not-allowed disabled:text-muted-foreground"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function FilterPanel({
  categories,
  selectedCategories,
  onToggleCategory,
  onClearCategories,
  networks,
  selectedNetworks,
  onToggleNetwork,
  onClearNetworks,
  languages,
  selectedLanguages,
  onToggleLanguage,
  author,
  onAuthorChange,
  verifiedOnly,
  onVerifiedChange,
  activeFilterCount,
  onResetAll,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    categories: true,
    networks: true,
    languages: true,
    other: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-muted/30 px-3 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Refine discovery</p>
          <p className="text-xs text-muted-foreground">
            {activeFilterCount === 0
              ? 'No filters applied'
              : `${activeFilterCount} active filter${activeFilterCount === 1 ? '' : 's'}`}
          </p>
        </div>
        <button
          type="button"
          onClick={onResetAll}
          disabled={activeFilterCount === 0}
          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:text-muted-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('categories')}
          className="flex w-full items-center justify-between text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          <span>Categories</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedSections.categories && (
          <MultiSelectDropdown
            label="Category filters"
            placeholder="Choose categories"
            options={categories}
            selectedValues={selectedCategories}
            onToggle={onToggleCategory}
            onClear={onClearCategories}
          />
        )}
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('networks')}
          className="flex w-full items-center justify-between text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          <span>Networks</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${expandedSections.networks ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedSections.networks && (
          <MultiSelectDropdown
            label="Network filters"
            placeholder="Choose networks"
            options={networks}
            selectedValues={selectedNetworks}
            onToggle={onToggleNetwork}
            onClear={onClearNetworks}
          />
        )}
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('languages')}
          className="flex w-full items-center justify-between text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          <span>Languages</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${expandedSections.languages ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedSections.languages && (
          <div className="space-y-2 pt-1">
            {languages.map((language) => (
              <label
                key={language}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center justify-center w-4 h-4 rounded border transition-colors ${
                      selectedLanguages.includes(language)
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-input group-hover:border-primary'
                    }`}
                  >
                    {selectedLanguages.includes(language) && (
                      <Check className="w-3 h-3" />
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {language}
                  </span>
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selectedLanguages.includes(language)}
                  onChange={() => onToggleLanguage(language)}
                />
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('other')}
          className="flex w-full items-center justify-between text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          <span>Other filters</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${expandedSections.other ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedSections.other && (
          <div className="space-y-4 pt-1">
            <label className="flex items-center gap-2 group cursor-pointer">
              <div
                className={`flex items-center justify-center w-4 h-4 rounded border transition-colors ${
                  verifiedOnly
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-input group-hover:border-primary'
                }`}
              >
                {verifiedOnly && <Check className="w-3 h-3" />}
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Verified contracts only
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={verifiedOnly}
                onChange={(event) => onVerifiedChange(event.target.checked)}
              />
            </label>

            <div className="space-y-1.5">
              <label htmlFor="author-input" className="text-xs text-muted-foreground font-medium">
                Author
              </label>
              <input
                id="author-input"
                type="text"
                placeholder="Filter by author..."
                value={author}
                onChange={(event) => onAuthorChange(event.target.value)}
                className="w-full px-3 py-1.5 rounded-md border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
