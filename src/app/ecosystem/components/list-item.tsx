import { Integration } from "@/lib/types";
import Image from "next/image";
import React from "react";

interface ListItemProps {
  integration: Integration;
}

const ListItem = ({ integration }: ListItemProps) => {
  return (
    <a
      key={integration.name}
      href={integration.link}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:bg-accent/20 transition-all duration-300 flex flex-col items-center justify-center border-2 h-40 rounded-lg p-4 border-accent"
    >
      <Image
        src={`/assets/integrations/${integration.type}/${integration.logo}`}
        alt={integration.name}
        width={100}
        height={100}
        className="w-52 max-h-20 object-contain"
      />
    </a>
  );
};

export default ListItem;
