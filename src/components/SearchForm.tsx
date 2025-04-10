
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchFormProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [username, setUsername] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-md">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
        <Input 
          type="text" 
          placeholder="GitHub username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button type="submit" disabled={isLoading || !username.trim()}>
        {isLoading ? 'Searching...' : 'Analyze'}
      </Button>
    </form>
  );
};

export default SearchForm;
