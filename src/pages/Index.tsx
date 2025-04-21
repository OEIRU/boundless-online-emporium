
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { useToast } from '@/components/ui/use-toast';
import { Film, Calendar, Clock, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Movie {
  _id: string;
  title: string;
  posterPath: string;
  releaseDate: string;
  runtime: number;
  ratings: {
    cinemaverse: {
      value: number;
    };
  };
}

const Index = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Имитация загрузки данных с API
    setTimeout(() => {
      // В реальном приложении здесь был бы запрос к API
      const mockPopularMovies = [
        {
          _id: '1',
          title: 'Начало',
          posterPath: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
          releaseDate: '2010-07-16',
          runtime: 148,
          ratings: { cinemaverse: { value: 9.2 } }
        },
        {
          _id: '2',
          title: 'Властелин колец: Братство Кольца',
          posterPath: '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
          releaseDate: '2001-12-19',
          runtime: 178,
          ratings: { cinemaverse: { value: 9.1 } }
        },
        {
          _id: '3',
          title: 'Матрица',
          posterPath: '/dXNAPwY7VrqMAo51EKhhCJfaGb5.jpg',
          releaseDate: '1999-03-31',
          runtime: 136,
          ratings: { cinemaverse: { value: 9.0 } }
        },
        {
          _id: '4',
          title: 'Интерстеллар',
          posterPath: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
          releaseDate: '2014-11-07',
          runtime: 169,
          ratings: { cinemaverse: { value: 8.9 } }
        }
      ];
      
      setPopularMovies(mockPopularMovies);
      setRecentlyAdded(mockPopularMovies.slice().reverse());
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч ${mins}м`;
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative h-[500px] mb-12 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img 
          src="https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg" 
          alt="Hero background" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative h-full flex flex-col justify-end p-8 z-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            Добро пожаловать в <span className="text-gradient">CinemaVerse</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mb-6">
            Отслеживайте фильмы, которые вы посмотрели, создавайте списки и делитесь своими впечатлениями с друзьями.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Film className="mr-2 h-5 w-5" /> Начать отслеживание
            </Button>
            <Button size="lg" variant="secondary">
              <Calendar className="mr-2 h-5 w-5" /> Последние релизы
            </Button>
          </div>
        </div>
      </section>
      
      {/* Popular Movies Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Популярные фильмы</h2>
          <Link to="/popular" className="text-primary hover:underline">
            Смотреть все
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            // Skeleton loaders
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-[300px] w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : (
            popularMovies.map((movie) => (
              <Link to={`/movie/${movie._id}`} key={movie._id}>
                <Card className="movie-card h-full">
                  <div className="relative overflow-hidden h-[300px]">
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-black/75 text-white px-2 py-1 rounded-md text-sm font-medium backdrop-blur-sm">
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
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </section>
      
      {/* Recently Added Movies */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Недавно добавленные</h2>
          <Link to="/latest" className="text-primary hover:underline">
            Смотреть все
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            // Skeleton loaders
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-[300px] w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : (
            recentlyAdded.map((movie) => (
              <Link to={`/movie/${movie._id}`} key={movie._id}>
                <Card className="movie-card h-full">
                  <div className="relative overflow-hidden h-[300px]">
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} 
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-movie-gold" />
                        <span className="text-white font-medium">
                          {movie.ratings.cinemaverse.value.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold truncate hover:text-primary transition-colors">
                      {movie.title}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(movie.releaseDate)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </section>
      
      {/* Join Community Section */}
      <section className="bg-card rounded-lg p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Присоединяйтесь к сообществу киноманов
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Отслеживайте свои просмотры, оценивайте фильмы, создавайте коллекции и присоединяйтесь к обсуждениям с единомышленниками.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Регистрация
            </Button>
            <Button size="lg" variant="outline">
              Узнать больше
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
