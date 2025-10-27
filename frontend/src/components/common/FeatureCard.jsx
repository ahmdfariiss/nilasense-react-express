import { Card, CardContent } from '@/components/ui/card';

export function FeatureCard({ icon, title, description, color }) {
  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4`}>
          {icon}
        </div>
        <h3 className="text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

