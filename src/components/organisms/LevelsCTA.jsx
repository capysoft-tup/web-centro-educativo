import React from 'react';
import Icon from '../atoms/Icon';

/**
 * Componente LevelsCTA (Organismo)
 * Sección de llamada a la acción en la parte inferior para agendar visitas o descargar el PEI.
 * 
 * @param {Function} onDownloadPEI - Callback para simular la descarga del PEI.
 * @param {Function} onScheduleVisit - Callback para abrir el modal de agenda de visitas.
 */
const LevelsCTA = ({ onDownloadPEI, onScheduleVisit }) => {
  return (
    <section className="gradient-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Fondo decorativo traslúcido */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#A2CE56] via-[#F49A29] via-[#E85B9E] via-[#359AD4] to-[#7B74DA] pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-8">
        <h2 className="text-display-lg text-black font-extrabold font-headline">
          Únete a nuestra comunidad
        </h2>

        <p className="text-body-lg text-black font-bold font-medium font-body leading-relaxed">
          Descubre más sobre nuestro enfoque pedagógico o ven a conocer nuestras
          instalaciones de primera mano.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={onDownloadPEI}
            className="inline-flex justify-center items-center gap-2 bg-surface-container-lowest text-primary font-bold px-8 py-4 rounded-xl hover:bg-slate-50 active:scale-95 transition-all shadow-md cursor-pointer hover:scale-[1.02]"
          >
            <Icon
              name="download"
              className="text-lg flex items-center justify-center font-bold"
            />
            <span>Descargar Programa Institucional</span>
          </button>

          <button
            onClick={onScheduleVisit}
            className="inline-flex justify-center  text-white cleitems-center gap-2 bg-tertiary-container text-on-tertiary-container font-bold px-8 py-4 rounded-xl hover:bg-tertiary hover:text-white active:scale-95 transition-all shadow-md cursor-pointer hover:scale-[1.02]"
          >
            <Icon
              name="calendar_today"
              className="text-lg flex items-center justify-center"
            />
            <span>Agendar Visita</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default LevelsCTA;
