import { integrations } from "@/lib/integrations";
import Link from "next/link";
import ListItem from "../ecosystem/components/list-item";

export default function FeaturedIntegrations() {
  return (
    <section className="pb-16 max-w-[1560px] mx-auto sm:pb-28 pt-20 sm:pt-36 [background-image:linear-gradient(transparent,#222222,#222222,#222222)]">
      <div className="">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white sm:mb-4">
            Featured Integrations
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center gap-8 px-6 max-w-5xl mx-auto">
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 justify-center items-center lg:grid-cols-3 w-full'>
            {integrations.slice(0, 6).map(integration => (
              <ListItem key={integration.name} integration={integration} />
            ))}
          </div>
          <Link href="/ecosystem" className="bg-accent font-semibold text-center hover:opacity-80 cursor-pointer transition-all duration-300 text-black px-4 py-2 w-full lg:max-w-[304px] rounded-md">View All</Link>
        </div>
      </div>
    </section>
  );
}
