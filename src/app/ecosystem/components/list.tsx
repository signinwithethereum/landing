import { integrations } from "@/lib/integrations";
import ListItem from "./list-item";

interface ListProps {
  search: string;
  filters: {
    all: boolean;
    wallets: boolean;
    apps: boolean;
    tools: boolean;
  };
}
const interleaveByType = (items: typeof integrations) => {
  const wallets = items.filter((i) => i.type === "wallet");
  const tools = items.filter((i) => i.type === "tool");
  const apps = items.filter((i) => i.type === "app");

  const groups = [apps, tools, wallets];
  const result: typeof integrations = [];
  const maxLen = Math.max(wallets.length, tools.length, apps.length);

  for (let i = 0; i < maxLen; i++) {
    // Rotate starting position each row so types don't stay in same column
    for (let j = 0; j < 3; j++) {
      const groupIndex = (i + j) % 3;
      if (groups[groupIndex][i]) result.push(groups[groupIndex][i]);
    }
  }

  return result;
};

const List = ({ search, filters }: ListProps) => {
  const filteredIntegrations = integrations.filter((integration) => {
    if (filters.all) return true;
    if (filters.wallets && integration.type === "wallet") return true;
    if (filters.apps && integration.type === "app") return true;
    if (filters.tools && integration.type === "tool") return true;
    return false;
  });

  const searchedIntegrations = filteredIntegrations.filter((integration) => {
    if (search === "") return true;
    return integration.name.toLowerCase().includes(search.toLowerCase());
  });

  const displayIntegrations = filters.all
    ? interleaveByType(searchedIntegrations)
    : searchedIntegrations;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 w-full">
      {displayIntegrations.map((integration) => (
        <ListItem key={integration.name} integration={integration} />
      ))}
    </div>
  );
};

export default List;
