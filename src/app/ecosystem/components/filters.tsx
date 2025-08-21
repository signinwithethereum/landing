import { integrations } from "@/lib/integrations";
import React, { useEffect } from "react";

interface FiltersProps {
  filters: {
    all: boolean;
    wallets: boolean;
    apps: boolean;
    tools: boolean;
  };
  setFilters: (filters: {
    all: boolean;
    wallets: boolean;
    apps: boolean;
    tools: boolean;
  }) => void;
}

const Filters = ({ filters, setFilters }: FiltersProps) => {
  const handleFilterClick = (filter: keyof FiltersProps["filters"]) => {
    if (filter === "all") {
      setFilters({ all: true, wallets: false, apps: false, tools: false });
    } else {
      setFilters({ ...filters, all: false, [filter]: !filters[filter] });
    }
  };

  useEffect(() => {
    if (Object.values(filters).every((filter) => filter === false)) {
      setFilters({ ...filters, all: true });
    }
  }, [filters, setFilters]);

  const filterCounts = {
    all: integrations.length,
    wallets: integrations.filter((integration) => integration.type === "wallet")
      .length,
    apps: integrations.filter((integration) => integration.type === "app")
      .length,
    tools: integrations.filter((integration) => integration.type === "tool")
      .length,
  };

  return (
    <div className="flex gap-3 flex-wrap max-w-full">
      <button
        onClick={() => handleFilterClick("all")}
        className={`flex transition-all duration-300 cursor-pointer items-center justify-center gap-2 rounded-md bg-neutral-800 py-2 px-4 border-2 ${filters.all ? "bg-accent/20! border-accent" : "border-gray-400 hover:bg-gray-600 bg-transparent"}`}
      >
        <p className="font-semibold">All</p>
        <p className="text-sm text-gray-300">{filterCounts.all}</p>
      </button>
      <button
        onClick={() => handleFilterClick("wallets")}
        className={`flex transition-all duration-300 cursor-pointer items-center justify-center gap-2 rounded-md bg-neutral-800 py-2 px-4 border-2  ${filters.wallets ? "bg-accent/20! border-accent" : "border-gray-400 hover:bg-gray-600 bg-transparent"}`}
      >
        <p className="font-semibold">Wallets</p>
        <p className="text-sm text-gray-300">{filterCounts.wallets}</p>
      </button>
      <button
        onClick={() => handleFilterClick("apps")}
        className={`flex transition-all duration-300 cursor-pointer items-center justify-center gap-2 rounded-md bg-neutral-800 py-2 px-4 border-2 ${filters.apps ? "bg-accent/20! border-accent" : "border-gray-400 hover:bg-gray-600 bg-transparent"}`}
      >
        <p className="font-semibold">Apps</p>
        <p className="text-sm text-gray-300">{filterCounts.apps}</p>
      </button>
      <button
        onClick={() => handleFilterClick("tools")}
        className={`flex transition-all duration-300 cursor-pointer items-center justify-center gap-2 rounded-md bg-neutral-800 py-2 px-4 border-2 ${filters.tools ? "bg-accent/20! border-accent" : "border-gray-400 hover:bg-gray-600 bg-transparent"}`}
      >
        <p className="font-semibold">Tools</p>
        <p className="text-sm text-gray-300">{filterCounts.tools}</p>
      </button>
    </div>
  );
};

export default Filters;
