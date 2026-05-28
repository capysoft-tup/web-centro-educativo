import React from 'react';
import GalleryCard from '../molecules/GalleryCard';
import Icon from '../atoms/Icon';

/**
 * Componente GalleryGrid (Organismo)
 * Grid tipo Bento responsivo para mostrar los espacios del colegio.
 * 
 * @param {Function} onVisitClick - Callback disparado al hacer clic en "Agendar Visita".
 */
const GalleryGrid = ({ onVisitClick }) => {
  
  // Datos estructurados de la galería de fotos
  const spaces = [
    {
      id: 'aquatic',
      title: 'Complejo Acuático',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9gYLkf4MLJgf5tSvRs9Ubr1kV76uhJeNaUwT0zbvsXezJ4bdXli-GSxerV8iXCaIVBwPrVzgdKKrMSY0N2wxf15OIwJQ3CTyJlbCpa-WRRomInjbSUgXhQ74hqm2XUcy0tnRm_sNhG8egZXVHO8Th5iFiyk6chcRQpsuTMh0rwqodgurba62fh007zF-DsuXjEv5Xab7q4PKq2JBLHsyeJSzxtxIr6qRRq_dsS2Ffq0N5RS4ELIn7rjoZxlvoeyhbnTNTT0AATyI',
      altText: 'Vista de la pileta olímpica techada y bien iluminada',
      badgeText: 'Deporte y Bienestar',
      spanClass: 'col-span-1 md:col-span-2 row-span-2'
    },
    {
      id: 'football',
      title: 'Canchas Profesionales',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcXgNXdh8ZlLOe8d_i_v4ALchGCck9XA6dq4rZDlO3W1ELRlFI2IURxD11RfAy5G7TJhuKvWRFi6sKYb-aHrHoEQ_QxDJP56Gd_Hcl4KrmPPrDdzfQSvcyqwozhbEG_IpxNISYYUacYa6i3jWJhV7PcDN1RK-YRiVzGxsWhkCxH4d9hC_yI4wELbhgZSZ6kO-9F4RFuGSfKfQo6aNPcxeZO74VSWxZK-H4O8ZmuSnDKQJn13fw6qsCbusgVy2hIak-RXTZnHqjK8Q',
      altText: 'Cancha de fútbol de césped sintético profesional',
      spanClass: 'col-span-1 md:col-span-2 row-span-1'
    },
    {
      id: 'lab',
      title: 'Laboratorio Maker',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzMJHFAcYaE11z11AfAvAEvFv9ko10LS1qI8apfWxreV2IxTmG-33TsMAUuP1ATmPSu4JKgsnqvl5LGSFWKuGzZz_Pz6tSHMZS0I1rcLESIlBWBcYMGiMHfysPgtP3EklFw-OK5HFGabCtEmACO-8or_wCCmV_lXjJbKkB3caz4jiZHnIOssV_wqnbPkFCqoBvYJy4PlKy2OL1-VIW4ewCgjMTuVZCPSsk_wPybcFoIWMoULnAwlZv_tZGssiBUoKcYiIAYjmgaDM',
      altText: 'Estudiantes trabajando con microscopios y equipamiento tecnológico moderno',
      spanClass: 'col-span-1 md:col-span-1 row-span-1'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px] animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* 1. Renderizado dinámico de tarjetas de imagen mediante .map */}
      {spaces.map((space) => (
        <GalleryCard
          key={space.id}
          title={space.title}
          image={space.image}
          altText={space.altText}
          badgeText={space.badgeText}
          spanClass={space.spanClass}
        />
      ))}

      {/* 2. Tarjeta Informativa Especial ("+50 Espacios") usando Children */}
      <GalleryCard spanClass="col-span-1 md:col-span-1 row-span-1">
        <div className="absolute inset-0 bg-gradient-to-br from-tertiary to-tertiary-container flex flex-col justify-center items-center text-center p-6 text-on-tertiary">
          <Icon 
            name="photo_library" 
            filled={true} 
            className="text-on-tertiary text-5xl mb-4" 
          />
          <h2 className="font-headline text-xl font-bold text-on-tertiary mb-2">+50 Espacios</h2>
          <p className="font-body text-sm text-on-tertiary/90">Diseñados para el futuro</p>
        </div>
      </GalleryCard>

      {/* 3. Banner CTA Largo Inferior (Cierra el Bento Grid de 4 columnas) */}
      <div className="col-span-1 md:col-span-4 row-span-1 relative rounded-xl overflow-hidden group bg-surface-container-high border border-surface-container-highest flex items-center justify-between p-8 md:p-12 text-left">
        <div className="z-10 max-w-xl">
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface mb-4">
            ¿Quieres conocer las instalaciones en persona?
          </h2>
          <p className="font-body text-sm md:text-base text-on-surface-variant mb-6">
            Agenda una visita guiada y siente la energía de nuestro campus.
          </p>
          <button 
            onClick={onVisitClick}
            className="bg-secondary text-surface-container-lowest font-bold py-3.5 px-8 rounded-xl hover:bg-secondary-dim hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-secondary/20"
          >
            Agendar Visita
          </button>
        </div>
        
        {/* Imagen del lateral derecho visible únicamente en desktop */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/3">
          <img 
            alt="Estudiantes sonriendo compartiendo en el campus" 
            className="w-full h-full object-cover rounded-l-[4rem] transform hover:scale-102 transition-transform duration-500" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq9MW0WjCHbWQxZcDHSgV6kg-DF-nfgr-f5I2AZ7m2WUeuqQy1b-oqx9faoimB8yXpYPqcAFtd75ZR8bR5AjBqjpP0S2OIxLIbF_lmy3IueBxcwgsY7Lqyx6Mi0e0Kns8KaFIxo0JIt_E2AOWGBIRvpto9EiXpAy2nqlT4M5DxtWyMReupU9j1C33ka6iEGhlHmEjQx75PR5Bt1DnEnbX6Iogo6xQpRExHJlna5NHvOef7BtcuMILhHMe_NuZC3GQdJZ6rUthNV6o"
          />
        </div>
      </div>

    </div>
  );
};

export default GalleryGrid;
