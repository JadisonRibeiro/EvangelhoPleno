export type CelulaGeo = {
  id: string;
  name: string;
  rede: string | null;
  cell_type: string | null;
  neighborhood: string | null;
  leader_name: string | null;
  latitude: number;
  longitude: number;
  is_active: boolean;
};
