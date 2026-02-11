import { cn } from "@/lib/utils";

import { Logo, LogoImage, LogoText } from "@/components/ui/logo";
import footerLogo from "../../../public/logo.webp";
import Image from "next/image";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  className?: string;
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer = ({
  logo = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg",
    alt: "logo",
    title: "FoodHub",
    url: "/",
  },
  className,
  tagline = "Discover & Order Delicious Meals",
  menuItems = [
    {
      title: "Product",
      links: [
        { text: "Overview", url: "#" },
        { text: "Pricing", url: "#" },
        { text: "Marketplace", url: "#" },
        { text: "Features", url: "#" },
        { text: "Integrations", url: "#" },
        { text: "Pricing", url: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", url: "#" },
        { text: "Team", url: "#" },
        { text: "Blog", url: "#" },
        { text: "Careers", url: "#" },
        { text: "Contact", url: "#" },
        { text: "Privacy", url: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { text: "Help", url: "#" },
        { text: "Sales", url: "#" },
        { text: "Advertise", url: "#" },
      ],
    },
  ],
  copyright = `© ${new Date().getFullYear()} FoodHub. All rights reserved.`,
  bottomLinks = [
    { text: "Terms and Conditions", url: "#" },
    { text: "Privacy Policy", url: "#" },
  ],
}: Footer2Props) => {
  return (
    <section
      className={cn(
        "pt-16 pb-8 px-4 sm:pt-24 sm:pb-12 sm:px-8 lg:pt-32 lg:pb-12 lg:px-16",
        className,
      )}
    >
      <div className="container mx-auto px-0 sm:px-4">
        <footer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-5">
            <div className="mb-8 md:mb-0 flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Logo url="/">
                  <Image
                    src={footerLogo}
                    alt={logo.alt}
                    title={logo.title}
                    className="h-10 w-fit dark:invert"
                  />
                </Logo>
              </div>
              <p className="mt-4 font-medium text-muted-foreground text-center md:text-left">
                {tagline}
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-8 md:flex-row md:justify-center md:gap-20">
              {menuItems.map((section, sectionIdx) => (
                <div
                  key={sectionIdx}
                  className="w-full md:w-auto flex flex-col items-center md:items-start"
                >
                  <h3 className="mb-4 text-primary font-bold text-center md:text-left">
                    {section.title}
                  </h3>
                  <ul className="space-y-4 text-muted-foreground">
                    {section.links.map((link, linkIdx) => (
                      <li
                        key={linkIdx}
                        className="text-sm font-medium hover:text-primary text-center md:text-left"
                      >
                        <a href={link.url}>{link.text}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 md:mt-16 flex flex-col items-center md:flex-row md:justify-between gap-4 border-t pt-6 md:pt-8 text-sm font-medium text-muted-foreground">
            <p className="text-center md:text-left">{copyright}</p>
            <ul className="flex flex-wrap justify-center gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="underline hover:text-primary">
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Footer;
