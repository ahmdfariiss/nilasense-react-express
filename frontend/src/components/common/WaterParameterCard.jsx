import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function WaterParameterCard({ 
  parameter, 
  value, 
  status, 
  icon: Icon, 
  borderColor, 
  iconColor,
  additionalInfo 
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'good':
        return <Badge className="bg-[#10b981] text-white">Sangat Baik</Badge>;
      case 'normal':
        return <Badge className="bg-[#0891b2] text-white">Normal</Badge>;
      case 'warning':
        return <Badge className="bg-[#f59e0b] text-white">Perhatian</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-muted-foreground">{parameter}</p>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <p className="text-foreground mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>
          {value}
        </p>
        {getStatusBadge(status)}
        {additionalInfo && (
          <p className="text-muted-foreground mt-2" style={{ fontSize: '0.75rem' }}>
            {additionalInfo}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

