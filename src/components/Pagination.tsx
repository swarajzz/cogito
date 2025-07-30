import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";
import { MAPS_PER_PAGE } from "@/src/lib/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode } from "react";

const PaginationComponent = ({ totalCount }: { totalCount: number }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const totalPageCount = Math.ceil(totalCount / MAPS_PER_PAGE);

  console.log(totalPageCount);

  function createPageUrl(pageNumber: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());

    return `${pathname}?${params.toString()}`;
  }

  const renderPageNumbers = () => {
    const items: ReactNode[] = [];
    const maxVisiblePages = 5;

    // Show all pages if total is small
    if (totalPageCount <= maxVisiblePages) {
      for (let i = 1; i <= totalPageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={createPageUrl(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      return items;
    }

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink href={createPageUrl(1)} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPageCount - 1, currentPage + 1);

    // Adjust range if we're near the start or end
    if (currentPage <= 3) {
      start = 2;
      end = 4;
    } else if (currentPage >= totalPageCount - 2) {
      start = totalPageCount - 3;
      end = totalPageCount - 1;
    }

    // Show start ellipsis if needed
    if (start > 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Middle page numbers
    for (let i = start; i <= end; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink href={createPageUrl(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show end ellipsis if needed
    if (end < totalPageCount - 1) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page
    items.push(
      <PaginationItem key={totalPageCount}>
        <PaginationLink
          href={createPageUrl(totalPageCount)}
          isActive={currentPage === totalPageCount}
        >
          {totalPageCount}
        </PaginationLink>
      </PaginationItem>
    );

    return items;
  };

  return (
    <Pagination className="p-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageUrl(currentPage - 1)}
            tabIndex={currentPage === 1 ? -1 : undefined}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>

        {renderPageNumbers()}

        <PaginationItem>
          <PaginationNext
            href={createPageUrl(currentPage + 1)}
            tabIndex={currentPage === totalPageCount ? -1 : undefined}
            className={
              currentPage === totalPageCount
                ? "pointer-events-none opacity-50"
                : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
