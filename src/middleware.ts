import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export async function middleware(req: NextRequest) {
  var charity_status : any
  const res = NextResponse.next()
  console.log(req)

  const originalUrl = req.nextUrl.protocol + req.headers.get('host') + req.nextUrl.pathname
  console.log("=========================================> " + originalUrl)

  // console.log('hello i am middleware')
  // console.log(req.cookies)
  const supabase = createMiddlewareClient({ req, res })
  const { data: { user }, error } = await supabase.auth.getUser();
  // console.log(data, error)
  console.log(user?.id)
  const uid = user?.id
  console.log("UID IS " + uid)

  const { data: donor, error: error_1 } = await supabase
    .from('donor')
    .select('*')
    .eq('id', uid)
  const { data: charity_member, error: error_2 } = await supabase
    .from('charity_member')
    .select('*, charity ( id, charity_verified )')
    .eq('user_uuid', uid)
  const { data: admin, error: error_3 } = await supabase
    .from('system_owner')
    .select('*')
    .eq('id', uid)

  console.log(donor)
  console.log(charity_member)
  console.log(admin)

  charity_member?.map(member => (
    charity_status = member.charity.charity_verified
  ))

  console.log("THE CHARITY STATUS IS: " + charity_status)

  // if (donor?.length === 1) {
  //   NextResponse.redirect('/settings' )
  // } else if (charity_member?.length === 1) {
  //   console.log("CHARITY IS CHARITY")
  // } else if (admin?.length === 1) {
  //   console.log('FUCK')
    
  // }

  if (originalUrl.includes('/admin')) {
    console.log('ADMIIIIIIIIIN')
    if (admin?.length !== 1) {
        console.log("NOT SIGNED IN")
        return Response.redirect('http://localhost:3000')
    
        
      }
  }
  else if (originalUrl.includes('/dashboard')) {
    console.log('CHARITY')
    if (charity_member?.length !== 1 && charity_status == false) {
      console.log("NOT A CHARITY FUCK OFF")
      return Response.redirect('http://localhost:3000')
      }
  }
  else if (originalUrl.includes('/settings')) {
    if (donor?.length !== 1) {
      console.log("NOT A DONOR FUCK OFF")
      return Response.redirect('http://localhost:3000')
    }
  }
  else if (originalUrl.includes('/owner-invite')) {
    if (user) {
      console.log("ALREADY AN ADMIN, SO FUCK OFF")
      return Response.redirect('http://localhost:3000')
    }
  }

  return res
}