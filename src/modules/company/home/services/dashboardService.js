import axios from '../../../../core/api/axios';

const dashboardService = {
  getStats: async () => {
    try {
      const response = await axios.get('/companies/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};

export default dashboardService;
