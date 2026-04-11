import { useState, useEffect } from "react";

interface GitHubRepoData {
  stargazers_count: number;
  name: string;
  full_name: string;
}

export const useGitHubStars = (repoOwner: string, repoName: string) => {
  const [stars, setStars] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch repository data: ${response.status}`);
        }

        const data: GitHubRepoData = await response.json();
        setStars(data.stargazers_count);
      } catch (err) {
        console.error("Error fetching GitHub stars:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch stars");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStars();
  }, [repoOwner, repoName]);

  return { stars, isLoading, error };
};
