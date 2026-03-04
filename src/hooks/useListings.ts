import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingWithOrganization, ListingCardData } from "@/types/database";

// Transform database listing to card data format
export const transformToCardData = (listing: ListingWithOrganization): ListingCardData => ({
  id: listing.id,
  title: listing.title,
  organization: listing.organizations?.name || "Privātpersona",
  location: listing.location,
  category: listing.category,
  description: listing.description,
  timeCommitment: listing.time_commitment || "Nav norādīts",
  spots: listing.spots || 1,
  isUrgent: listing.is_urgent || false,
  isNew: listing.is_new || false,
  isOnline: listing.is_online || false,
});

export const useListings = (filters?: {
  category?: string;
  city?: string;
  search?: string;
  isOnline?: boolean;
  isUrgent?: boolean;
  timeCommitment?: string;
}) => {
  return useQuery({
    queryKey: ["listings", filters],
    queryFn: async () => {
      let query = supabase
        .from("listings")
        .select(`
          *,
          organizations (*)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (filters?.category && filters.category !== "Visi") {
        query = query.eq("category", filters.category);
      }

      if (filters?.city && filters.city !== "Visas pilsētas") {
        query = query.eq("location", filters.city);
      }

      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      if (filters?.isOnline) {
        query = query.eq("is_online", true);
      }

      if (filters?.isUrgent) {
        query = query.eq("is_urgent", true);
      }

      if (filters?.timeCommitment && filters.timeCommitment !== "Visi") {
        query = query.eq("time_commitment", filters.timeCommitment);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data as unknown as ListingWithOrganization[]).map(transformToCardData);
    },
  });
};

export const useFeaturedListings = (limit = 6) => {
  return useQuery({
    queryKey: ["featured-listings", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select(`
          *,
          organizations (*)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data as unknown as ListingWithOrganization[]).map(transformToCardData);
    },
  });
};

export const useListing = (id: string) => {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select(`
          *,
          organizations (*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as unknown as ListingWithOrganization;
    },
    enabled: !!id,
  });
};
