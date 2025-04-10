import { GitHubUser, GitHubRepo, CommitActivity } from "../types/github";
const BASE_URL = "https://api.github.com";
export const fetchUser = async (username: string): Promise<GitHubUser> => {
  const response = await fetch(`${BASE_URL}/users/${username}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    throw new Error("Failed to fetch user data");
  }
  return response.json();
};

export const fetchRepositories = async (username: string): Promise<GitHubRepo[]> => {
  const response = await fetch(`${BASE_URL}/users/${username}/repos?sort=updated&per_page=100`);
  if (!response.ok) {
    throw new Error("Failed to fetch repositories");
  }
  return response.json();
};

export const fetchCommitActivity = async (username: string, repo: string): Promise<CommitActivity[]> => {
  const response = await fetch(`${BASE_URL}/repos/${username}/${repo}/stats/commit_activity`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch commit activity");
  }
  
  return response.json();
};

export const fetchUserCommitActivity = async (username: string): Promise<number[]> => {
  try {
    // Get user's repositories
    const repos = await fetchRepositories(username);
    
    // Get first 5 non-fork repositories to analyze
    const reposToAnalyze = repos
      .filter(repo => !repo.fork)
      .slice(0, 5);
    
    // Create an array to store daily commits (for the last week)
    const dailyCommits = [0, 0, 0, 0, 0, 0, 0]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
    
    // Fetch commit activity for each repository
    const activityPromises = reposToAnalyze.map(repo => 
      fetchCommitActivity(username, repo.name).catch(() => [])
    );
    const activitiesResults = await Promise.all(activityPromises);
    // Process commit activity data
    activitiesResults.forEach(activities => {
      if (activities.length > 0) {
        // Get the most recent week's data
        const latestWeek = activities[activities.length - 1];
        // Add to our daily count
        latestWeek.days.forEach((dayCount, index) => {
          dailyCommits[index] += dayCount;
        });
      }
    });
    return dailyCommits;
  } catch (error) {
    console.error("Error fetching user commit activity:", error);
    return [0, 0, 0, 0, 0, 0, 0];
  }
};
