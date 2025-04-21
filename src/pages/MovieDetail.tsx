
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Star, Heart, PlayCircle, ListPlus, Share, MessageCircle } from 'lucide-react';

interface Movie {
  _id: string;
  title: string;
  originalTitle: string;
  overview: string;
  tagline: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  runtime: number;
  genres: string[];
  director: string;
  ratings: {
    tmdb: { value: number, count: number };
    imdb: { value: number, count: number };
    metacritic: number;
    rottenTomatoes: number;
    cinemaverse: { value: number, count: number };
  };
  cast: Array<{ name: string, character: string, profilePath: string }>;
  trailers: Array<{ name: string, key: string, site: string }>;
}

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Имитация загрузки данных с API
    setLoading(true);
    setTimeout(() => {
      // В реальном приложении здесь был бы запрос к API
      setMovie({
        _id: '1',
        title: 'Начало',
        originalTitle: 'Inception',
        overview: 'Кобб – талантливый вор, лучший из лучших в опасном искусстве извлечения: он крадет ценные секреты из глубин подсознания во время сна, когда человеческий разум наиболее уязвим.',
        tagline: 'Твой разум - место преступления',
        posterPath: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        backdropPath: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
        releaseDate: '2010-07-16',
        runtime: 148,
        genres: ['Боевик', 'Научная фантастика', 'Триллер'],
        director: 'Кристофер Нолан',
        ratings: {
          tmdb: { value: 8.4, count: 30845 },
          imdb: { value: 8.8, count: 2159449 },
          metacritic: 74,
          rottenTomatoes: 87,
          cinemaverse: { value: 9.2, count: 124 }
        },
        cast: [
          { name: 'Леонардо ДиКаприо', character: 'Кобб', profilePath: '/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg' },
          { name: 'Джозеф Гордон-Левитт', character: 'Артур', profilePath: '/mXkhxJevEgCiLQ68xBJBUcKgkzC.jpg' },
          { name: 'Эллиот Пейдж', character: 'Ариадна', profilePath: '/esf8fKlkXyiSWPXZy5iM0hjZlJn.jpg' },
          { name: 'Том Харди', character: 'Имс', profilePath: '/yxQUeFoOGgw4CZM51zTP6cftFpg.jpg' },
        ],
        trailers: [
          { name: 'Трейлер 1', key: 'YoHD9XEInc0', site: 'YouTube' }
        ]
      });
      setLoading(false);
    }, 1500);
  }, [id]);

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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="pt-8">
          <div className="relative">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <div className="max-w-7xl mx-auto px-4 relative z-10 -mt-32">
              <div className="flex flex-col md:flex-row gap-8">
                <Skeleton className="h-[450px] w-[300px] rounded-xl flex-shrink-0" />
                <div className="flex-1 mt-4 md:mt-32">
                  <Skeleton className="h-12 w-3/4 mb-4" />
                  <Skeleton className="h-6 w-1/2 mb-6" />
                  <div className="flex gap-4 mb-6">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!movie) {
    return (
      <PageLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Фильм не найден</h2>
          <Link to="/">
            <Button>Вернуться на главную</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  // Расчет класса для рейтинга
  const getRatingClass = (rating: number) => {
    if (rating >= 8) return 'rating-excellent';
    if (rating >= 6.5) return 'rating-good';
    if (rating >= 5) return 'rating-average';
    return 'rating-poor';
  };

  return (
    <PageLayout>
      <div className="pt-8">
        {/* Backdrop with gradient overlay */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background"></div>
          <img 
            src={`https://image.tmdb.org/t/p/original${movie.backdropPath}`} 
            alt={movie.title}
            className="w-full h-[400px] object-cover"
          />
          
          <div className="max-w-7xl mx-auto px-4 relative z-10 -mt-32">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Movie poster */}
              <div className="w-full md:w-auto flex-shrink-0">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                  alt={movie.title}
                  className="movie-poster w-[300px] h-[450px] object-cover mx-auto md:mx-0"
                />
              </div>
              
              {/* Movie details */}
              <div className="flex-1 mt-4 md:mt-32">
                <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
                {movie.originalTitle !== movie.title && (
                  <p className="text-muted-foreground mt-1">{movie.originalTitle}</p>
                )}
                
                {movie.tagline && (
                  <p className="italic text-muted-foreground mt-2">{movie.tagline}</p>
                )}
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {movie.genres.map((genre, index) => (
                    <Link to={`/genre/${genre}`} key={index} className="genre-badge">
                      {genre}
                    </Link>
                  ))}
                </div>
                
                <div className="flex flex-wrap items-center gap-6 mt-6">
                  <div className={`rating-badge ${getRatingClass(movie.ratings.cinemaverse.value)}`}>
                    {movie.ratings.cinemaverse.value.toFixed(1)}
                  </div>
                  
                  <div className="text-sm">
                    <div className="flex items-center mb-1">
                      <span className="font-semibold mr-2">IMDb:</span>
                      <Star className="h-4 w-4 text-movie-gold mr-1" />
                      <span>{movie.ratings.imdb.value}</span>
                      <span className="text-muted-foreground ml-1">({formatNumber(movie.ratings.imdb.count)})</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="font-semibold mr-2">TMDB:</span>
                      <Star className="h-4 w-4 text-movie-gold mr-1" />
                      <span>{movie.ratings.tmdb.value}</span>
                      <span className="text-muted-foreground ml-1">({formatNumber(movie.ratings.tmdb.count)})</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(movie.releaseDate)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm mt-1">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-6">
                  <Button className="bg-primary hover:bg-primary/90">
                    <PlayCircle className="mr-2 h-5 w-5" /> Смотреть трейлер
                  </Button>
                  <Button variant="secondary">
                    <ListPlus className="mr-2 h-5 w-5" /> Добавить в список
                  </Button>
                  <Button variant="outline">
                    <Heart className="mr-2 h-5 w-5" /> В избранное
                  </Button>
                  <Button variant="ghost">
                    <Share className="mr-2 h-5 w-5" /> Поделиться
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="mt-12">
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Обзор</TabsTrigger>
                  <TabsTrigger value="cast">Актёры</TabsTrigger>
                  <TabsTrigger value="reviews">Отзывы</TabsTrigger>
                  <TabsTrigger value="similar">Похожие</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <h2 className="text-2xl font-bold mb-4">Описание</h2>
                      <p className="text-lg leading-relaxed mb-6">{movie.overview}</p>
                      
                      <h3 className="text-xl font-bold mb-3">Режиссёр</h3>
                      <p className="mb-6">{movie.director}</p>
                      
                      {movie.trailers.length > 0 && (
                        <>
                          <h3 className="text-xl font-bold mb-3">Трейлер</h3>
                          <div className="aspect-video rounded-lg overflow-hidden mb-6">
                            <iframe 
                              width="100%" 
                              height="100%" 
                              src={`https://www.youtube.com/embed/${movie.trailers[0].key}`}
                              title={movie.trailers[0].name}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div>
                      <Card className="p-6">
                        <h3 className="text-xl font-bold mb-4">Информация</h3>
                        <dl className="space-y-4">
                          <div>
                            <dt className="text-sm text-muted-foreground">Оригинальное название</dt>
                            <dd className="font-medium">{movie.originalTitle}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Режиссёр</dt>
                            <dd className="font-medium">{movie.director}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Дата выхода</dt>
                            <dd className="font-medium">{formatDate(movie.releaseDate)}</dd>
                          </div>
                          <div>
                            <dt className="text-sm text-muted-foreground">Длительность</dt>
                            <dd className="font-medium">{formatRuntime(movie.runtime)}</dd>
                          </div>
                        </dl>
                      </Card>
                      
                      <div className="mt-6">
                        <h3 className="text-xl font-bold mb-4">Рейтинг</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>CinemaVerse</span>
                              <span className="font-semibold">{movie.ratings.cinemaverse.value.toFixed(1)}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary"
                                style={{ width: `${(movie.ratings.cinemaverse.value / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>IMDb</span>
                              <span className="font-semibold">{movie.ratings.imdb.value.toFixed(1)}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-movie-gold"
                                style={{ width: `${(movie.ratings.imdb.value / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Метакритик</span>
                              <span className="font-semibold">{movie.ratings.metacritic}</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500"
                                style={{ width: `${movie.ratings.metacritic}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="cast">
                  <h2 className="text-2xl font-bold mb-6">Актёрский состав</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {movie.cast.map((actor, index) => (
                      <Link to={`/person/${actor.name.split(' ').join('-')}`} key={index}>
                        <Card className="overflow-hidden hover:shadow-md transition-shadow">
                          <div className="aspect-[2/3] overflow-hidden">
                            <img 
                              src={`https://image.tmdb.org/t/p/w185${actor.profilePath}`}
                              alt={actor.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-sm truncate">{actor.name}</h3>
                            <p className="text-xs text-muted-foreground truncate">{actor.character}</p>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Отзывы</h2>
                    <Button>
                      <MessageCircle className="mr-2 h-5 w-5" /> Написать отзыв
                    </Button>
                  </div>
                  <div className="space-y-6">
                    <Card className="p-6">
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Отзывов пока нет. Будьте первым, кто оставит отзыв!</p>
                        <Button>
                          <MessageCircle className="mr-2 h-5 w-5" /> Написать отзыв
                        </Button>
                      </div>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="similar">
                  <h2 className="text-2xl font-bold mb-6">Похожие фильмы</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">Похожие фильмы не найдены</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MovieDetail;
