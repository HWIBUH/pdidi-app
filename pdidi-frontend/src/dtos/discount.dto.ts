import type { Discount } from '@/model/discount.model';

export type DiscountResponse = Omit<Discount, 'id'>;
export type DiscountRequest = Omit<Discount, 'id' | 'slotsUsed'>