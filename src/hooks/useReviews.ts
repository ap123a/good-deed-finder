import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Review } from "@/types/database";

export const useOrganizationReviews = (organizationId: string) => {
  return useQuery({
    queryKey: ["reviews", "organization", organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!organizationId,
  });
};

export const useListingReviews = (listingId: string) => {
  return useQuery({
    queryKey: ["reviews", "listing", listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("listing_id", listingId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!listingId,
  });
};

export const useOrganizationStats = (organizationId: string) => {
  return useQuery({
    queryKey: ["organization-stats", organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("organization_id", organizationId);

      if (error) throw error;

      if (!data || data.length === 0) {
        return { averageRating: 0, reviewCount: 0 };
      }

      const sum = data.reduce((acc, review) => acc + review.rating, 0);
      return {
        averageRating: Math.round((sum / data.length) * 10) / 10,
        reviewCount: data.length,
      };
    },
    enabled: !!organizationId,
  });
};
