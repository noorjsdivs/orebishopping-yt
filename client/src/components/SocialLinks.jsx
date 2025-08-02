import React from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { twMerge } from "tailwind-merge";

const linkData = [
  { icon: <FaGithub />, href: "https://github.com/" },
  { icon: <FaYoutube />, href: "https://www.youtube.com/@reactjsBD" },
  {
    icon: <FaLinkedin />,
    href: "https://www.linkedin.com/in/noor-mohammad-ab2245193/",
  },
  { icon: <FaFacebook />, href: "https://www.youtube.com/@reactjsBD" },
  { icon: <FaEnvelope />, href: "https://www.youtube.com/@reactjsBD" },
];

const SocialLinks = ({ className, iconStyle }) => {
  return (
    <div
      className={twMerge(
        "text-xl pt-2 text-white/50 flex items-center gap-x-2",
        className
      )}
    >
      {linkData?.map((item, index) => (
        <a
          key={index}
          href={item?.href}
          className={twMerge(
            "border border-white/20 inline-flex p-2 rounded-full hover:text-white hover:border-white duration-300 cursor-pointer",
            iconStyle
          )}
        >
          {item?.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
