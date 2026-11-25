import type { ReviewItem } from '../types';

export const INITIAL_SAMPLE_REVIEWS: ReviewItem[] = [
  {
    id: 'sample-1',
    customerName: 'Aravind Subramanian',
    rating: 5,
    reviewText:
      'The Banana Leaf Meals and Ghee Dosa reminded me of festive family lunches in Madurai. Crisp texture and very thoughtful packaging.',
    reviewDate: 'Sample Review · Nov 2026',
    isSample: true,
  },
  {
    id: 'sample-2',
    customerName: 'Meenakshi Sundaram',
    rating: 5,
    reviewText:
      'Ordered Chicken Chettinad, Mutton Chukka, and Filter Coffee for Sunday dinner. The roasted pepper aroma and balance of spices were spot on.',
    reviewDate: 'Sample Review · Nov 2026',
    isSample: true,
  },
  {
    id: 'sample-3',
    customerName: 'Karthik Rajagopal',
    rating: 4,
    reviewText:
      'Soft idlis, hot sambar, and refreshing chilled Rose Milk. Ordering on the website was quick and effortless.',
    reviewDate: 'Sample Review · Oct 2026',
    isSample: true,
  },
];
