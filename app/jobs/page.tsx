'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, DollarSign, Users, CalendarDays, Filter } from 'lucide-react';

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [floatingElements, setFloatingElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:1337/api/jobs');
        const json = await res.json();
        const parsed = json.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          company: item.company,
          location: item.location,
          type: item.type,
          experience: item.experience,
          salary: item.salary,
          description: item.description?.[0]?.children?.[0]?.text || '',
          benefits: item.benefits || [],
          posted: item.posted || 'Recently posted',
        }));
        setJobs(parsed);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();

    const elements = [...Array(15)].map((_, i) => {
      const randomX = Math.random() * 50 - 25;
      const randomLeft = Math.random() * 100;
      const randomTop = Math.random() * 100;
      const randomDuration = 4 + Math.random() * 2;
      const randomDelay = Math.random() * 2;

      return (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-cyan-400 rounded-full opacity-20"
          animate={{ y: [0, -50, 0], x: [0, randomX, 0], rotate: [0, 360, 0] }}
          transition={{ duration: randomDuration, repeat: Infinity, delay: randomDelay }}
          style={{ left: `${randomLeft}%`, top: `${randomTop}%` }}
        />
      );
    });
    setFloatingElements(elements);
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesExperience = !experienceFilter || job.experience === experienceFilter;
    return matchesSearch && matchesLocation && matchesExperience;
  });

  return (
    <main className="pt-16">
      <section
        className="py-40 bg-cover bg-center text-white relative overflow-hidden"
        style={{ backgroundImage: "url('/images/corporate-large.webp')" }}
      >
        <div className="absolute inset-0 overflow-hidden">{floatingElements}</div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex justify-end">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-right max-w-xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">Find Your Dream Job</h1>
            <p className="text-xl md:text-2xl drop-shadow-md">
              Discover exciting opportunities at leading telecom companies
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 dark:bg-gray-800/30 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job title or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                >
                  <option value="">All Experience</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {filteredJobs.length} Jobs Available
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Find your next opportunity in the telecom industry
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{job.title}</h3>
                    <p className="text-blue-600 dark:text-cyan-400 font-medium">{job.company}</p>
                  </div>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">{job.type}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{job.experience}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>{job.posted}</span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {(job.benefits || []).map((benefit: string, i: number) => (
                    <span key={i} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                      {benefit}
                    </span>
                  ))}
                </div>

                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                  Apply Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Namfam */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Namfam?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're more than just a recruitment agency – we're your career partners.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Exclusive Opportunities',
                description: 'Access to positions not found elsewhere, directly from our partner companies.',
                icon: '🚀',
              },
              {
                title: 'Career Guidance',
                description: 'Personalized advice and support throughout your job search and career journey.',
                icon: '🎯',
              },
              {
                title: 'Industry Expertise',
                description: 'Deep knowledge of the telecom industry and what companies are looking for.',
                icon: '💡',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group relative p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-4xl mb-4 z-10 relative">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 z-10 relative">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 z-10 relative">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}