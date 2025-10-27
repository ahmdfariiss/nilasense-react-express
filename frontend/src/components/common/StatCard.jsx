import { Card, CardContent } from '@/components/ui/card';

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  borderColor, 
  iconColor,
  subtitle,
  trendIcon: TrendIcon,
  trendText,
  trendColor
}) {
  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-muted-foreground">{title}</p>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <p className="text-foreground" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
          {value}
        </p>
        {subtitle && (
          <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
            {subtitle}
          </p>
        )}
        {TrendIcon && trendText && (
          <div className="flex items-center gap-1 mt-2">
            <TrendIcon className={`w-4 h-4 ${trendColor}`} />
            <span className={trendColor} style={{ fontSize: '0.875rem' }}>
              {trendText}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

