-- =====================================================================
-- 0010_celulas_campos.sql
-- Estende o cadastro de células para espelhar o formulário da igreja:
-- cor da rede, tipo, cidade, geolocalização, foto e nome do líder (texto).
-- =====================================================================

alter table cells add column if not exists leader_name text;
alter table cells add column if not exists rede text;          -- Cor da rede (Amarela, Preta)
alter table cells add column if not exists cell_type text;     -- Tipo (Feminina, Masculina, ...)
alter table cells add column if not exists city text;
alter table cells add column if not exists latitude numeric;
alter table cells add column if not exists longitude numeric;
alter table cells add column if not exists photo_url text;
