import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Message {
  id: string;
  application_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export const useMessages = (applicationId: string | null) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["messages", applicationId],
    queryFn: async () => {
      if (!applicationId) return [];
      
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("application_id", applicationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!applicationId,
  });

  // Subscribe to realtime updates
  useEffect(() => {
    if (!applicationId) return;

    const channel = supabase
      .channel(`messages-${applicationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `application_id=eq.${applicationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["messages", applicationId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [applicationId, queryClient]);

  return query;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      content,
      senderId,
    }: {
      applicationId: string;
      content: string;
      senderId: string;
    }) => {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          application_id: applicationId,
          sender_id: senderId,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.applicationId] });
      queryClient.invalidateQueries({ queryKey: ["unread-messages"] });
    },
  });
};

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      currentUserId,
    }: {
      applicationId: string;
      currentUserId: string;
    }) => {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("application_id", applicationId)
        .neq("sender_id", currentUserId)
        .eq("is_read", false);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.applicationId] });
      queryClient.invalidateQueries({ queryKey: ["unread-messages"] });
    },
  });
};

export const useUnreadMessagesCount = (applicationId: string | null, currentUserId: string | null) => {
  return useQuery({
    queryKey: ["unread-messages", applicationId],
    queryFn: async () => {
      if (!applicationId || !currentUserId) return 0;

      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("application_id", applicationId)
        .neq("sender_id", currentUserId)
        .eq("is_read", false);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!applicationId && !!currentUserId,
  });
};
