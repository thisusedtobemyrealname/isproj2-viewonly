// @ts-nocheck
import { AdminLog, CharityLog } from '@/app/admin/audit-log/function'
import { getURL } from '@/app/utils/url'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/dist/server/api-utils'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  const user_id = session?.user.id

  // //Checks if current user is a charity member or donor (It works)
  const { data: donor, error: error_1 } = await supabase
    .from('donor')
    .select('*')
    .eq('id', user_id)
  const { data: charity_member, error: error_2 } = await supabase
    .from('charity_member')
    .select('*')
    .eq('user_uuid', user_id)
  const { data: admin, error: error_3 } = await supabase
    .from('system_owner')
    .select('*')
    .eq('id', user_id)

  if (
    donor?.length === 1
  ) {
    return NextResponse.redirect(`${requestUrl.origin}/settings`, { status: 301 })
  } else if (
    charity_member?.length === 1
  ) {
    return NextResponse.redirect(`${requestUrl.origin}/dashboard/settings`, {
      status: 301,
    })
  } else if (
    admin?.length === 1
  ) {
    return NextResponse.redirect(`${requestUrl.origin}/admin/applications`, {
      status: 301,
    })
  } else {
    return NextResponse.redirect(`${requestUrl.origin}`, { status: 301 })
  }
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  supabase.auth.onAuthStateChange((event, session) => {
    if (event == 'SIGNED_IN') console.log('SIGNED_IN', session)
  })

  //CHECKS FOR LOGIN ERRORS
  if (error) {

    //DISPLAYS ERROR MESSAGE IN PAGE
    return NextResponse.redirect(`${requestUrl.origin}/login?err=${error.message}`, {
      status: 301,
    })
  }

  const user_id = user?.id

  // //Checks if current user is a charity member or donor (It works)
  const { data: donor, error: error_1 } = await supabase
    .from('donor')
    .select('*')
    .eq('id', user_id)
  const { data: charity_member, error: error_2 } = await supabase
    .from('charity_member')
    .select('*')
    .eq('user_uuid', user_id)
  const { data: admin, error: error_3 } = await supabase
    .from('system_owner')
    .select('*')
    .eq('id', user_id)

  if (donor?.length === 1) {
    return NextResponse.redirect(`${requestUrl.origin}/settings`, {
      status: 301,
    })
  } else if (charity_member?.length === 1) {
    CharityLog(charity_member![0].member_name + ' has logged in.', null)
    return NextResponse.redirect(`${requestUrl.origin}/dashboard/settings`, {
      status: 301,
    })
  } else if (admin?.length === 1) {
    AdminLog(admin![0].name + ' has logged in.')
    return NextResponse.redirect(`${requestUrl.origin}/admin/applications`, {
      status: 301,
    })
  }
}
 