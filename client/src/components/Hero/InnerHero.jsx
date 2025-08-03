const InnerHero = ({ title, subtitle, backgroundImage }) => {
    return (
      <section 
        className="relative bg-black h-[55vh] min-h-[350px] bg-cover bg-center bg-no-repeat flex items-center justify-center text-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/10" />
        
        <div className="container mx-auto px-4 z-10 text-white">
          <div className="max-w-3xl mx-auto">
            {subtitle && (
              <p className="text-[#c20e35] text-sm md:text-base mb-3 md:mb-4 uppercase tracking-wider ">
                {subtitle}
              </p>
            )}
            
            <h1 className="text-4xl md:text-4xl lg:text-5xl uppercase  mb-6 leading-tight">
              {title}
            </h1>
  
            {/* Optional decorative element */}
            <div className="w-20 h-1 bg-[#c20e35] mx-auto" />
          </div>
        </div>
      </section>
    );
  };
  
  export default InnerHero;