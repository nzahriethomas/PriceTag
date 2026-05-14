// Define interface for listing data.
interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  created_at: string;
}

export type { Listing };

interface Profile {
  firstName: string;
  lastName: string;
  avatar: string;
}
export type { Profile };
