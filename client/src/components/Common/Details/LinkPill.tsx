import { SquareArrowOutUpRightIcon } from "lucide-react";
import { Link } from "react-router";

interface LinkPillProps {
   link: string;
   textLink: string;
}

export function LinkPill({ link, textLink }: LinkPillProps) {
   return (
      <Link
         to={link}
         className="hover:underline hover:text-white font-bold text-sm m-1 bg-purple-500 rounded-full px-2 py-1 flex w-fit"
      >
         {textLink} <SquareArrowOutUpRightIcon size={16} />
      </Link>
   );
}
