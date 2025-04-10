
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitHubRepo } from '../types/github';
import { Star, GitFork, Eye, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RepositoryCardProps {
  repo: GitHubRepo;
}

// Function to get language color
const getLanguageColor = (language: string | null): string => {
  const colors: Record<string, string> = {
    JavaScript: 'bg-yellow-300',
    TypeScript: 'bg-blue-400',
    Python: 'bg-blue-500',
    Java: 'bg-red-500',
    'C#': 'bg-green-500',
    PHP: 'bg-purple-500',
    Ruby: 'bg-red-600',
    Go: 'bg-blue-300',
    HTML: 'bg-orange-500',
    CSS: 'bg-pink-500',
    Swift: 'bg-orange-600',
    Kotlin: 'bg-purple-400',
    Rust: 'bg-amber-600',
  };
  
  return language ? colors[language] || 'bg-gray-500' : 'bg-gray-300';
};

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repo }) => {
  const updatedAt = new Date(repo.updated_at);
  
  return (
    <Card className="h-full flex flex-col hover:border-primary transition-colors">
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start">
          <a 
            href={repo.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold text-lg hover:text-primary transition-colors"
          >
            {repo.name}
          </a>
          
          {repo.fork && (
            <Badge variant="outline" className="text-xs">Fork</Badge>
          )}
        </div>
        
        {repo.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {repo.description}
          </p>
        )}
        
        <div className="mt-4 flex flex-wrap gap-2">
          {repo.topics && repo.topics.slice(0, 3).map((topic) => (
            <Badge key={topic} variant="secondary" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
        {repo.language && (
          <div className="flex items-center gap-1">
            <span className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></span>
            <span>{repo.language}</span>
          </div>
        )}
        
        {repo.stargazers_count > 0 && (
          <div className="flex items-center gap-1">
            <Star size={14} />
            <span>{repo.stargazers_count}</span>
          </div>
        )}
        
        {repo.forks_count > 0 && (
          <div className="flex items-center gap-1">
            <GitFork size={14} />
            <span>{repo.forks_count}</span>
          </div>
        )}
        
        <div className="flex items-center gap-1 ml-auto">
          <Clock size={14} />
          <span>Updated {formatDistanceToNow(updatedAt, { addSuffix: true })}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RepositoryCard;
