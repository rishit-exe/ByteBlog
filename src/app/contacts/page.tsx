"use client";

import { useState } from "react";
import ProfileCard from "../(components)/ProfileCard";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, MessageCircle } from "lucide-react";

export default function ContactsPage() {
  const [contactMethod, setContactMethod] = useState<string>("");

  const handleContactClick = (method: string) => {
    setContactMethod(method);
    
    switch (method) {
      case "email":
        window.open("mailto:rishit.vns05@gmail.com", "_blank");
        break;
      case "github":
        window.open("https://github.com/rishit-exe", "_blank");
        break;
      case "linkedin":
        window.open("https://linkedin.com/in/the-rishit-srivastava/", "_blank");
        break;
      case "blog-source":
        window.open("https://github.com/rishit-exe/ByteBlog", "_blank");
        break;
      default:
        break;
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Ready to collaborate, discuss ideas, or just say hello? I'd love to hear from you!
          </p>
        </div>

        {/* Profile Card */}
        <div className="flex justify-center mb-8 sm:mb-12 px-4">
          <ProfileCard
            name="Rishit Srivastava"
            title="Full Stack Developer"
            handle="the-rishit-srivastava"
            status="Available for work"
            contactText="Contact Me"
            avatarUrl="/mypic.jpg"
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={false}
            onContactClick={() => handleContactClick("email")}
          />
        </div>

        {/* Let's Work Together Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto mb-8 sm:mb-12 mx-4 sm:mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">Let's Work Together</h2>
          <p className="text-gray-300 mb-4 sm:mb-6 text-center max-w-2xl mx-auto text-sm sm:text-base px-4">
            Have a project in mind or just want to chat? Feel free to reach out through any of the methods below.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 text-white rounded-full text-xs sm:text-sm font-medium">Web Development</span>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 text-white rounded-full text-xs sm:text-sm font-medium">Full Stack</span>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 text-white rounded-full text-xs sm:text-sm font-medium">React/Next.js</span>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 text-white rounded-full text-xs sm:text-sm font-medium">Open Source</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start px-4 sm:px-0">
          {/* Social Links */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Connect With Me</h2>
            <div className="grid gap-3 sm:gap-4">
              <button
                onClick={() => handleContactClick("github")}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                  <Github className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-white font-semibold text-sm sm:text-base">GitHub</div>
                  <div className="text-gray-400 text-xs sm:text-sm truncate">github.com/rishit-exe</div>
                </div>
              </button>

              <button
                onClick={() => handleContactClick("linkedin")}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                  <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-white font-semibold text-sm sm:text-base">LinkedIn</div>
                  <div className="text-gray-400 text-xs sm:text-sm truncate">linkedin.com/in/the-rishit-srivastava/</div>
                </div>
              </button>

              <button
                onClick={() => handleContactClick("blog-source")}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                  <Github className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-white font-semibold text-sm sm:text-base">Blog Source</div>
                  <div className="text-gray-400 text-xs sm:text-sm">View this blog's source code</div>
                </div>
              </button>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Contact Methods</h2>
            <div className="grid gap-3 sm:gap-4">
              <button
                onClick={() => handleContactClick("email")}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-white font-semibold text-sm sm:text-base">Email</div>
                  <div className="text-gray-400 text-xs sm:text-sm truncate">rishit.vns05@gmail.com</div>
                </div>
              </button>

              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-white font-semibold text-sm sm:text-base">Location</div>
                  <div className="text-gray-400 text-xs sm:text-sm">Varanasi, India</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12 sm:mt-16 px-4">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              Let's Build Something Amazing Together
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              I'm always excited to work on new projects, collaborate with fellow developers, 
              and help bring innovative ideas to life. Whether you have a specific project in mind 
              or just want to discuss technology and development, I'd love to hear from you!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
