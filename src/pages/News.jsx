import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Icon from '../components/atoms/Icon';
import NewsCard from '../components/molecules/NewsCard';
import EventCard from '../components/molecules/EventCard';
import NewsHero from '../components/organisms/NewsHero';

import { images } from '../services/imagesConfig';
const { pool, robotica, feria, basket, lectura } = images;

const News = () => {
  // Mock event list data
  const events = [
    {
      id: 'event-1',
      day: '15',
      month: 'Nov',
      title: 'Día de la Familia',
      info: '10:00 AM - Campus Principal',
      icon: 'schedule',
      dateBgClass: 'bg-secondary-fixed text-on-secondary-fixed',
      glowClass: 'bg-secondary-container',
    },
    {
      id: 'event-2',
      day: '22',
      month: 'Nov',
      title: 'Concierto de Primavera',
      info: 'Auditorio Escolar',
      icon: 'location_on',
      dateBgClass: 'bg-primary-container text-on-primary-container',
      glowClass: 'bg-primary-container',
    },
    {
      id: 'event-3',
      day: '05',
      month: 'Dic',
      title: 'Muestra de Arte',
      info: 'Galería Principal',
      icon: 'palette',
      dateBgClass: 'bg-tertiary-container text-on-tertiary-container',
      glowClass: 'bg-tertiary-container',
    },
  ];

  // Featured large article data with local asset
  const featuredArticle = {
    id: 'featured-1',
    title: 'Feria de Ciencias 2024: Innovación Estudiantil',
    subtitle:
      'Nuestros alumnos de secundaria presentaron proyectos increíbles sobre energías renovables y robótica aplicada. ¡Un orgullo para toda la comunidad!',
    category: 'Destacado',
    categoryClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
    image: feria,
    buttonText: 'Leer más',
  };

  const initialSecondaryArticles = [
    {
      id: 'secondary-1',
      title: 'Nuevos Espacios de Lectura al Aire Libre',
      subtitle:
        'Hemos inaugurado tres nuevas zonas verdes equipadas especialmente para fomentar la lectura y el aprendizaje en contacto con la naturaleza durante los recreos.',
      category: 'Institucional',
      categoryClass: 'text-primary',
      image: lectura,
      buttonText: 'Ver detalles',
    },
    {
      id: 'secondary-2',
      title: 'Campeones del Torneo Intercolegial',
      subtitle:
        'Nuestra selección sub-16 de baloncesto se consagró campeona regional tras un emocionante partido final. Felicitaciones a los jugadores y al cuerpo técnico.',
      category: 'Deportes',
      categoryClass: 'text-secondary',
      image: basket,
      buttonText: 'Ver galería',
    },
  ];

  // State to hold lazy-loaded articles and UI actions
  const [secondaryArticles, setSecondaryArticles] = useState(
    initialSecondaryArticles
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleLoadMore = () => {
    setIsLoadingMore(true);

    setTimeout(() => {
      const extraArticles = [
        {
          id: 'secondary-3',
          title: 'Taller Maker: Robótica e Impresión 3D',
          subtitle:
            'Inscripciones abiertas para el nuevo taller maker donde los estudiantes aprenderán a diseñar, construir e imprimir sus propios prototipos tridimensionales.',
          category: 'Tecnología',
          categoryClass: 'text-tertiary',
          image: robotica,
          buttonText: 'Inscribirse',
        },
        {
          id: 'secondary-4',
          title: 'Inauguración de la Pileta Climatizada',
          subtitle:
            'A partir de la próxima semana comienzan los entrenamientos de natación libre y las clases curriculares en nuestro moderno complejo climatizado.',
          category: 'Deportes',
          categoryClass: 'text-secondary',
          image: pool,
          buttonText: 'Ver horarios',
        },
      ];

      setSecondaryArticles((prev) => [...prev, ...extraArticles]);
      setIsLoadingMore(false);
      setHasMore(false); // Hide the button since there is no more data to load
    }, 1200);
  };

  const handleCardInteraction = (title) => {
    alert(`Has hecho clic para leer los detalles de: "${title}"`);
  };

  return (
    <div className="relative min-h-screen bg-surface text-on-surface">
      <Navbar />

      <main className="pt-10 pb-10 px-6 md:px-12 max-w-7xl mx-auto flex flex-col">
        {/* News Hero Component (Organism) */}
        <NewsHero />

        {/* Bento Grid Layout (Articles & Events sidebar) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Featured News Molecule */}
          <NewsCard
            variant="featured"
            title={featuredArticle.title}
            subtitle={featuredArticle.subtitle}
            category={featuredArticle.category}
            categoryClass={featuredArticle.categoryClass}
            image={featuredArticle.image}
            buttonText={featuredArticle.buttonText}
            onButtonClick={() => handleCardInteraction(featuredArticle.title)}
          />

          {/* Upcoming Events sidebar (Mapped dynamic molecules) */}
          <aside className="md:col-span-4 flex flex-col gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                day={event.day}
                month={event.month}
                title={event.title}
                info={event.info}
                icon={event.icon}
                dateBgClass={event.dateBgClass}
                glowClass={event.glowClass}
                onClick={() => handleCardInteraction(event.title)}
              />
            ))}
          </aside>

          {/* Secondary News Grid (Mapped molecules) */}
          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            {secondaryArticles.map((article) => (
              <NewsCard
                key={article.id}
                variant="secondary"
                title={article.title}
                subtitle={article.subtitle}
                category={article.category}
                categoryClass={article.categoryClass}
                image={article.image}
                buttonText={article.buttonText}
                onButtonClick={() => handleCardInteraction(article.title)}
              />
            ))}
          </div>
        </div>

        {/* Load More Button Section */}
        {hasMore && (
          <div className="mt-12 flex justify-center animate-in fade-in duration-300">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-8 py-3.5 rounded-full font-bold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed shadow-md"
            >
              {isLoadingMore ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-on-surface"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Cargando noticias...</span>
                </>
              ) : (
                <>
                  <span>Ver más noticias</span>
                  <Icon name="refresh" className="text-lg font-bold" />
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default News;
