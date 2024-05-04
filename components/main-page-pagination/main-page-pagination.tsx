'use client';

import { useCardsStore } from '@/store/cards-store';
import Pagination from '@mui/material/Pagination';

export default function MainPagePagination() {
  const mainPageCount = useCardsStore((state) => state.mainPageCount);
  const setMainPageCurrentPage = useCardsStore(
    (state) => state.setMainPageCurrentPage
  );
  const mainPageCurrentPage = useCardsStore(
    (state) => state.mainPageCurrentPage
  );

  const handlePageChange = (evt: React.ChangeEvent<unknown>, value: number) => {
    setMainPageCurrentPage(value);
  };

  return (
    <div>
      <Pagination
        onChange={handlePageChange}
        count={mainPageCount}
        size='large'
        page={mainPageCount < mainPageCurrentPage ? 1 : mainPageCurrentPage}
        siblingCount={0}
        disabled={!mainPageCount || mainPageCount === 0}
      />
    </div>
  );
}
