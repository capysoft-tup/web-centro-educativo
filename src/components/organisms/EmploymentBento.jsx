import React from 'react';
import Icon from '../atoms/Icon';

/**
 * Componente EmploymentBento (Organismo)
 * Bento Grid para mostrar las distintas áreas de desarrollo.
 * 
 * @param {Function} onExploreArea - Callback disparado al hacer clic en explorar un área. Recibe el id del área.
 */
const EmploymentBento = ({ onExploreArea }) => {
  const areas = [
    {
      id: 'docencia',
      title: 'Docencia',
      description: 'Profesores, tutores y auxiliares apasionados por guiar el aprendizaje en todos los niveles.',
      icon: 'school',
      iconBgClass: 'bg-secondary-container text-on-secondary-container',
      linkText: 'Explorar vacantes docentes',
      textColor: 'text-secondary hover:text-secondary-dim'
    },
    {
      id: 'admin',
      title: 'Administración',
      description: 'Secretaría, contabilidad, recursos humanos y gestión institucional para mantener el motor en marcha.',
      icon: 'admin_panel_settings',
      iconBgClass: 'bg-primary-container text-on-primary-container',
      linkText: 'Explorar vacantes admin',
      textColor: 'text-primary hover:text-primary-dim'
    },
    {
      id: 'maestranza',
      title: 'Maestranza y Mantenimiento',
      description: 'Personal fundamental para asegurar espacios limpios, seguros y acogedores para toda la comunidad.',
      icon: 'cleaning_services',
      iconBgClass: 'bg-tertiary-container text-on-tertiary-container',
      linkText: 'Explorar vacantes soporte',
      textColor: 'text-tertiary hover:text-tertiary-dim'
    }
  ];

  return (
    <section className="flex flex-col gap-10 scroll-mt-24 text-left">
      <div className="flex flex-col gap-2">
        <h2 className="font-headline text-[2rem] font-bold text-on-surface">Áreas de Desarrollo</h2>
        <p className="font-body text-on-surface-variant">Encuentra el espacio donde tu talento brille más.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {areas.map((area) => (
          <div 
            key={area.id} 
            className="bg-surface-container-lowest rounded-[2rem] p-8 flex flex-col gap-6 shadow-xl shadow-blue-900/5 group hover:bg-surface-container-low transition-all duration-300 relative overflow-hidden border border-surface-container-highest hover:-translate-y-1"
          >
            <div className={`w-16 h-16 ${area.iconBgClass} rounded-2xl flex items-center justify-center`}>
              <Icon name={area.icon} filled={true} className="text-3xl" />
            </div>
            
            <div>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-2">{area.title}</h3>
              <p className="font-body text-on-surface-variant text-sm leading-relaxed">{area.description}</p>
            </div>
            
            <button 
              onClick={() => onExploreArea(area.id)}
              className={`mt-auto inline-flex items-center gap-2 ${area.textColor} font-bold text-sm transition-colors w-max cursor-pointer group-hover:translate-x-1 duration-200`}
            >
              {area.linkText} 
              <Icon name="arrow_forward" className="text-sm font-bold" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EmploymentBento;
