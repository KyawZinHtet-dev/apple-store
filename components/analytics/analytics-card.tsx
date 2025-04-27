import { Icon, LucideProps } from "lucide-react";
import { Card, CardHeader } from "../ui/card";
import { cn } from "@/lib/utils";
type AnalyticsCardProps = {
  count: number;
  title: string;
  icon: React.ReactNode;
};
const AnalyticsCard = ({ count, title, icon }: AnalyticsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className=" flex justify-between items-center">
          <h2 className="font-medium text-sm">{title}</h2>
          {icon}
        </div>
        <p className=" font-bold text-3xl">{count}+</p>
      </CardHeader>
    </Card>
  );
};

export default AnalyticsCard;
