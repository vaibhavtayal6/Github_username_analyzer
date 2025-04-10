import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchUser, fetchRepositories, fetchUserCommitActivity } from '../services/github';
import { GitHubUser, GitHubRepo } from '../types/github';
import { useNavigate } from 'react-router-dom';

import SearchForm from '../components/SearchForm';
import ProfileOverview from '../components/ProfileOverview';
import RepositoryList from '../components/RepositoryList';
import CommitActivityChart from '../components/CommitActivityChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Github } from 'lucide-react';

const Index = () => {
  const [username, setUsername] = useState<string>('');
  const navigate = useNavigate();

  // Query for user data
  const userQuery = useQuery({
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    enabled: !!username,
    retry: false,
    onError: (error: Error) => {
      if (error.message === 'User not found') {
        navigate('/not-found', { 
          state: { 
            message: `User "${username}" not found`,
            returnPath: '/'
          } 
        });
      } else {
        toast.error('Failed to fetch user data');
      }
      console.error('User query error:', error);
    }
  });

  // Query for repositories
  const reposQuery = useQuery({
    queryKey: ['repos', username],
    queryFn: () => fetchRepositories(username),
    enabled: !!username && userQuery.isSuccess,
    retry: false,
    onError: (error: Error) => {
      toast.error('Failed to fetch repositories');
      console.error('Repository query error:', error);
    }
  });

  // Query for commit activity
  const commitActivityQuery = useQuery({
    queryKey: ['commitActivity', username],
    queryFn: () => fetchUserCommitActivity(username),
    enabled: !!username && reposQuery.isSuccess,
    retry: false,
    onError: (error: Error) => {
      toast.error('Failed to fetch commit activity data');
      console.error('Commit activity error:', error);
    }
  });

  const handleSearch = (newUsername: string) => {
    setUsername(newUsername);
  };

  const isLoading = userQuery.isLoading || reposQuery.isLoading;
  const hasData = userQuery.isSuccess;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 shadow-sm py-4 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Github className="h-8 w-8" />
              <h1 className="text-xl font-bold">GitHub Profile Analyzer</h1>
            </div>
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-16">
        {isLoading && <LoadingSpinner />}

        {!username && !isLoading && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Welcome to GitHub Profile Analyzer</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p>Enter a GitHub username to analyze their profile and repositories.</p>
              <div className="mx-auto max-w-md">
                <SearchForm onSearch={handleSearch} isLoading={isLoading} />
              </div>
            </CardContent>
          </Card>
        )}

        {hasData && userQuery.data && (
          <div className="space-y-8">
            <ProfileOverview user={userQuery.data} />
            
            <Tabs defaultValue="repositories" className="w-full">
              <TabsList>
                <TabsTrigger value="repositories">Repositories ({userQuery.data.public_repos})</TabsTrigger>
                <TabsTrigger value="activity">Commit Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="repositories" className="mt-6">
                {reposQuery.isLoading && <LoadingSpinner />}
                {reposQuery.isSuccess && reposQuery.data && (
                  <RepositoryList repositories={reposQuery.data} />
                )}
              </TabsContent>
              <TabsContent value="activity" className="mt-6">
                {commitActivityQuery.isLoading && <LoadingSpinner />}
                {commitActivityQuery.isSuccess && commitActivityQuery.data && (
                  <CommitActivityChart 
                    commitData={commitActivityQuery.data} 
                    username={username} 
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
      <footer className="bg-white dark:bg-slate-800 py-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>GitHub Profile Analyzer</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
