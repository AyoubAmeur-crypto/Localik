import Image from "next/image";

interface SearchFieldProps {
  icon: "location" | "calendar";
  title: string;
  value: string;
  hasLeftBorder?: boolean;
  isPlaceholder?: boolean;
}

export default function SearchField({
  icon,
  title,
  value,
  hasLeftBorder = false,
  isPlaceholder = false,
}: SearchFieldProps) {
  const iconSrc = icon === "location" ? "/images/icon-location.svg" : "/images/icon-calendar.svg";

  return (
    <div
      className={`flex flex-row items-center gap-4 w-full md:w-auto ${
        hasLeftBorder ? "md:border-l md:border-border-gray md:pl-6" : ""
      }`}
    >
      <Image
        src={iconSrc}
        alt={title}
        width={32}
        height={32}
        className="flex-shrink-0 object-contain"
        priority
      />
      <div className="flex flex-col justify-between h-[37px]">
        <span className="font-sans font-medium text-base leading-6 text-label-dark">
          {title}
        </span>
        <span
          className={`font-sans font-normal text-sm leading-[21px] ${
            isPlaceholder ? "text-placeholder-gray" : "text-label-dark"
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
