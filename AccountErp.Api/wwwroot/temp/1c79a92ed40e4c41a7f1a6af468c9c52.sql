SELECT
     lead.`lead_id` AS lead_lead_id,
     lead.`first_name` AS lead_first_name,
     lead.`last_name` AS lead_last_name,
     lead.`address` AS lead_address,
     lead.`lang_id` AS lead_lang_id,
     lead.`email` AS lead_email,
     lead.`phone` AS lead_phone,
     lead.`query_type_id` AS lead_query_type_id,
     lead.`lead_source_id` AS lead_lead_source_id,
     lead.`status_id` AS lead_status_id,
     lead.`priority_id` AS lead_priority_id,
     lead.`is_deleted` AS lead_is_deleted,
     lead.`created_by` AS lead_created_by,
     lead.`created_date` AS lead_created_date,
     lead.`updated_by` AS lead_updated_by,
     lead.`updated_date` AS lead_updated_date
FROM
     `lead` lead