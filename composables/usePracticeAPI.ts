import { ref } from 'vue';

interface SimulationResource {
  _id: string;
  simulationScenario: string;
  simulationContext: string;
  simulationOptions: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  difficulty: string;
  category: string;
}

interface DebateResource {
  _id: string;
  debateTopic: string;
  debateContext: string;
  debateTimeLimit: number;
  difficulty: string;
  category: string;
}

interface PolicyGuidanceResource {
  _id: string;
  policyGuidanceTitle: string;
  policyGuidanceContent: string;
  difficulty: string;
  category: string;
}

interface SubmissionResponse {
  message: string;
  submissionId: string;
}

interface PracticeSubmission {
  _id: string;
  submissionType: string;
  evaluationStatus: 'pending' | 'completed' | 'failed';
  aiEvaluation?: {
    score: number;
    feedback: string;
    strengths: string[];
    areasForImprovement: string[];
    suggestedNextSteps: string[];
  };
  createdAt: string;
  evaluatedAt?: string;
}

interface PracticeStats {
  _id: string;
  count: number;
  completedCount: number;
  averageScore: number;
}

interface GroupedPracticeResources {
  simulations: SimulationResource[];
  debates: DebateResource[];
  policyGuidance: PolicyGuidanceResource[];
}

export const usePracticeAPI = () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const runtimeConfig = useRuntimeConfig();
  const API_BASE = runtimeConfig.public.apiBase || 'http://localhost:8080/api';

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || sessionStorage.getItem('token');
    }
    return null;
  };

  const handleError = (err: any): string => {
    if (err instanceof Error) {
      return err.message;
    }
    return 'An error occurred';
  };

  async function getSimulationResources(): Promise<SimulationResource[]> {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await fetch(`${API_BASE}/practice/resources?type=simulation`);
      if (!response.ok) throw new Error('Failed to fetch simulations');
      return await response.json();
    } catch (err) {
      error.value = handleError(err);
      console.error('Error fetching simulations:', err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function getDebateResources(): Promise<DebateResource[]> {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await fetch(`${API_BASE}/practice/resources?type=debateTopic`);
      if (!response.ok) throw new Error('Failed to fetch debates');
      return await response.json();
    } catch (err) {
      error.value = handleError(err);
      console.error('Error fetching debates:', err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function getPolicyResources(): Promise<PolicyGuidanceResource[]> {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await fetch(`${API_BASE}/practice/resources?type=policyGuidance`);
      if (!response.ok) throw new Error('Failed to fetch policy guidance');
      return await response.json();
    } catch (err) {
      error.value = handleError(err);
      console.error('Error fetching policy guidance:', err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function getAllPracticeResources(): Promise<GroupedPracticeResources> {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await fetch(`${API_BASE}/practice/resources/all`);
      if (!response.ok) throw new Error('Failed to fetch practice resources');

      const data = await response.json();
      return {
        simulations: data.simulations || [],
        debates: data.debates || [],
        policyGuidance: data.policyGuidance || []
      };
    } catch (err) {
      error.value = handleError(err);
      console.error('Error fetching grouped practice resources:', err);
      return {
        simulations: [],
        debates: [],
        policyGuidance: []
      };
    } finally {
      isLoading.value = false;
    }
  }

  async function submitSimulation(
    resourceId: string,
    option: string,
    reason: string
  ): Promise<SubmissionResponse> {
    try {
      isLoading.value = true;
      error.value = null;
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE}/practice/submit/simulation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resourceId, option, reason })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit simulation');
      }

      return await response.json();
    } catch (err) {
      error.value = handleError(err);
      console.error('Error submitting simulation:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function submitDebate(
    resourceId: string,
    topicIndex: number,
    response: string,
    timeSpent: number
  ): Promise<SubmissionResponse> {
    try {
      isLoading.value = true;
      error.value = null;
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      const res = await fetch(`${API_BASE}/practice/submit/debate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resourceId, topicIndex, response, timeSpent })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit debate');
      }

      return await res.json();
    } catch (err) {
      error.value = handleError(err);
      console.error('Error submitting debate:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function submitPolicy(
    title: string,
    problem: string,
    proposal: string
  ): Promise<SubmissionResponse> {
    try {
      isLoading.value = true;
      error.value = null;
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE}/practice/submit/policy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, problem, proposal })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit policy');
      }

      return await response.json();
    } catch (err) {
      error.value = handleError(err);
      console.error('Error submitting policy:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function getUserSubmissions(): Promise<PracticeSubmission[]> {
    try {
      isLoading.value = true;
      error.value = null;
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE}/practice/submissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch submissions');
      return await response.json();
    } catch (err) {
      error.value = handleError(err);
      console.error('Error fetching submissions:', err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function getSubmission(submissionId: string): Promise<PracticeSubmission | null> {
    try {
      isLoading.value = true;
      error.value = null;
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE}/practice/submissions/${submissionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch submission');
      return await response.json();
    } catch (err) {
      error.value = handleError(err);
      console.error('Error fetching submission:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function getUserStats(): Promise<PracticeStats[]> {
    try {
      isLoading.value = true;
      error.value = null;
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_BASE}/practice/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (err) {
      error.value = handleError(err);
      console.error('Error fetching stats:', err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    error,
    getSimulationResources,
    getDebateResources,
    getPolicyResources,
    getAllPracticeResources,
    submitSimulation,
    submitDebate,
    submitPolicy,
    getUserSubmissions,
    getSubmission,
    getUserStats
  };
};
