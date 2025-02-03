import React, { useState, useEffect } from 'react';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fetch events from your backend
    fetch('http://localhost:8081/events')
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error:', error));

    setTimeout(() => setVisible(true), 500);
  }, []);

  // Mock events data (replace with actual data from backend)
  const upcomingEvents = [
    {
      id: 1,
      name: "Half Bad Live",
      date: "2025-02-14",
      time: "20:00",
      location: "Kablys + Kultūra",
      description: "Join us for an unforgettable night of Drum & Bass music!",
      imageUrl: "/images/event1.jpg"
    },
    {
      id: 2,
      name: "DNB Summer Festival",
      date: "2025-07-15",
      time: "18:00",
      location: "Lukiškių kalėjimas 2.0",
      description: "The biggest DNB event of the summer featuring international artists",
      imageUrl: "/images/event2.jpg"
    },
    {
      id: 3,
      name: "Bass Night",
      date: "2025-03-20",
      time: "22:00",
      location: "Tamsta Club",
      description: "A night of deep bass and electronic beats",
      imageUrl: "/images/event3.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#4B0000] to-[#000000] text-white">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className={`text-5xl font-bold text-[#FFD700] mb-6 animate-pulse transition-all duration-1000 ease-in-out ${visible ? 'opacity-100 transform scale-100 blur-0' : 'opacity-0 transform scale-150 blur-sm'}`}>
            Upcoming Events
          </h1>
          <p className="text-2xl text-gray-300 mb-12">Join us for unforgettable nights of music</p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="relative py-20 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className={`bg-black bg-opacity-80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border-2 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-500 transform hover:scale-105 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="relative mb-6 aspect-w-16 aspect-h-9">
                  <img
                    src={event.imageUrl || "/images/default-event.jpg"}
                    alt={event.name}
                    className="w-full h-48 object-cover rounded-lg shadow-xl ring-4 ring-[#FFD700]/20"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/default-event.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-30 rounded-lg"></div>
                </div>
                
                <h2 className="text-2xl font-bold text-[#FFD700] mb-4">{event.name}</h2>
                
                <div className="space-y-4 text-gray-300">
                  <p className="flex items-center">
                    <span className="mr-2">📅</span>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="flex items-center">
                    <span className="mr-2">⏰</span>
                    {event.time}
                  </p>
                  <p className="flex items-center">
                    <span className="mr-2">📍</span>
                    {event.location}
                  </p>
                </div>
                
                <p className="text-gray-300 my-6">{event.description}</p>
                
                <button className="w-full bg-[#FFD700] hover:bg-[#FFD700]/80 text-black font-bold py-3 px-8 rounded-full transform transition-all duration-300 hover:scale-105">
                  Get Tickets
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative text-center py-20 px-8 z-30">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4B0000] via-black to-[#4B0000] opacity-50"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[#FFD700] mb-6">Stay Updated</h2>
          <p className="text-xl text-gray-300 mb-8">Subscribe to our newsletter for exclusive event updates and early bird tickets</p>
          
          <form className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full bg-black bg-opacity-50 border-2 border-[#FFD700]/20 focus:border-[#FFD700]/40 text-white placeholder-gray-400 outline-none"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-[#FFD700] hover:bg-[#FFD700]/80 text-black font-bold rounded-full transform transition-all duration-300 hover:scale-105"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
      <footer className="mt-auto bg-black bg-opacity-90 text-gray-400 py-4 text-center">
        <p>© 2025 All Rights Reserved. HALF BAD™</p>
        <div className="mt-2">
          <ul className="flex justify-center space-x-6">
            <li>
              <a href="mailto:your-email@example.com" className="hover:text-white">Email</a>
            </li>
            <li>
              <a href="https://www.facebook.com/pusiaublogas/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a>
            </li>
            <li>
              <a href="https://www.instagram.com/half_bad_dnb/?locale=en%2F" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default EventsPage;
