-- Maintainer 360 view: one row per dealer with cross-table activity aggregates.
-- Powers the platform admin command center (/admin/360).
create or replace view admin_dealer_360 as
select
  d.id,
  d.dealership_name,
  d.logo_url,
  d.slug,
  d.subdomain,
  d.location,
  d.email,
  d.phone,
  d.vehicle_type,
  d.dealer_type,
  d.is_active,
  d.onboarding_complete,
  d.onboarding_step,
  d.created_at,
  (d.cyepro_api_key is not null and length(btrim(d.cyepro_api_key)) > 0) as cyepro_enabled,
  d.inventory_system,
  d.sells_four_wheelers,
  d.sells_two_wheelers,
  d.sells_three_wheelers,
  d.sells_new_cars,
  d.sells_used_cars,
  coalesce(l4.cnt, 0) as leads_4w,
  coalesce(l2.cnt, 0) as leads_2w,
  coalesce(l3.cnt, 0) as leads_3w,
  coalesce(l4.cnt, 0) + coalesce(l2.cnt, 0) + coalesce(l3.cnt, 0) as leads_total,
  coalesce(s4.cnt, 0) as service_4w,
  coalesce(s2.cnt, 0) as service_2w,
  coalesce(s3.cnt, 0) as service_3w,
  coalesce(s4.cnt, 0) + coalesce(s2.cnt, 0) + coalesce(s3.cnt, 0) as service_bookings,
  coalesce(v4.cnt, 0) as vehicles_4w,
  coalesce(v2.cnt, 0) as vehicles_2w,
  coalesce(v3.cnt, 0) as vehicles_3w,
  coalesce(v4.cnt, 0) + coalesce(v2.cnt, 0) + coalesce(v3.cnt, 0) as vehicles_total,
  coalesce(td.cnt, 0) as test_drives,
  coalesce(sr.cnt, 0) as sell_requests,
  coalesce(msg.cnt, 0) as messages_count,
  coalesce(rv.cnt, 0) as reviews_count,
  rv.avg_rating,
  coalesce(sub.active_subs, 0) as active_subscriptions,
  coalesce(sub.mrr_paise, 0) as mrr_paise,
  sub.plan as subscription_plan,
  coalesce(pay.amount_paise, 0) as revenue_paise
from dealers d
left join (select dealer_id, count(*) cnt from leads group by dealer_id) l4 on l4.dealer_id = d.id
left join (select dealer_id, count(*) cnt from tw_leads group by dealer_id) l2 on l2.dealer_id = d.id
left join (select dealer_id, count(*) cnt from thw_leads group by dealer_id) l3 on l3.dealer_id = d.id
left join (select dealer_id, count(*) cnt from car_service_bookings group by dealer_id) s4 on s4.dealer_id = d.id
left join (select dealer_id, count(*) cnt from tw_service_bookings group by dealer_id) s2 on s2.dealer_id = d.id
left join (select dealer_id, count(*) cnt from thw_service_bookings group by dealer_id) s3 on s3.dealer_id = d.id
left join (select dealer_id, count(*) cnt from vehicles group by dealer_id) v4 on v4.dealer_id = d.id
left join (select dealer_id, count(*) cnt from tw_vehicles group by dealer_id) v2 on v2.dealer_id = d.id
left join (select dealer_id, count(*) cnt from thw_vehicles group by dealer_id) v3 on v3.dealer_id = d.id
left join (select dealer_id, count(*) cnt from test_drive_bookings group by dealer_id) td on td.dealer_id = d.id
left join (select dealer_id, count(*) cnt from sell_requests group by dealer_id) sr on sr.dealer_id = d.id
left join (select dealer_id, count(*) cnt from messages group by dealer_id) msg on msg.dealer_id = d.id
left join (select dealer_id, count(*) cnt, round(avg(rating)::numeric, 1) avg_rating from reviews group by dealer_id) rv on rv.dealer_id = d.id
left join (
  select dealer_id,
    count(*) filter (where status in ('active', 'trialing')) as active_subs,
    sum(price_paise) filter (where status = 'active') as mrr_paise,
    max(plan) filter (where status in ('active', 'trialing')) as plan
  from domain_subscriptions group by dealer_id
) sub on sub.dealer_id = d.id
left join (
  select dealer_id, sum(amount_paise) amount_paise
  from payment_transactions
  where status in ('captured', 'paid', 'success', 'succeeded', 'completed')
  group by dealer_id
) pay on pay.dealer_id = d.id;
