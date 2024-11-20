"use client";

import {
  Book,
  Podcast,
  Film,
  Tv,
  AppWindowMac,
  Clapperboard,
  Music,
  FlameKindling,
  Gamepad2,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/recommendations/Avatar";
import { Card, CardContent } from "@/components/recommendations/Card";
import { Badge } from "@/components/recommendations/Badge";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const MediaIcon = ({ type }) => {
  const icons = {
    book: Book,
    podcast: Podcast,
    movie: Film,
    series: Tv,
    music: Music,
    app: AppWindowMac,
    trailer: Clapperboard,
    documental: FlameKindling,
    videojuego: Gamepad2,
  };
  const Icon = icons[type];
  return <Icon className="h-4 w-4" />;
};

export function RecommendationCard({ item }) {
  return (
    <Card className="group mb-10 transition-shadow duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="mb-6 flex items-start gap-4">
          <Avatar className="border-primary h-12 w-12 border-2">
            <AvatarImage src={item.author.picture} alt={item.author.name} />
            {/* <AvatarFallback>{item.author[0]}</AvatarFallback> */}
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{item.author.name}</h3>
            {/* <p className="text-muted-foreground text-sm">{item.role}</p> */}
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <MediaIcon type={item.mediaType} />
            <span className="capitalize">{item.mediaType}</span>
          </Badge>
        </div>

        <div className="space-y-4">
          <h4 className="text-xl font-semibold">{item.title}</h4>

          <div className="flex gap-4">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-24 w-24 rounded-md object-cover"
              />
            )}
            <div className="flex-1">
              {/* <h5 className="mb-2 font-medium">{item.title}</h5> */}
              <p className="text-muted-foreground">{item.description}</p>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary mt-2 inline-block hover:underline"
                >
                  Ver {item.mediaType} →
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
