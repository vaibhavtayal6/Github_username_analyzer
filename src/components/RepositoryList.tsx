
import React, { useState } from 'react';
import { GitHubRepo } from '../types/github';
import RepositoryCard from './RepositoryCard';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface RepositoryListProps {
  repositories: GitHubRepo[];
}

type SortOption = 'updated' | 'stars' | 'forks' | 'name';

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  
  // Filter repositories based on search term
  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (repo.topics && repo.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
  // Sort repositories
  const sortedRepos = [...filteredRepos].sort((a, b) => {
    switch (sortBy) {
      case 'stars':
        return b.stargazers_count - a.stargazers_count;
      case 'forks':
        return b.forks_count - a.forks_count;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'updated':
      default:
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
  });
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm whitespace-nowrap">Sort by:</span>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Recently Updated</SelectItem>
              <SelectItem value="stars">Stars</SelectItem>
              <SelectItem value="forks">Forks</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedRepos.length > 0 ? (
          sortedRepos.map((repo) => (
            <RepositoryCard key={repo.id} repo={repo} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No repositories found
          </div>
        )}
      </div>
    </div>
  );
};

export default RepositoryList;
