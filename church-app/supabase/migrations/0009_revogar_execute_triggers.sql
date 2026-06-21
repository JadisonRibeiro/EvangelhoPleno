-- =====================================================================
-- 0009_revogar_execute_triggers.sql
-- Remove os avisos "X pode executar função SECURITY DEFINER" das funções
-- de trigger/event-trigger: elas são executadas pelos triggers no contexto
-- do owner, então não precisam de EXECUTE para public/anon/authenticated.
-- Os helpers de RLS (get_my_role, is_my_cell, is_my_ministry, my_profile_id)
-- NÃO são tocados: authenticated precisa executá-los nas policies.
-- =====================================================================

revoke execute on function public.criar_amar_de_conversao()
  from public, anon, authenticated;

revoke execute on function public.sync_abrigo_conclusao()
  from public, anon, authenticated;

revoke execute on function public.sync_escola_conclusao()
  from public, anon, authenticated;

-- Função interna do Supabase (opção "RLS automático"): também é event-trigger
revoke execute on function public.rls_auto_enable()
  from public, anon, authenticated;
