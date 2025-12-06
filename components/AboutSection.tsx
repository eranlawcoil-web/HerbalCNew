
import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { useData } from './DataProvider';

export const AboutSection: React.FC = () => {
  const { aboutData, contactData } = useData();

  return (
    <section id="about" className="min-h-screen py-20 px-6 bg-white relative overflow-hidden snap-start flex flex-col justify-center">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-nature-lightSage/20 rounded-bl-full -z-0"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-16">
          
          <div className="w-full md:w-1/2 relative max-h-[50vh] flex justify-center">
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-nature-sage z-0 hidden md:block"></div>
            <img 
              src={aboutData.image} 
              alt="Herbalist Portrait" 
              className="relative z-10 w-full max-h-[50vh] object-cover rounded shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>

          <div className="w-full md:w-1/2 text-right">
            <h3 className="text-nature-sage uppercase tracking-widest mb-2 font-bold">{aboutData.title}</h3>
            <h2 className="text-4xl md:text-5xl font-serif text-nature-900 mb-6">{aboutData.subtitle}</h2>
            <p className="text-nature-800 text-lg leading-relaxed mb-4 font-light">
              {aboutData.paragraph1}
            </p>
            <p className="text-nature-800 text-lg leading-relaxed mb-8 font-light hidden md:block">
              {aboutData.paragraph2}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-t border-nature-200 pt-8">
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="p-3 bg-nature-100 rounded-full text-nature-darkSage group-hover:bg-nature-sage group-hover:text-white transition-colors">
                  <MapPin />
                </div>
                <div>
                  <h4 className="text-nature-900 font-bold text-lg">הקליניקה</h4>
                  <p className="text-gray-500">{contactData.address}</p>
                  <a href={contactData.addressLink} className="text-nature-sage font-bold text-sm hover:underline mt-1 block">נווט לשם</a>
                </div>
              </div>

              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="p-3 bg-nature-100 rounded-full text-nature-darkSage group-hover:bg-nature-sage group-hover:text-white transition-colors">
                   <Phone />
                </div>
                <div>
                  <h4 className="text-nature-900 font-bold text-lg">קביעת תורים</h4>
                  <p className="text-gray-500">{contactData.phone}</p>
                  <p className="text-gray-400 text-sm">{contactData.hoursText}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
