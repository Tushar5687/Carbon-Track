import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [mines, setMines] = useState([]);

  useEffect(() => {
    if (isLoaded && user) {
      const userEmail = user.primaryEmailAddress?.emailAddress;
      if (userEmail) {
        const storedMines = localStorage.getItem(`mines_${userEmail}`);
        if (storedMines) {
          try {
            setMines(JSON.parse(storedMines));
          } catch (error) {
            console.error('Error parsing stored mines:', error);
            setMines([]);
          }
        }
      }
    }
  }, [user, isLoaded]);

  const addMine = (mineName, location, subsidiary) => {
    setMines(prev => {
      const newMine = {
        id: Date.now(),
        name: mineName,
        location: location,
        subsidiary: subsidiary,
        hasAnalysis: false,
        analysis: null,
        dashboard: null,
        insights: null,
        createdAt: new Date().toISOString()
      };
      const updatedMines = [...prev, newMine];
      
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      if (userEmail) {
        localStorage.setItem(`mines_${userEmail}`, JSON.stringify(updatedMines));
      }
      
      return updatedMines;
    });
  };

  const updateMineAnalysis = (mineId, analysisData) => {
    setMines(prev => {
      const updatedMines = prev.map(mine => {
        if (mine.id === mineId) {
          const dashboardData = generateDashboardData(analysisData.analysis, mine.name);
          const insightsData = generateInsightsData(analysisData.suggestions, mine.name);
          
          return { 
            ...mine, 
            hasAnalysis: true,
            analysis: {
              ...analysisData,
              updatedAt: new Date().toISOString()
            },
            dashboard: dashboardData,
            insights: insightsData
          };
        }
        return mine;
      });
      
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      if (userEmail) {
        localStorage.setItem(`mines_${userEmail}`, JSON.stringify(updatedMines));
      }
      
      return updatedMines;
    });
  };

  const generateInsightsData = (suggestionsText, mineName) => {
    if (!suggestionsText) {
      return {
        insights: [],
        generatedAt: new Date().toISOString(),
        totalInsights: 0,
        source: 'No data available'
      };
    }

    const insights = parseInsightsFromText(suggestionsText, mineName);
    
    return {
      insights,
      generatedAt: new Date().toISOString(),
      totalInsights: insights.length,
      source: 'AI Analysis'
    };
  };

  const parseInsightsFromText = (text, mineName) => {
    const insights = [];
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    let currentCategory = '';
    let currentRecommendations = [];
    let insightId = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (isCategoryHeader(line)) {
        if (currentCategory && currentRecommendations.length > 0) {
          const insight = createInsightFromCategory(currentCategory, currentRecommendations, insightId++, mineName);
          if (insight) insights.push(insight);
        }
        
        currentCategory = extractCategoryName(line);
        currentRecommendations = [];
      }
      else if (isRecommendationLine(line)) {
        const recommendation = extractRecommendation(line);
        if (recommendation && recommendation.length > 10) {
          currentRecommendations.push(recommendation);
        }
      }
      else if (line.length > 50 && line.match(/[.!?]$/)) {
        const sentences = line.split(/[.!?]+/).filter(s => s.trim().length > 20);
        sentences.forEach(sentence => {
          const cleanSentence = sentence.trim() + '.';
          if (isActionableSentence(cleanSentence)) {
            currentRecommendations.push(cleanSentence);
          }
        });
      }
    }

    if (currentCategory && currentRecommendations.length > 0) {
      const insight = createInsightFromCategory(currentCategory, currentRecommendations, insightId++, mineName);
      if (insight) insights.push(insight);
    }

    if (insights.length === 0) {
      return extractInsightsFromUnstructuredText(text, mineName);
    }

    return insights.slice(0, 8);
  };

  const isCategoryHeader = (line) => {
    return (
      line.match(/^#+\s+/) ||
      line.match(/^\d+\.\s+[A-Z]/) ||
      line.match(/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*:$/) ||
      line.match(/^\*\*.+\*\*$/) ||
      line.match(/^[A-Z\s]{5,}$/)
    );
  };

  const extractCategoryName = (line) => {
    return line
      .replace(/^#+\s*/, '')
      .replace(/^\d+\.\s*/, '')
      .replace(/^\*\*/, '')
      .replace(/\*\*$/, '')
      .replace(/:$/, '')
      .trim();
  };

  const isRecommendationLine = (line) => {
    return (
      line.match(/^[-*•]\s+/) ||
      line.match(/^\d+\.\s+/) ||
      line.match(/^[A-Z].*[.!?]$/) ||
      (line.match(/^[a-z]/) && line.length > 30)
    );
  };

  const extractRecommendation = (line) => {
    return line
      .replace(/^[-*•]\s+/, '')
      .replace(/^\d+\.\s+/, '')
      .trim();
  };

  const isActionableSentence = (sentence) => {
    const actionVerbs = [
      'implement', 'install', 'upgrade', 'optimize', 'reduce', 'improve', 'enhance',
      'develop', 'create', 'establish', 'conduct', 'perform', 'monitor', 'track',
      'train', 'educate', 'replace', 'switch', 'integrate', 'automate', 'streamline'
    ];
    
    const lowerSentence = sentence.toLowerCase();
    return actionVerbs.some(verb => lowerSentence.includes(verb));
  };

  const createInsightFromCategory = (category, recommendations, id, mineName) => {
    if (recommendations.length === 0) return null;

    const { priority, impact, timeline } = analyzeRecommendations(recommendations);
    
    const steps = recommendations.slice(0, 4).map(rec => {
      if (!rec.match(/[.!?]$/)) rec += '.';
      return rec;
    });

    while (steps.length < 3) {
      const additionalStep = generateAdditionalStep(category, steps);
      if (additionalStep) steps.push(additionalStep);
    }

    return {
      id,
      title: generateInsightTitle(category, recommendations[0]),
      steps,
      category,
      priority,
      impact,
      timeline,
      source: 'AI Analysis'
    };
  };

  const analyzeRecommendations = (recommendations) => {
    const text = recommendations.join(' ').toLowerCase();
    
    let priority = 'medium';
    let impact = 'Medium';
    let timeline = '6-12 months';

    const highPriorityWords = ['immediate', 'urgent', 'critical', 'essential', 'high priority', 'significant reduction', 'major impact'];
    const mediumPriorityWords = ['implement', 'upgrade', 'optimize', 'improve', 'enhance'];
    const lowPriorityWords = ['explore', 'research', 'consider', 'investigate', 'long-term', 'potential'];
    
    const highImpactWords = ['significant', 'major', 'substantial', 'dramatic', 'high impact'];
    const mediumImpactWords = ['moderate', 'improved', 'better', 'enhanced'];
    const lowImpactWords = ['minor', 'small', 'incremental', 'marginal'];

    if (highPriorityWords.some(word => text.includes(word))) {
      priority = 'high';
    } else if (lowPriorityWords.some(word => text.includes(word))) {
      priority = 'low';
    }

    if (highImpactWords.some(word => text.includes(word))) {
      impact = 'High';
    } else if (lowImpactWords.some(word => text.includes(word))) {
      impact = 'Low';
    }

    if (priority === 'high') {
      timeline = text.includes('quick') || text.includes('immediate') ? '1-3 months' : '3-6 months';
    } else if (priority === 'low') {
      timeline = '12+ months';
    }

    return { priority, impact, timeline };
  };

  const generateInsightTitle = (category, firstRecommendation) => {
    const actionMatch = firstRecommendation.match(/^([A-Za-z]+\s+[A-Za-z]+)/);
    if (actionMatch) {
      const action = actionMatch[1];
      return `${action} for ${category}`;
    }
    
    return `${category} Improvements`;
  };

  const generateAdditionalStep = (category, existingSteps) => {
    const existingText = existingSteps.join(' ').toLowerCase();
    
    const stepIdeas = {
      'operation': ['Monitor performance metrics regularly', 'Conduct regular maintenance checks', 'Train staff on new procedures'],
      'energy': ['Monitor energy consumption patterns', 'Conduct energy audit', 'Set energy reduction targets'],
      'equipment': ['Schedule regular equipment maintenance', 'Train operators on efficient usage', 'Monitor equipment performance'],
      'emission': ['Track emission reduction progress', 'Report on sustainability metrics', 'Set reduction targets'],
      'efficiency': ['Measure current efficiency levels', 'Identify improvement opportunities', 'Implement monitoring systems'],
      'technology': ['Research latest technologies', 'Evaluate technology options', 'Plan implementation strategy']
    };

    for (const [key, steps] of Object.entries(stepIdeas)) {
      if (category.toLowerCase().includes(key) && steps.length > 0) {
        for (const step of steps) {
          if (!existingText.includes(step.toLowerCase())) {
            return step;
          }
        }
      }
    }

    return 'Establish monitoring and evaluation framework';
  };

  const extractInsightsFromUnstructuredText = (text, mineName) => {
    const insights = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    let insightId = 1;
    
    const themes = groupSentencesByTheme(sentences);
    
    themes.forEach((theme) => {
      if (theme.sentences.length >= 2) {
        const { priority, impact, timeline } = analyzeRecommendations(theme.sentences);
        
        insights.push({
          id: insightId++,
          title: `${theme.name} for ${mineName}`,
          steps: theme.sentences.slice(0, 4).map(s => s.trim() + '.'),
          category: theme.name,
          priority,
          impact,
          timeline,
          source: 'AI Analysis'
        });
      }
    });

    return insights.slice(0, 6);
  };

  const groupSentencesByTheme = (sentences) => {
    const themes = [
      { name: 'Operational Efficiency', keywords: ['efficient', 'optimize', 'productivity', 'efficiency'] },
      { name: 'Energy Management', keywords: ['energy', 'power', 'electricity', 'fuel', 'consumption'] },
      { name: 'Equipment Optimization', keywords: ['equipment', 'machinery', 'vehicle', 'maintenance'] },
      { name: 'Emission Reduction', keywords: ['emission', 'carbon', 'co2', 'ghg', 'reduction'] },
      { name: 'Technology Implementation', keywords: ['technology', 'digital', 'automation', 'system'] },
      { name: 'Process Improvement', keywords: ['process', 'procedure', 'workflow', 'method'] }
    ];

    const result = themes.map(theme => ({
      name: theme.name,
      sentences: [],
      score: 0
    }));

    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase();
      let bestTheme = null;
      let bestScore = 0;

      result.forEach(theme => {
        const score = theme.keywords.reduce((sum, keyword) => {
          return sum + (lowerSentence.includes(keyword) ? 1 : 0);
        }, 0);

        if (score > bestScore) {
          bestScore = score;
          bestTheme = theme;
        }
      });

      if (bestTheme && bestScore > 0) {
        bestTheme.sentences.push(sentence);
        bestTheme.score += bestScore;
      }
    });

    return result.filter(theme => theme.sentences.length > 0)
                 .sort((a, b) => b.score - a.score);
  };

  const extractMetricsFromAnalysis = (analysisText) => {
    const metrics = {
      sources: [],
      scope1: 0,
      scope2: 0,
      scope3: 0,
      totalEmissions: 0
    };

    try {
      const sourceMatches = analysisText.match(/([A-Za-z\s]+):\s*(\d+)%/g) || [];
      sourceMatches.forEach(match => {
        const [_, source, percentage] = match.match(/([A-Za-z\s]+):\s*(\d+)%/) || [];
        if (source && percentage) {
          const cleanSource = source.trim();
          const percent = parseInt(percentage);
          const total = metrics.totalEmissions || 45200;
          const tons = Math.round((percent / 100) * total);
          
          let priority = 'low';
          if (percent >= 20) priority = 'high';
          else if (percent >= 10) priority = 'medium';

          metrics.sources.push({
            name: cleanSource,
            percentage: percent,
            tons: tons,
            priority: priority
          });
        }
      });

      const scope1Match = analysisText.match(/Scope 1[^:]*:\s*(\d+)%/i);
      const scope2Match = analysisText.match(/Scope 2[^:]*:\s*(\d+)%/i);
      const scope3Match = analysisText.match(/Scope 3[^:]*:\s*(\d+)%/i);

      if (scope1Match) metrics.scope1 = parseInt(scope1Match[1]);
      if (scope2Match) metrics.scope2 = parseInt(scope2Match[1]);
      if (scope3Match) metrics.scope3 = parseInt(scope3Match[1]);

      const totalMatch = analysisText.match(/(\d+[,.]?\d*)\s*(?:tons?|t)(?:\s*CO2e)?/i);
      if (totalMatch) {
        metrics.totalEmissions = parseInt(totalMatch[1].replace(',', '')) || 45200;
      } else {
        metrics.totalEmissions = metrics.sources.reduce((sum, source) => sum + source.tons, 0) || 45200;
      }

      if (metrics.sources.length > 0 && (metrics.scope1 === 0 && metrics.scope2 === 0 && metrics.scope3 === 0)) {
        metrics.scope1 = 60;
        metrics.scope2 = 15;
        metrics.scope3 = 25;
      }

    } catch (error) {
      console.error('Error extracting metrics from analysis:', error);
    }

    return metrics;
  };

  const generateDashboardData = (analysisText, mineName) => {
    const extractedMetrics = extractMetricsFromAnalysis(analysisText);
    
    const sources = extractedMetrics.sources.length > 0 
      ? extractedMetrics.sources 
      : generateDefaultSources(extractedMetrics.totalEmissions);

    const totalEmissions = extractedMetrics.totalEmissions;
    
    const scopeBreakdown = [
      { 
        name: 'Scope 1 (Direct)', 
        percentage: extractedMetrics.scope1, 
        tons: Math.round(extractedMetrics.scope1 / 100 * totalEmissions), 
        color: 'primary' 
      },
      { 
        name: 'Scope 2 (Indirect)', 
        percentage: extractedMetrics.scope2, 
        tons: Math.round(extractedMetrics.scope2 / 100 * totalEmissions), 
        color: 'orange' 
      },
      { 
        name: 'Scope 3 (Value Chain)', 
        percentage: extractedMetrics.scope3, 
        tons: Math.round(extractedMetrics.scope3 / 100 * totalEmissions), 
        color: 'yellow' 
      }
    ];

    const quarterlyTrend = generateTrendData(totalEmissions);
    const reductionProgress = calculateReductionProgress(quarterlyTrend);

    const largestSource = sources.reduce((max, source) => 
      source.percentage > max.percentage ? source : max, sources[0]);

    const mobileEquipmentShare = calculateMobileEquipmentShare(sources);
    const quickWins = calculateQuickWins(sources, totalEmissions);

    return {
      totalEmissions,
      largestSource: largestSource.name,
      reductionProgress: parseFloat(reductionProgress),
      mobileEquipmentShare: Math.round(mobileEquipmentShare),
      sources,
      scopeBreakdown,
      quarterlyTrend,
      quickWins,
      lastUpdated: new Date().toISOString(),
      dataSource: analysisText ? 'AI Analysis' : 'Estimated'
    };
  };

  const generateDefaultSources = (totalEmissions) => {
    return [
      { name: 'Heavy Machinery', percentage: 35, tons: Math.round(totalEmissions * 0.35), priority: 'high' },
      { name: 'Transportation Vehicles', percentage: 25, tons: Math.round(totalEmissions * 0.25), priority: 'high' },
      { name: 'Electricity Consumption', percentage: 15, tons: Math.round(totalEmissions * 0.15), priority: 'medium' },
      { name: 'Ventilation Systems', percentage: 10, tons: Math.round(totalEmissions * 0.10), priority: 'medium' },
      { name: 'Processing Activities', percentage: 8, tons: Math.round(totalEmissions * 0.08), priority: 'low' },
      { name: 'Other Sources', percentage: 7, tons: Math.round(totalEmissions * 0.07), priority: 'low' }
    ];
  };

  const generateTrendData = (currentEmissions) => {
    const baseReduction = 0.05;
    return [
      { quarter: 'Q1 2024', emissions: Math.round(currentEmissions * (1 + baseReduction * 0.75)) },
      { quarter: 'Q2 2024', emissions: Math.round(currentEmissions * (1 + baseReduction * 0.5)) },
      { quarter: 'Q3 2024', emissions: Math.round(currentEmissions * (1 + baseReduction * 0.25)) },
      { quarter: 'Q4 2024', emissions: currentEmissions }
    ];
  };

  const calculateReductionProgress = (trendData) => {
    if (trendData.length < 2) return 0;
    const start = trendData[0].emissions;
    const end = trendData[trendData.length - 1].emissions;
    return ((start - end) / start * 100).toFixed(1);
  };

  const calculateMobileEquipmentShare = (sources) => {
    const mobileSources = ['truck', 'vehicle', 'excavator', 'loader', 'dozer', 'mobile', 'transport'];
    return sources
      .filter(source => mobileSources.some(mobile => source.name.toLowerCase().includes(mobile)))
      .reduce((sum, source) => sum + source.percentage, 0);
  };

  const calculateQuickWins = (sources, totalEmissions) => {
    const largestSource = sources.reduce((max, source) => source.percentage > max.percentage ? source : max, sources[0]);
    
    return [
      { 
        title: 'Route Optimization', 
        reduction: Math.round(largestSource.tons * 0.05) || 850 
      },
      { 
        title: 'Equipment Efficiency', 
        reduction: Math.round(sources.filter(s => s.priority === 'high').reduce((sum, s) => sum + s.tons, 0) * 0.03) || 425 
      },
      { 
        title: 'Maintenance Improvements', 
        reduction: Math.round(totalEmissions * 0.0075) || 340 
      }
    ];
  };

  return (
    <UserContext.Provider value={{ 
      mines, 
      addMine,
      updateMineAnalysis 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProvider');
  }
  return context;
};