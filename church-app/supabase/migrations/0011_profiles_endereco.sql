-- =====================================================================
-- 0011_profiles_endereco.sql
-- Endereço e bairro do membro (colunas individuais do cadastro da igreja).
-- A coluna combinada "Endereço e Bairro" da planilha é redundante e ignorada.
-- =====================================================================

alter table profiles add column if not exists address text;
alter table profiles add column if not exists neighborhood text;
