export interface CategoryDetails {
  details: string;
  otherdetails?: string;
  _id?: string;
}

export interface Category {
  categoryID: string;
  name: string;
  slug: string;
  categoryDetails?: CategoryDetails;
  id?: string;
}
