import Image from "next/image";

export interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  quote: string;
  imageSrc: string;
}

export default function TestimonialCard({
  name,
  location,
  rating,
  quote,
  imageSrc,
}: TestimonialCardProps) {
  return (
    <div className="flex flex-col lg:flex-row items-center w-full lg:max-w-[700px] lg:h-[438px] rounded-testimonial-card bg-white shadow-testimonial-card overflow-hidden">
      
      {/* Testimonial Photo */}
      <div className="relative w-full lg:w-[320px] xl:w-[350px] h-[300px] lg:h-full flex-shrink-0">
        <Image
          src={imageSrc}
          alt={name}
          fill
          sizes="(max-width: 1024px) 100vw, 350px"
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Testimonial Content */}
      <div className="flex flex-col justify-center gap-8 lg:gap-10 p-8 lg:p-10 flex-1 text-left w-full">
        
        {/* Rating Block */}
        <div className="flex flex-col gap-4">
          <span className="font-sans font-medium text-xl lg:text-2xl leading-[36px] text-text-stars">
            {rating.toFixed(1)} étoiles
          </span>
          <div className="flex flex-row gap-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <svg
                key={idx}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#EFBF14"
                stroke="#EFBF14"
                className="w-6 h-6 flex-shrink-0"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
        </div>

        {/* Review Quote & Author Details */}
        <div className="flex flex-col gap-6 lg:gap-10">
          <blockquote className="font-sans font-normal text-base lg:text-lg leading-[27px] text-text-quote max-w-[317px]">
            {quote}
          </blockquote>
          
          <div className="flex flex-col gap-2">
            <cite className="font-sans font-medium text-xl lg:text-2xl leading-[36px] text-text-author not-italic">
              {name}
            </cite>
            <span className="font-sans font-normal text-sm leading-[21px] text-text-location">
              {location}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
