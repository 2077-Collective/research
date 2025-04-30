import { createGhostMember, getGhostMember } from '$lib/services/ghost.service';
import { supabase } from '$lib/utils/supabase';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/reports';

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth error:', error);
      throw redirect(303, '/signin?error=auth');
    }

    if (data.user && data.user.email) {
      try {
        const existingMember = await getGhostMember(data.user.email as string);
        
        if (!existingMember) {
          await createGhostMember(
            data.user.email as string,
            data.user.user_metadata?.full_name || '',
            true
          );
          console.log('Ghost member created for OAuth user');
        }
      } catch (ghostError) {
        console.error('Error with Ghost integration:', ghostError);
      }
    }
  }

  throw redirect(303, next);
};