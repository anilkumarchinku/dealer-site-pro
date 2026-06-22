create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
    if coalesce(new.raw_app_meta_data ->> 'role', '') = 'super_admin' then
        return new;
    end if;

    insert into public.dealers (
        user_id,
        dealership_name,
        phone,
        email,
        location,
        onboarding_complete,
        onboarding_step
    ) values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'dealership_name', 'My Dealership'),
        coalesce(new.raw_user_meta_data ->> 'phone', ''),
        new.email,
        '',
        false,
        1
    )
    on conflict (user_id) do nothing;

    return new;
end;
$$;

create or replace function public.on_auth_user_created()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
    if coalesce(new.raw_app_meta_data ->> 'role', '') = 'super_admin' then
        return new;
    end if;

    insert into public.dealers (
        user_id,
        dealership_name,
        phone,
        email,
        location
    ) values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'dealership_name', 'My Dealership'),
        coalesce(new.raw_user_meta_data ->> 'phone', ''),
        coalesce(new.email, ''),
        ''
    )
    on conflict (user_id) do nothing;

    return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.on_auth_user_created() from public, anon, authenticated;
