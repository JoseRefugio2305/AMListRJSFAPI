import { cutText, getTitleForLink } from "../../../utils/common";
import { useState } from "react";
import { Tooltip } from "flowbite-react";
import { PreviewTooltip } from "./PreviewTooltip";
import { LinkPill } from "./LinkPill";

interface AdpRelLinkProps {
   is_anime: boolean;
   title: string;
   key_am: number;
   image: string;
   type_rel: string;
}

export function AdpRelLink({
   is_anime,
   title,
   key_am,
   image,
   type_rel,
}: AdpRelLinkProps) {
   const [link] = useState<string>(is_anime ? "anime" : "manga");

   return (
      <Tooltip
         content={
            <PreviewTooltip
               type_rel={type_rel}
               title={cutText(title, 30)}
               image={image}
            />
         }
         animation={false}
      >
         {/* <Link
            to={`/${link}/${getTitleForLink(title)}/${key}`}
            className="hover:underline hover:text-white font-bold text-sm m-1 bg-purple-500 rounded-full px-2 py-1 flex w-fit"
            >
            {cutText(title, 25)} <SquareArrowOutUpRightIcon size={16} />
            </Link> */}
         <LinkPill
            link={`/${link}/${getTitleForLink(title)}/${key_am}`}
            textLink={cutText(title, 25)}
         />
      </Tooltip>
   );
}
