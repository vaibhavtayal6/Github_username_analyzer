
import React from 'react';
import { GitHubUser } from '../types/github';
import { Card, CardContent } from '@/components/ui/card';
import { Users, MapPin, Building, Link2, Twitter, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProfileOverviewProps {
  user: GitHubUser;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ user }) => {
  const joinedDate = new Date(user.created_at);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <img 
              src={user.avatar_url} 
              alt={`${user.login}'s avatar`} 
              className="w-24 h-24 md:w-40 md:h-40 rounded-full border-4 border-background"
            />
          </div>
          
          <div className="space-y-4 flex-1">
            <div>
              <h2 className="text-2xl font-bold">{user.name || user.login}</h2>
              <a 
                href={user.html_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                @{user.login}
              </a>
            </div>

            {user.bio && <p className="text-sm">{user.bio}</p>}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={16} /> 
              <span>Joined {formatDistanceToNow(joinedDate, { addSuffix: true })}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {user.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={16} /> 
                  <span>{user.location}</span>
                </div>
              )}
              
              {user.company && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building size={16} /> 
                  <span>{user.company}</span>
                </div>
              )}
              
              {user.blog && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Link2 size={16} /> 
                  <a 
                    href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {user.blog}
                  </a>
                </div>
              )}
              
              {user.twitter_username && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Twitter size={16} /> 
                  <a 
                    href={`https://twitter.com/${user.twitter_username}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    @{user.twitter_username}
                  </a>
                </div>
              )}
            </div>

            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span className="text-sm font-medium">{user.followers}</span>
                <span className="text-sm text-muted-foreground">followers</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{user.following}</span>
                <span className="text-sm text-muted-foreground">following</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileOverview;
