'use client';

import { CARDS_PER_PAGE } from '@/app/const';
import { useCardsStore } from '@/store/cards-store';
import Box from '@mui/material/Box/Box';
import FormControl from '@mui/material/FormControl/FormControl';
import InputLabel from '@mui/material/InputLabel/InputLabel';
import NativeSelect from '@mui/material/NativeSelect/NativeSelect';
import Skeleton from '@mui/material/Skeleton/Skeleton';

export default function CardsPerPage() {
  const setCardsPerPageCount = useCardsStore(
    (state) => state.setCardsPerPageCount
  );

  const mainPageCount = useCardsStore((state) => state.mainPageCount);

  const handleChange = (event: { target: { value: string } }) => {
    setCardsPerPageCount(Number(event.target.value));
  };

  if (mainPageCount === 0) {
    return;
  }

  return (
    <div>
      {!mainPageCount ? (
        <Skeleton variant='rectangular' width={120} height={40} />
      ) : (
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel variant='standard' htmlFor='native'>
              кількість карток
            </InputLabel>
            <NativeSelect
              onChange={handleChange}
              defaultValue={CARDS_PER_PAGE}
              inputProps={{
                name: 'items-per-page',
                id: 'native',
              }}
            >
              <option value={CARDS_PER_PAGE}>{CARDS_PER_PAGE}</option>
              <option value={10}>10</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </NativeSelect>
          </FormControl>
        </Box>
      )}
    </div>
  );
}
