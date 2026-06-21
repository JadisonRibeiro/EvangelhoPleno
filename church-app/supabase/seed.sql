-- seed.sql — dados iniciais para desenvolvimento
-- Cria o perfil admin ligado ao seu usuário de login.
-- Troque o e-mail abaixo pelo do usuário criado em Autenticação → Users.
-- Idempotente: só insere se ainda não houver perfil ligado a esse usuário.

insert into profiles (full_name, role, is_active, user_id)
select 'Jadison Ribeiro', 'admin', true, u.id
from auth.users u
where u.email = 'SEU-EMAIL@exemplo.com'
  and not exists (
    select 1 from profiles p where p.user_id = u.id
  );
