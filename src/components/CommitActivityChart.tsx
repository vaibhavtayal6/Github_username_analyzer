
import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CommitActivityChartProps {
  commitData: number[];
  username: string;
}

interface ChartData {
  name: string;
  commits: number;
}

const CommitActivityChart: React.FC<CommitActivityChartProps> = ({ commitData, username }) => {
  // Transform commit data for the chart
  const chartData: ChartData[] = [
    { name: 'Sun', commits: commitData[0] },
    { name: 'Mon', commits: commitData[1] },
    { name: 'Tue', commits: commitData[2] },
    { name: 'Wed', commits: commitData[3] },
    { name: 'Thu', commits: commitData[4] },
    { name: 'Fri', commits: commitData[5] },
    { name: 'Sat', commits: commitData[6] },
  ];

  // Calculate total commits for the week
  const totalCommits = commitData.reduce((sum, count) => sum + count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <span>Commit Activity (Last Week)</span>
          <span className="text-sm font-normal text-muted-foreground">
            {totalCommits} total commits
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value} commits`, 'Commits']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="commits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-4">
          Note: This data represents commit activity from a sample of up to 5 repositories
        </p>
      </CardContent>
    </Card>
  );
};

export default CommitActivityChart;
