import AsyncStorage from '@react-native-async-storage/async-storage';

const SURVEYS_KEY = '@smart_app_surveys';

export const getSurveys = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(SURVEYS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load surveys', e);
    return [];
  }
};

export const saveSurvey = async (surveyData) => {
  try {
    const currentSurveys = await getSurveys();
    
    // Create new survey with ID and timestamp
    const newSurvey = {
      date: new Date().toISOString().split('T')[0], // default if not provided
      ...surveyData,
      id: Date.now().toString(),
    };
    
    // Add to the beginning of the list
    const updatedSurveys = [newSurvey, ...currentSurveys];
    await AsyncStorage.setItem(SURVEYS_KEY, JSON.stringify(updatedSurveys));
    
    return newSurvey;
  } catch (e) {
    console.error('Failed to save survey', e);
    throw e;
  }
};

export const deleteSurvey = async (id) => {
  try {
    const currentSurveys = await getSurveys();
    const updatedSurveys = currentSurveys.filter(survey => survey.id !== id);
    await AsyncStorage.setItem(SURVEYS_KEY, JSON.stringify(updatedSurveys));
    return true;
  } catch (e) {
    console.error('Failed to delete survey', e);
    return false;
  }
};

export const getSurveyStats = async () => {
  const surveys = await getSurveys();
  
  // Calculate today's surveys
  const today = new Date().toISOString().split('T')[0];
  const todaysSurveys = surveys.filter(s => s.date.startsWith(today)).length;
  
  return {
    total: surveys.length,
    today: todaysSurveys,
    recent: surveys.slice(0, 5) // Get 5 most recent
  };
};
