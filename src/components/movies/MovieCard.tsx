
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Star } from 'lucide-react';

interface MovieCardProps {
  movie: {
    _id: string;
    title: string;
    posterPath: string;
    releaseDate: string;
    runtime?: number;
    ratings: {
      cinemaverse: {
        value: number;
      };
    };
  };
  variant?: 'default' | 'compact';
}

const MovieCard = ({ movie, variant = 'default' }: MovieCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatRuntime = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч ${mins}м`;
  };

  // Функция для определения класса рейтинга
  const getRatingClass = (rating: number) => {
    if (rating >= 8) return 'bg-rating-green';
    if (rating >= 6.5) return 'bg-rating-blue';
    if (rating >= 5) return 'bg-rating-yellow';
    return 'bg-rating-red';
  };

  if (variant === 'compact') {
    return (
      <Link to={`/movie/${movie._id}`}>
        <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-secondary transition-colors">
          <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded">
            <img 
              src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`} 
              alt={movie.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-sm hover:text-primary transition-colors line-clamp-1">
              {movie.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {formatDate(movie.releaseDate)}
            </p>
          </div>
          <div className={`ml-auto rating-badge ${getRatingClass(movie.ratings.cinemaverse.value)}`}>
            {movie.ratings.cinemaverse.value.toFixed(1)}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/movie/${movie._id}`}>
      <Card className="movie-card h-full">
        <div className="relative overflow-hidden h-[300px]">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} 
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className={`absolute top-2 right-2 ${getRatingClass(movie.ratings.cinemaverse.value)} text-white px-2 py-1 rounded-md text-sm font-medium backdrop-blur-sm`}>
            {movie.ratings.cinemaverse.value.toFixed(1)}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold truncate hover:text-primary transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(movie.releaseDate)}</span>
            {movie.runtime && (
              <>
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>{formatRuntime(movie.runtime)}</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MovieCard;
