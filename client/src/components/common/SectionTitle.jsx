const SectionTitle = ({ title, subtitle, center = false }) => {
    return (
      <div className={`${center ? 'text-center' : ''} mb-12`}>
        {subtitle && (
          <p className="text-[#c20e35] mb-2 uppercase tracking-wider text-sm font-medium">
            {subtitle}
          </p>
        )}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <div className={`w-16 h-1 bg-[#c20e35] mt-4 ${center ? 'mx-auto' : ''}`}></div>
      </div>
    );
  };
  
  export default SectionTitle;