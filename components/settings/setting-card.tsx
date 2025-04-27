import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
type SettingCardProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

const SettingCard = ({ children, title, description }: SettingCardProps) => {
  return (
    <div>
      <Card>
        <CardHeader>
          {title && <CardTitle className="text-2xl">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
          {children}
        </CardHeader>
      </Card>
    </div>
  );
};

export default SettingCard;
