import Link from "next/link";
import { FaStar } from "react-icons/fa6";
import { FiMapPin } from "react-icons/fi";
import SmartImage from "@/components/SmartImage";

export default function StudioCard({ studio }) {
  return (
    <article className="card h-full bg-base-100 shadow-sm">
      <figure className="relative">
        <SmartImage src={studio.imageUrl} alt={studio.title} className="h-48 w-full" label="Studio image" />
        <span className="badge badge-primary absolute left-3 top-3">{studio.category}</span>
      </figure>
      <div className="card-body flex-1 gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="card-title line-clamp-1 text-lg">{studio.title}</h3>
          <span className="badge badge-outline gap-1 whitespace-nowrap">
            <FaStar className="text-warning" aria-hidden /> {studio.rating ? studio.rating.toFixed(1) : "New"}
          </span>
        </div>
        <p className="flex items-center gap-1 text-sm text-base-content/70"><FiMapPin aria-hidden /> <span className="line-clamp-1">{studio.location}</span></p>
        <p className="text-lg font-bold">${studio.hourlyRate} <span className="text-sm font-normal text-base-content/70">/ hr</span></p>
        <Link href={`/studios/${studio._id}`} className="btn btn-primary mt-auto w-full">View Details</Link>
      </div>
    </article>
  );
}
