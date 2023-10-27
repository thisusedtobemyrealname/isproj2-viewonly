import supabase from "@/app/utils/supabase";
import { GetUID } from "@/app/utils/user_id";

export async function AdminLog({action}: any) {

    const userID = await GetUID

    const log = {
        id: userID,
        action: action
    }

    const { data, error } = await supabase.from('admin_audit_log').insert(log)
    console.log("ERROR IS: ", error)
}

export async function CharityLog({action}: any) {
    const userID = await GetUID
    const { data: charity_member, error: error_2 } = await supabase.from('charity_member').select('*, charity ( id, name )').eq('user_uuid', userID)
    const charity_id = charity_member?.map(member => member.charity?.id)

    const charityId = charity_id![0]

    const log = {
        id: userID,
        action: action,
        charity_id: charityId
    }

    const { data, error } = await supabase.from('charity_audit_log').insert(log)
    console.log("ERROR IS: ", error)
}