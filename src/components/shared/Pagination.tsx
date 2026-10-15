"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  pageCount: number;
}

export default function Pagination({ pageCount }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const handlePageClick = (event: { selected: number }) => {
    const newPage = event.selected + 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={<>Next <ChevronRight size={18} /></>}
      previousLabel={<><ChevronLeft size={18} /> Previous</>}
      onPageChange={handlePageClick}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      forcePage={currentPage - 1}
      containerClassName="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-white/5 flex-wrap w-full"
      pageLinkClassName="flex items-center justify-center w-10 h-10 rounded-xl bg-base-900 border border-white/10 text-sm font-bold text-base-400 hover:bg-primary-600/20 hover:text-primary-400 hover:border-primary-500/50 transition-all cursor-pointer"
      activeLinkClassName="!bg-primary-500/20 !border-primary-500 !text-primary-400 shadow-[0_0_15px_rgba(170,79,255,0.2)]"
      previousLinkClassName="flex items-center gap-2 px-5 h-10 rounded-xl bg-base-900 border border-white/10 text-sm font-bold text-white hover:border-primary-500 hover:text-primary-400 transition-colors cursor-pointer"
      nextLinkClassName="flex items-center gap-2 px-5 h-10 rounded-xl bg-base-900 border border-white/10 text-sm font-bold text-white hover:border-primary-500 hover:text-primary-400 transition-colors cursor-pointer"
      disabledLinkClassName="opacity-50 cursor-not-allowed hover:border-white/10 hover:text-white pointer-events-none"
      breakLinkClassName="flex items-center justify-center w-10 h-10 text-base-500"
    />
  );
}