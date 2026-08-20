import Image from "next/image";

export default function BrandLogo() {
  return (
    <div className="flex flex-row items-center gap-2">
      <Image
        src="/images/localik.png"
        alt="Rentcars Logo"
        width={82}
        height={26}
        priority
      />
      
    </div>
  );
}
