import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { User, MapPin, Clock } from "lucide-react";
import type { Notice } from "../types/notice";
import { formatDistanceToNow } from 'date-fns';

interface NoticeCardProps {
  notice: Notice;
}

export const NoticeCard = ({ notice }: NoticeCardProps) => {
  // Always show relative time (e.g., '3 hours ago', '10 days ago', 'in 2 months')
  const createdAt = new Date(notice.createdAt);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-orange-500 bg-gradient-to-br from-orange-50 via-yellow-50 to-white text-black rounded-2xl" style={{ color: '#000', opacity: 1 }}>
      <CardHeader className="pb-3 text-black" style={{ color: '#000', opacity: 1 }}>
        <div className="flex items-start justify-between gap-2 text-black" style={{ color: '#000', opacity: 1 }}>
          <div className="flex items-center gap-2 flex-1 text-black" style={{ color: '#000', opacity: 1 }}>
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
              <User className="h-4 w-4 text-orange-500" />
            </div>
            <h3 className="font-bold text-lg text-orange-600 truncate" style={{ color: '#ea580c', opacity: 1 }}>{notice.name}</h3>
          </div>
          <Badge variant="secondary" className="shrink-0 bg-orange-100 text-orange-700 border-orange-200 font-semibold" style={{ color: '#ea580c', opacity: 1 }}>
            <MapPin className="h-3 w-3 mr-1 text-orange-500" />
            {notice.region}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 text-black" style={{ color: '#000', opacity: 1 }}>
        <p className="text-base text-black mb-3" style={{ color: '#000', opacity: 1 }}>{notice.message}</p>
        {notice.address && (
          <p className="text-sm text-black mb-1" style={{ color: '#000', opacity: 1 }}><span className="text-orange-600 font-semibold">Address:</span> {notice.address}</p>
        )}
        <p className="text-sm text-black mb-1" style={{ color: '#000', opacity: 1 }}><span className="text-orange-600 font-semibold">City:</span> {notice.city}</p>
        <p className="text-sm text-black mb-3" style={{ color: '#000', opacity: 1 }}><span className="text-orange-600 font-semibold">Contact:</span> {notice.contact}</p>
        <div className="flex items-center gap-1 text-xs text-orange-500 font-semibold" style={{ color: '#ea580c', opacity: 1 }}>
          <Clock className="h-3 w-3 text-orange-400" />
          {timeAgo}
        </div>
      </CardContent>
    </Card>
  );
};