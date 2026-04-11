import { useState, useEffect } from "react";

interface DiscordInviteData {
  approximate_presence_count: number;
  approximate_member_count: number;
  guild: {
    id: string;
    name: string;
  };
}

export const useDiscordMembers = (inviteCode: string) => {
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use the invite API with ?with_counts=true to get member counts
        const response = await fetch(
          `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          // If invite API fails, we can't get live count - fail silently
          console.warn(`Discord invite API not available: ${response.status}`);
          setMemberCount(null);
          setIsLoading(false);
          return;
        }

        const data: DiscordInviteData = await response.json();
        // Use approximate_presence_count for online members
        setMemberCount(data.approximate_presence_count);
      } catch (err) {
        console.warn("Could not fetch Discord members:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch member count");
        setMemberCount(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [inviteCode]);

  return { memberCount, isLoading, error };
};
