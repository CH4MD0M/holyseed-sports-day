import { useQuery } from '@tanstack/react-query';
import { supabaseClient } from '@/utils/supabase/client';

import type { Department } from '@/lib/constants/department';

type CellGroup = {
  id: string;
  leader_name: string;
  department: Department;
  team: '청팀' | '백팀';
};

export const useCellGroups = (department?: Department) => {
  return useQuery({
    queryKey: ['cell-groups', department],
    queryFn: async () => {
      if (!department) return [];

      const { data, error } = await supabaseClient
        .from('cell_groups')
        .select('*')
        .eq('department', department)
        .order('leader_name');

      if (error) throw error;

      return data as CellGroup[];
    },
    enabled: !!department,
  });
};
