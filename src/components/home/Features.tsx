import { Brain, Star, Users } from "lucide-react";
import React from "react";

const Features = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8 mt-16">
      <div className="text-center group">
        <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
          <Brain className="h-8 w-8 text-primary-600" />
        </div>
        <h3 className="font-heading text-xl font-semibold text-textPrimary mb-3">
          AI-Powered Analysis
        </h3>
        <p className="text-textSecondary leading-relaxed">
          Advanced AI identifies key concepts, relationships, and structures in
          any knowledge domain
        </p>
      </div>

      <div className="text-center group">
        <div className="bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
          <Users className="h-8 w-8 text-accent-600" />
        </div>
        <h3 className="font-heading text-xl font-semibold text-textPrimary mb-3">
          Collaborative Learning
        </h3>
        <p className="text-textSecondary leading-relaxed">
          Share your maps publicly, explore others' work, and build knowledge
          together
        </p>
      </div>

      <div className="text-center group">
        <div className="bg-gradient-to-br from-success-100 to-success-200 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
          <Star className="h-8 w-8 text-success-600" />
        </div>
        <h3 className="font-heading text-xl font-semibold text-textPrimary mb-3">
          Interactive Exploration
        </h3>
        <p className="text-textSecondary leading-relaxed">
          Navigate complex topics with interactive visualizations and detailed
          insights
        </p>
      </div>
    </div>
  );
};

export default Features;
