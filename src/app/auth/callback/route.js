import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // console.log('🔄 Auth callback triggered with code:', code ? 'present' : 'missing');

  if (code) {
    const cookieStore = cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name, options) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    try {
      // console.log('🔄 Exchanging code for session...');
      
      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('❌ Session exchange error:', error);
        return NextResponse.redirect(`${requestUrl.origin}?error=auth_failed`);
      }

      if (data.user) {
        // console.log('✅ User authenticated:', data.user.email);
        // console.log('🆔 User UUID:', data.user.id);

        // Insert into Users_Log table
        const { error: userLogError } = await supabase
          .from('Users_Log')
          .upsert({
            id: data.user.id,
            Name: data.user.user_metadata?.name || '',
            Email: data.user.email
          });

        if (userLogError) {
          console.error('❌ Users_Log creation error:', userLogError);
          return NextResponse.redirect(`${requestUrl.origin}?error=profile_creation_failed`);
        } else {
          // console.log('✅ User profile created in Users_Log table');
          // console.log('🔗 UUID ready for MongoDB:', data.user.id);
          
          // Redirect to dashboard page
          return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
        }
      }
    } catch (error) {
      console.error('❌ Auth callback error:', error);
      return NextResponse.redirect(`${requestUrl.origin}?error=callback_failed`);
    }
  }

  // Redirect to home page
  return NextResponse.redirect(requestUrl.origin);
} 