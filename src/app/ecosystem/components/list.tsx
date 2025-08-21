import { integrations } from '@/lib/integrations';
import ListItem from './list-item';

interface ListProps {
  search: string;
  filters: {
    all: boolean;
    wallets: boolean;
    apps: boolean;
    tools: boolean;
  };
}
const List = ({ search, filters }: ListProps) => {

  const filteredIntegrations = integrations.filter(integration => {
    if (filters.all) return true;
    if (filters.wallets && integration.type === 'wallet') return true;
    if (filters.apps && integration.type === 'app') return true;
    if (filters.tools && integration.type === 'tool') return true;
    return false;
  });

  const searchedIntegrations = filteredIntegrations.filter(integration => {
    if (search === '') return true;
    return integration.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 w-full'>
      {searchedIntegrations.map(integration => (
        <ListItem key={integration.name} integration={integration} />
      ))}
    </div>
  )
}

export default List;