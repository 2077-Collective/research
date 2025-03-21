import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

interface GhostMember {
    id: string;
    email: string;
    name?: string;
    subscribed?: boolean;
    [key: string]: any;
}

interface CreateMemberPayload {
    email: string;
    name?: string;
    subscribedToEmails?: boolean;
}

interface GetMemberPayload {
    email: string;
}

interface UpdateMemberPayload {
    id: string;
    updates: Partial<GhostMember>;
}

interface DeleteMemberPayload {
    id: string;
}

type ActionPayload =
    | { action: 'createMember'; payload: CreateMemberPayload }
    | { action: 'getMember'; payload: GetMemberPayload }
    | { action: 'updateMember'; payload: UpdateMemberPayload }
    | { action: 'deleteMember'; payload: DeleteMemberPayload };

export const POST: RequestHandler = async ({ request, fetch }) => {
    const requestData = await request.json() as ActionPayload;
    const { action, payload } = requestData;

    try {
        switch (action) {
            case 'createMember': {
                const { email, name = '', subscribedToEmails = true } = payload;
                const newMember = await createGhostMember(fetch, email, name, subscribedToEmails);
                return json(newMember);
            }

            case 'getMember': {
                const { email } = payload;
                const member = await getGhostMember(fetch, email);
                return json(member);
            }

            case 'updateMember': {
                const { id, updates } = payload;
                const updatedMember = await updateGhostMember(fetch, id, updates);
                return json(updatedMember);
            }

            case 'deleteMember': {
                const { id } = payload;
                const result = await deleteGhostMember(fetch, id);
                return json({ success: result });
            }

            default:
                return json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error: unknown) {
        console.error('Ghost API error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return json({ error: errorMessage }, { status: 500 });
    }
};

async function createGhostMember(
    fetch: typeof globalThis.fetch,
    email: string,
    name: string = '',
    subscribedToEmails: boolean = true
): Promise<GhostMember> {
    const response = await fetch(`${env.PUBLIC_GHOST_URL}/members/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Ghost ${env.GHOST_ADMIN_API_KEY}`
        },
        body: JSON.stringify({
            members: [{
                email,
                name,
                subscribed: subscribedToEmails
            }]
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create Ghost member: ${response.statusText}`);
    }

    const data = await response.json();
    return data.members[0];
}

async function getGhostMember(
    fetch: typeof globalThis.fetch,
    email: string
): Promise<GhostMember | null> {
    const response = await fetch(`${env.PUBLIC_GHOST_URL}/members/?filter=email:'${encodeURIComponent(email)}'`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Ghost ${env.GHOST_ADMIN_API_KEY}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to get Ghost member: ${response.statusText}`);
    }

    const data = await response.json();
    return data.members.length > 0 ? data.members[0] : null;
}

async function updateGhostMember(
    fetch: typeof globalThis.fetch,
    id: string,
    updates: Partial<GhostMember>
): Promise<GhostMember> {
    const response = await fetch(`${env.PUBLIC_GHOST_URL}/members/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Ghost ${env.GHOST_ADMIN_API_KEY}`
        },
        body: JSON.stringify({
            members: [updates]
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to update Ghost member: ${response.statusText}`);
    }

    const data = await response.json();
    return data.members[0];
}

async function deleteGhostMember(
    fetch: typeof globalThis.fetch,
    id: string
): Promise<boolean> {
    const response = await fetch(`${env.PUBLIC_GHOST_URL}/members/${id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Ghost ${env.GHOST_ADMIN_API_KEY}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to delete Ghost member: ${response.statusText}`);
    }

    return true;
}