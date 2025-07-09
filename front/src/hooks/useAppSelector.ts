import { type TypedUseSelectorHook, useSelector } from 'react-redux';
import type { RootState } from '../store/store';

// Typed selector hook that is aware of RootState
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
